import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useSocket } from "../../../hooks/useSocket";
import { SOCKET_EVENTS } from "../../../constants/socketEvents";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

const STAGES = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

export function useDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/deals");
      setDeals(data);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useSocket(
    SOCKET_EVENTS.DEAL_CREATED,
    useCallback(() => {
      fetchDeals();
    }, [fetchDeals]),
  );

  useSocket(
    SOCKET_EVENTS.DEAL_UPDATED,
    useCallback(() => {
      fetchDeals();
    }, [fetchDeals]),
  );

  useSocket(
    SOCKET_EVENTS.DEAL_ASSIGNED,
    useCallback(() => {
      fetchDeals();
    }, [fetchDeals]),
  );

  useSocket(
    SOCKET_EVENTS.DEAL_STAGE_CHANGED,
    useCallback((data) => {
      setDeals((prev) =>
        prev.map((d) =>
          d._id === data.dealId ? { ...d, stage: data.newStage } : d,
        ),
      );
    }, []),
  );

  // Group deals by stage for the Kanban board, sorted by position
  const columns = useMemo(
    () =>
      STAGES.reduce((acc, stage) => {
        acc[stage] = deals
          .filter((d) => d.stage === stage)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        return acc;
      }, {}),
    [deals],
  );

  const updateDealStage = async (
    dealId,
    newStage,
    position = 0,
    updates = [],
  ) => {
    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d._id === dealId ? { ...d, stage: newStage } : d)),
    );

    try {
      const payload = { stage: newStage, position };
      if (updates.length > 0) payload.updates = updates;

      const { data } = await api.patch(`/api/deals/${dealId}/stage`, payload);
      const updatedDeal = data.deal;

      setDeals((prev) => {
        if (updates.length > 0) {
          const map = new Map(prev.map((d) => [d._id, d]));
          updates.forEach((u) => {
            if (map.has(u._id)) {
              map.set(u._id, {
                ...map.get(u._id),
                stage: u.stage ?? map.get(u._id).stage,
                position: u.position,
              });
            }
          });
          map.set(updatedDeal._id, updatedDeal);
          return Array.from(map.values());
        }
        return prev.map((d) => (d._id === dealId ? updatedDeal : d));
      });
    } catch (error) {
      await fetchDeals();
      Toast.fire({
        icon: "error",
        title: error.response?.data?.error || "Failed to update deal stage",
      });
    }
  };

  const createDeal = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        customer: formData.customer,
        value: Number(formData.value),
        currency: formData.currency || "PHP",
        probability: Number(formData.probability) || 0,
        stage: formData.stage || "Prospecting",
        expectedCloseDate: formData.expectedCloseDate || null,
        notes: formData.notes || "",
      };
      if (formData.assignedTo) {
        payload.assignedTo = formData.assignedTo;
      }

      const { data: result } = await api.post("/api/deals", payload);
      setDeals((prev) => [result.deal, ...prev]);
      Toast.fire({ icon: "success", title: "Deal created successfully" });
      return result.deal;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create deal",
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateDeal = async (dealId, formData) => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        customer: formData.customer,
        value: Number(formData.value),
        currency: formData.currency || "PHP",
        probability: Number(formData.probability) || 0,
        stage: formData.stage,
        expectedCloseDate: formData.expectedCloseDate || null,
        notes: formData.notes || "",
      };
      if (formData.assignedTo !== undefined) {
        payload.assignedTo = formData.assignedTo || null;
      }

      const { data: updated } = await api.patch(
        `/api/deals/${dealId}`,
        payload,
      );
      setDeals((prev) => prev.map((d) => (d._id === dealId ? updated : d)));
      Toast.fire({ icon: "success", title: "Deal updated successfully" });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update deal",
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteDeal = async (dealId) => {
    const confirm = await Swal.fire({
      title: "Delete this deal?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return false;

    try {
      await api.delete(`/api/deals/${dealId}`);
      setDeals((prev) => prev.filter((d) => d._id !== dealId));
      Toast.fire({ icon: "success", title: "Deal deleted successfully" });
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to delete deal",
      });
      return false;
    }
  };

  const reorderDeals = async (updates) => {
    const updateMap = new Map(updates.map((u) => [u._id, u]));

    setDeals((prev) =>
      prev.map((d) => {
        const upd = updateMap.get(d._id);
        if (!upd) return d;
        return { ...d, position: upd.position, stage: upd.stage ?? d.stage };
      }),
    );

    try {
      await api.patch("/api/deals/batch/reorder", { updates });
    } catch (error) {
      await fetchDeals();
      Toast.fire({ icon: "error", title: "Failed to reorder deals" });
    }
  };

  return {
    deals,
    columns,
    loading,
    submitting,
    fetchDeals,
    updateDealStage,
    reorderDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    STAGES,
  };
}
