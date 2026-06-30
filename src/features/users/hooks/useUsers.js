import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});


const validatePhone = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-().]/g, "");
  const isValid = /^(\+63|0)9\d{9}$|^\+?\d{10,15}$/.test(cleaned);
  return isValid ? null : "Enter a valid contact number (e.g. 09171234567 or +639171234567)";
};

export function useUsers({
  skip = false,
  mode = "all",
  resource = null,
} = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skip) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        let url = "/api/users";

        if (mode === "assignable") {
          url = `/api/users/assignable?resource=${resource}`;
        }

        const { data } = await api.get(url);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [skip, mode, resource]);

  const createUser = async (formData, avatar) => {
    //Validate before hitting the API
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      Swal.fire({ icon: "error", title: "Invalid Phone", text: phoneErr });
      return null;
    }

    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        team: formData.team || "",
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName || "N/A",
        dateOfBirth: formData.birthday,
        placeOfBirth: formData.placeOfBirth,
        sex: formData.gender,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        "currentAddress.country": formData.country,
        "currentAddress.province": formData.province,
        "currentAddress.municipality": formData.city,
        "currentAddress.barangay": formData.barangay,
        "currentAddress.street": formData.street,
        "currentAddress.houseNumber": formData.houseNumber,
        "currentAddress.zipCode": formData.zipCode,
      };

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));

      if (avatar) data.append("profilePicture", avatar);

      const { data: result } = await api.post("/api/users", data);
      setUsers((prev) => [...prev, result]);

      Toast.fire({
        icon: "success",
        title: `${result.role} created successfully`,
      });

      return result;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Something went wrong",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (employeeId, formData, avatar) => {
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      Swal.fire({ icon: "error", title: "Invalid Phone", text: phoneErr });
      return null;
    }

    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        team: formData.team || "",
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName,
        dateOfBirth: formData.birthday,
        placeOfBirth: formData.placeOfBirth,
        sex: formData.gender,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        "currentAddress.country": formData.country,
        "currentAddress.province": formData.province,
        "currentAddress.municipality": formData.city,
        "currentAddress.barangay": formData.barangay,
        "currentAddress.street": formData.street,
        "currentAddress.houseNumber": formData.houseNumber,
        "currentAddress.zipCode": formData.zipCode,
      };

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));

      if (avatar) {
        data.append("profilePicture", avatar);
      } else if (formData.removeProfilePicture) {
        data.append("removeProfilePicture", "true");
      }

      const { data: updated } = await api.patch(
        `/api/users/${employeeId}`,
        data,
      );

      setUsers((prev) =>
        prev.map((u) => (u.employeeId === employeeId ? updated : u)),
      );
      Toast.fire({
        icon: "success",
        title: `${updated.role} updated successfully`,
      });
      return updated;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Something went wrong",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (employeeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return false;

    setLoading(true);
    try {
      await api.delete(`/api/users/${employeeId}`);
      setUsers((prev) => prev.filter((u) => u.employeeId !== employeeId));
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
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
        text: "Failed to delete user.",
        icon: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, createUser, updateUser, deleteUser };
}