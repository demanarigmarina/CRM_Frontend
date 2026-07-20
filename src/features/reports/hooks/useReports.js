import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useFilterPopover } from "../../../components/filters/useFilterPopover";
import { useTablePagination } from "../../../components/table";

const emptyForm = {
  title: "",
  description: "",
  category: "Sales",
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch data from backend using Axios instance
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/reports");
        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch reports error:", error);
        Swal.fire({
          icon: "error",
          title: "Connection Error",
          text: error.response?.data?.message || "Could not load reports from the server.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 2. Extract categories dynamically for filters
  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(
        reports
          .map(report => report.category)
          .filter(Boolean),
      ),
    ].sort();

    return [
      { label: "All Reports", value: "All" },
      ...categories.map(category => ({
        label: category,
        value: category,
      })),
    ];
  }, [reports]);

  // 3. Filter Popover Logic
  const clearAllFilters = () => setFilterCategory("All");
  
  const filterPopoverProps = useFilterPopover(
    { filterCategory },
    clearAllFilters,
  );

  // 4. Modal Triggers
  const openCreateModal = () => {
    setEditingReport(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = report => {
    setEditingReport(report);
    setFormData({
      title: report.title || "",
      description: report.description || "",
      category: report.category || "Sales",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({ ...emptyForm });
  };

  const handleFieldChange = (field, value) => {
    setFormData(current => ({
      ...current,
      [field]: value,
    }));
  };

  // 5. Create & Update Mutators
  const handleSubmit = async event => {
    if (event) event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();

    if (!title || !category) {
      await Swal.fire({
        icon: "error",
        title: "Validation error",
        text: "Please enter a report name and category.",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (editingReport) {
        const { data } = await api.put(`/api/reports/${editingReport._id}`, {
          title,
          description,
          category,
        });

        setReports(prev =>
          prev.map(item => (item._id === editingReport._id ? data : item))
        );

        Toast.fire({
          icon: "success",
          title: "Report updated successfully",
        });
      } else {
        const { data } = await api.post("/api/reports", {
          title,
          description,
          category,
        });

        setReports(prev => [data, ...prev]);

        Toast.fire({
          icon: "success",
          title: "Report created successfully",
        });
      }

      closeModal();
    } catch (error) {
      console.error("Save report error:", error);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to save report to server",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Delete Mutator
  const handleDelete = async reportId => {
    const result = await Swal.fire({
      title: "Delete report?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);

    try {
      await api.delete(`/api/reports/${reportId}`);

      setReports(prev => prev.filter(item => item._id !== reportId));

      Toast.fire({
        icon: "success",
        title: "Report deleted successfully",
      });
    } catch (error) {
      console.error("Delete report error:", error);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to delete report from server",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 7. Memoized Search & Category Filters
  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reports.filter(report => {
      const searchMatch =
        !keyword ||
        [
          report.title,
          report.description,
          report.category,
        ].some(value =>
          String(value || "")
            .toLowerCase()
            .includes(keyword),
        );

      const categoryMatch =
        filterCategory === "All" ||
        report.category === filterCategory;

      return searchMatch && categoryMatch;
    });
  }, [reports, search, filterCategory]);

  // 8. Pagination Orchestration
  const pagination = useTablePagination(filteredReports, 10);

  return {
    reports,
    filteredReports,
    loading,
    submitting,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    categoryOptions,
    isModalOpen,
    editingReport,
    formData,
    filterPopoverProps,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFieldChange,
    handleSubmit,
    handleDelete,
    clearAllFilters,
    pagination,
  };
}