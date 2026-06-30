import { useState, useEffect, useCallback } from "react";
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

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/customers");
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useSocket(
    SOCKET_EVENTS.CUSTOMER_CREATED,
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers]),
  );

  useSocket(
    SOCKET_EVENTS.CUSTOMER_UPDATED,
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers]),
  );

  useSocket(
    SOCKET_EVENTS.CUSTOMER_ASSIGNED,
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers]),
  );

  useSocket(
    SOCKET_EVENTS.CUSTOMER_STATUS_CHANGED,
    useCallback((data) => {
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === data.customerId ? { ...c, status: data.newStatus } : c,
        ),
      );
    }, []),
  );

  const createCustomer = async (formData, avatar) => {
    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName,
        dateOfBirth: formData.birthday,
        sex: formData.gender,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        leadSource: formData.leadSource,
        status: formData.status || "Active",
        notes: formData.notes,
        "address.country": formData.country,
        "address.province": formData.province,
        "address.municipality": formData.city,
        "address.barangay": formData.barangay,
        "address.street": formData.street,
        "address.houseNumber": formData.houseNumber,
        "address.zipCode": formData.zipCode,
      };

      if (formData.assignedTo) {
        mapped.assignedTo = formData.assignedTo;
      }

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));
      if (avatar) data.append("profilePicture", avatar);

      const { data: result } = await api.post("/api/customers", data);
      setCustomers((prev) => [...prev, result.customer]);
      Toast.fire({
        icon: "success",
        title: `Customer created successfully`,
      });
      return result;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create customer",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (_id, formData, avatar) => {
    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName,
        dateOfBirth: formData.birthday,
        sex: formData.gender,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        leadSource: formData.leadSource,
        status: formData.status || "Active",
        notes: formData.notes,
        "address.country": formData.country,
        "address.province": formData.province,
        "address.municipality": formData.city,
        "address.barangay": formData.barangay,
        "address.street": formData.street,
        "address.houseNumber": formData.houseNumber,
        "address.zipCode": formData.zipCode,
      };

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));
      if (avatar) {
        data.append("profilePicture", avatar);
      } else if (formData.removeProfilePicture) {
        data.append("removeProfilePicture", "true");
      }

      const { data: updated } = await api.patch(`/api/customers/${_id}`, data);
      setCustomers((prev) => prev.map((c) => (c._id === _id ? updated : c)));
      Toast.fire({
        icon: "success",
        title: `Customer updated successfully`,
      });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update customer",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignCustomer = async (customerId, assignedTo) => {
    try {
      const { data: updated } = await api.patch(
        `/api/customers/${customerId}/assign`,
        { assignedTo: assignedTo || null },
      );
      setCustomers((prev) =>
        prev.map((c) => (c._id === customerId ? updated : c)),
      );
      Toast.fire({ icon: "success", title: "Assignment updated" });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update assignment",
      });
      return false;
    }
  };

  const deleteCustomer = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#758A93",
      confirmButtonText: "Yes, delete it!",
      toast: true,
      position: "auto",
    });

    if (!result.isConfirmed) return false;

    setLoading(true);
    try {
      await api.delete(`/api/customers/${_id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== _id));
      Swal.fire({
        title: "Deleted!",
        text: "Customer has been deleted.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return true;
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete customer.",
        icon: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerStatus = async (customerId, status) => {
    // Optimistic update
    setCustomers((prev) =>
      prev.map((c) => (c._id === customerId ? { ...c, status } : c)),
    );

    try {
      const { data: updated } = await api.patch(
        `/api/customers/${customerId}/status`,
        { status },
      );
      setCustomers((prev) =>
        prev.map((c) => (c._id === customerId ? updated : c)),
      );
      Toast.fire({ icon: "success", title: `Status updated to ${status}` });
      return updated;
    } catch (error) {
      await fetchCustomers(); // rollback on failure
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update customer status",
      });
      return null;
    }
  };

  return {
    customers,
    loading,
    refetchCustomers: fetchCustomers,
    createCustomer,
    updateCustomer,
    assignCustomer,
    deleteCustomer,
    updateCustomerStatus,
  };
}
