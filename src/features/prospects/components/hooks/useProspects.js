import { useEffect, useState } from "react";

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // ===========================
  // Load Prospects
  // ===========================
  const fetchProspects = async () => {
    try {
      setLoading(true);

      const data = await getProspects();

      console.log("Prospects from API:", data);

      setProspects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading prospects:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }

      setProspects([]);
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
      await createProspect(prospect);
      await fetchProspects();
    } catch (error) {
      console.error("Error adding prospect:", error);
    }
  };

  // ===========================
  // Update Prospect
  // ===========================
  const editProspect = async (id, prospect) => {
    try {
      await updateProspect(id, prospect);
      await fetchProspects();
    } catch (error) {
      console.error("Error updating prospect:", error);
    }
  };

  // ===========================
  // Delete Prospect
  // ===========================
  const removeProspect = async (id) => {
    if (!window.confirm("Delete this prospect?")) return;

    try {
      await deleteProspect(id);
      await fetchProspects();
    } catch (error) {
      console.error("Error deleting prospect:", error);
    }
  };

  // ===========================
  // Convert Prospect
  // ===========================
  const contactProspect = async (id) => {
    if (!window.confirm("Move this prospect to Leads?")) return;

    try {
      await convertToLead(id);
      await fetchProspects();
      alert("Prospect moved to Leads successfully.");
    } catch (error) {
      console.error("Error converting prospect:", error);
    }
  };

  // ===========================
  // Search & Filter
  // ===========================
  const filteredProspects = prospects.filter((prospect) => {
    const search = searchTerm.toLowerCase();

    const companyMatch =
      prospect.companyName?.toLowerCase().includes(search);

    const companyEmailMatch =
      prospect.companyEmailAddress?.toLowerCase().includes(search);

    const representativeMatch =
      [
        prospect.representativeName?.firstName,
        prospect.representativeName?.middleInitial,
        prospect.representativeName?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search);

    const ownerMatch =
      [
        prospect.ownerName?.firstName,
        prospect.ownerName?.middleInitial,
        prospect.ownerName?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search);

    const phoneMatch =
      prospect.phone?.toLowerCase().includes(search);

    const cityMatch =
      prospect.businessAddress?.city
        ?.toLowerCase()
        .includes(search);

    const provinceMatch =
      prospect.businessAddress?.province
        ?.toLowerCase()
        .includes(search);

    const status =
      statusFilter === "All" ||
      prospect.status === statusFilter;

    const source =
      sourceFilter === "All" ||
      prospect.leadSource === sourceFilter;

    return (
      (
        companyMatch ||
        companyEmailMatch ||
        representativeMatch ||
        ownerMatch ||
        phoneMatch ||
        cityMatch ||
        provinceMatch
      ) &&
      status &&
      source
    );
  });

  // ===========================
  // Reset Page on Search
  // ===========================
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sourceFilter]);

  // ===========================
  // Pagination
  // ===========================
  const totalEntries = filteredProspects.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;

  const paginatedProspects = filteredProspects.slice(
    startIndex,
    endIndex
  );

  return {
    loading,
    prospects: paginatedProspects,

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

    currentPage,
    setCurrentPage,

    entriesPerPage,
    setEntriesPerPage,

    totalPages,
    totalEntries,

    startIndex,
    endIndex,
  };
};

export default useProspects;