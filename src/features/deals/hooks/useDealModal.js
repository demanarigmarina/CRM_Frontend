import { useState, useCallback } from "react";
import { useActivities } from "../../../hooks/useActivities";
import { useEffect } from "react";
import api from "../../../services/api";

const STAGE_PROBABILITY = {
  Prospecting: 10,
  Qualification: 25,
  Proposal: 50,
  Negotiation: 75,
  Won: 100,
  Lost: 0,
};

const EMPTY_FORM = {
  title: "",
  customer: "",
  value: "",
  currency: "PHP",
  probability: 10,
  expectedCloseDate: "",
  assignedTo: "",
  notes: "",
};

const mapDealToForm = (deal) => ({
  title: deal.title || "",
  customer: deal.customer?._id || "",
  value: deal.value ?? "",
  currency: deal.currency || "PHP",
  probability: deal.probability ?? 0,
  expectedCloseDate: deal.expectedCloseDate
    ? deal.expectedCloseDate.slice(0, 10)
    : "",
  assignedTo: deal.assignedTo?._id || "",
  notes: deal.notes || "",
});

export function useDealModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [origin, setOrigin] = useState("view");
  const [activeTab, setActiveTab] = useState("Overview");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [viewingDeal, setViewingDeal] = useState(null);

  // ── Tasks ──────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    // Only fetch when the modal is open, in view mode, and a deal is selected
    if (!modalOpen || mode !== "view" || !viewingDeal?._id) {
      setTasks([]);
      return;
    }

    let cancelled = false;

    const fetchTasks = async () => {
      setTasksLoading(true);
      try {
        const { data } = await api.get(`/api/deals/${viewingDeal._id}/tasks`);
        if (!cancelled) setTasks(data);
      } catch (error) {
        console.error("Error fetching deal tasks:", error);
      } finally {
        if (!cancelled) setTasksLoading(false);
      }
    };

    fetchTasks();

    // Cleanup — avoids setting state on an unmounted/stale effect
    return () => { cancelled = true; };
  }, [modalOpen, mode, viewingDeal?._id]);
  // ──────────────────────────────────────────────────────

  const { activities, loading: activitiesLoading } = useActivities(
    modalOpen && mode === "view" && viewingDeal ? "Deal" : null,
    viewingDeal?._id,
  );

  const openCreate = useCallback((presetStage) => {
    const stage = presetStage || "Prospecting";
    setFormData({
      ...EMPTY_FORM,
      stage,
      probability: STAGE_PROBABILITY[stage] ?? 10,
    });
    setViewingDeal(null);
    setMode("create");
    setModalOpen(true);
  }, []);

  const openView = useCallback((deal) => {
    setViewingDeal(deal);
    setFormData(mapDealToForm(deal));
    setMode("view");
    setOrigin("view");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((deal) => {
    setViewingDeal(deal);
    setFormData(mapDealToForm(deal));
    setMode("edit");
    setOrigin("direct");
    setModalOpen(true);
  }, []);

  const switchToEdit = useCallback(() => {
    setMode("edit");
    setOrigin("view");
  }, []);

  const switchToView = useCallback(() => {
    if (viewingDeal) {
      setFormData(mapDealToForm(viewingDeal));
    }
    setMode("view");
  }, [viewingDeal]);

  const closeModal = useCallback(() => {
    setActiveTab("Overview");
    setModalOpen(false);
    setViewingDeal(null);
    setMode("create");
    setFormData(EMPTY_FORM);
    setTasks([]); // clear tasks on close
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    modalOpen,
    mode,
    origin,
    activeTab,
    setActiveTab,
    formData,
    viewingDeal,
    activities,
    activitiesLoading,
    tasks,        
    tasksLoading, 
    openCreate,
    openView,
    openEdit,
    switchToEdit,
    switchToView,
    closeModal,
    handleChange,
    handleSelectChange,
  };
}