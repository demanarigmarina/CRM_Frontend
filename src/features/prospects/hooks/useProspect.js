import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import prospectService from "../services/prospectService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

function normalizeProspects(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.prospects)) return data.prospects;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getFullName(name) {
  if (!name) return "";

  return [name.firstName, name.middleInitial, name.lastName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function useProspect() {
  const [allProspects, setAllProspects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const fetchProspects = useCallback(async () => {
    setLoading(true);

    try {
      const data = await prospectService.getProspects();
      setAllProspects(normalizeProspects(data));
    } catch (error) {
      console.error("Error loading prospects:", error);

      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load prospects",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  const prospects = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return allProspects.filter((prospect) => {
      const representativeName = getFullName(prospect.representativeName);
      const ownerName = getFullName(prospect.ownerName);

      const searchableText = [
        prospect.companyName,
        prospect.natureOfBusiness,
        prospect.companyEmailAddress,
        prospect.phone,
        prospect.leadSource,
        prospect.status,
        representativeName,
        ownerName,
        prospect.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || searchableText.includes(keyword);

      const matchesStatus =
        statusFilter === "All" || prospect.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" || prospect.leadSource === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [allProspects, searchTerm, statusFilter, sourceFilter]);

  const addProspect = async (payload) => {
    try {
      const createdProspect = await prospectService.createProspect(payload);

      setAllProspects((prev) => [
        ...prev,
        createdProspect?.prospect || createdProspect,
      ]);

      Toast.fire({
        icon: "success",
        title: "Prospect created successfully",
      });

      return true;
    } catch (error) {
      console.error("Error creating prospect:", error);

      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create prospect",
      });

      return false;
    }
  };

  const editProspect = async (id, payload) => {
    try {
      const updatedProspect = await prospectService.updateProspect(id, payload);
      const nextProspect = updatedProspect?.prospect || updatedProspect;

      setAllProspects((prev) =>
        prev.map((prospect) =>
          prospect._id === id ? { ...prospect, ...nextProspect } : prospect
        )
      );

      Toast.fire({
        icon: "success",
        title: "Prospect updated successfully",
      });

      return true;
    } catch (error) {
      console.error("Error updating prospect:", error);

      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update prospect",
      });

      return false;
    }
  };

  const removeProspect = async (id) => {
    const result = await Swal.fire({
      title: "Delete prospect?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return false;

    try {
      await prospectService.deleteProspect(id);

      setAllProspects((prev) =>
        prev.filter((prospect) => prospect._id !== id)
      );

      Toast.fire({
        icon: "success",
        title: "Prospect deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error deleting prospect:", error);

      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete prospect",
      });

      return false;
    }
  };

  const markAsContacted = async (id) => {
    try {
      const updatedProspect = await prospectService.markAsContacted(id);
      const nextProspect = updatedProspect?.prospect || updatedProspect;

      setAllProspects((prev) =>
        prev.map((prospect) =>
          prospect._id === id
            ? {
                ...prospect,
                ...nextProspect,
                status: nextProspect?.status || "Contacted",
              }
            : prospect
        )
      );

      Toast.fire({
        icon: "success",
        title: "Prospect marked as contacted",
      });

      return true;
    } catch (error) {
      console.error("Error contacting prospect:", error);

      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update prospect",
      });

      return false;
    }
  };

  return {
    prospects,
    allProspects,
    loading,

    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    sourceFilter,
    setSourceFilter,

    fetchProspects,
    addProspect,
    editProspect,
    removeProspect,
    markAsContacted,

    contactProspect: markAsContacted,
  };
}