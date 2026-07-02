import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

import {
  getProspects,
  createProspect,
  updateProspect,
  deleteProspect,
  convertToLead,
} from "../services/prospectService";

const useProspects = () => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  // ===========================
  // Load Prospects
  // ===========================
  const fetchProspects = async () => {
    try {
      setLoading(true);
      const data = await getProspects();
      const items = Array.isArray(data) ? data : data || [];
      setProspects(items);
    } catch (error) {
      console.error("Error loading prospects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  // ===========================
  // Add Prospect
  // ===========================
  const addProspect = async (prospect) => {
    try {
      const res = await createProspect(prospect);
      await fetchProspects();

      Toast.fire({
        icon: "success",
        title: "Prospect created successfully",
      });

      return res ? true : false;
    } catch (error) {
      console.error("addProspect error:", error?.response?.data || error?.message || error);
      const details =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        JSON.stringify(error?.response?.data) ||
        error?.message ||
        "Failed to create prospect";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: details,
      });
      return false;
    }
  };

  // ===========================
  // Update Prospect
  // ===========================
  const editProspect = async (id, prospect) => {
    try {
      const res = await updateProspect(id, prospect);
      await fetchProspects();
      Toast.fire({ icon: "success", title: "Prospect updated successfully" });
      return res ? true : false;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update prospect",
      });
      return false;
    }
  };

  // ===========================
  // Delete Prospect
  // ===========================
  const removeProspect = async (id) => {
    if (!window.confirm("Delete this prospect?")) return;

    try {
      await deleteProspect(id);
      fetchProspects();
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // Convert Prospect to Lead
  // ===========================
  const contactProspect = async (id) => {
    if (!window.confirm("Move this prospect to Leads?")) return;

    try {
      await convertToLead(id);
      fetchProspects();
      alert("Prospect moved to Leads successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // Search + Filter
  // ===========================
  const filteredProspects = prospects.filter((prospect) => {
    const search =
      prospect.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.contactPerson
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prospect.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const status =
      statusFilter === "All" ||
      prospect.status === statusFilter;

    const source =
      sourceFilter === "All" ||
      prospect.leadSource === sourceFilter;

    return search && status && source;
  });

  return {
    loading,

    prospects: filteredProspects,

    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    sourceFilter,
    setSourceFilter,

    addProspect,
    editProspect,
    removeProspect,
    contactProspect,

    refreshProspects: fetchProspects,
  };
};

export default useProspects;
