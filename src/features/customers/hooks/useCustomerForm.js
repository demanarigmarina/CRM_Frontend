import { useState } from "react";
import { formatDateInput } from "../../../utils/date";
import { useFormBase } from "../../../hooks/useFormBase";

const EMPTY_FORM = {
  assignedTo: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffixName: "",
  birthday: "",
  gender: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  leadSource: "",
  status: "Active",
  country: "",
  province: "",
  city: "",
  barangay: "",
  street: "",
  houseNumber: "",
  zipCode: "",
  notes: "",
  removeProfilePicture: false,
};

const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  if (/^09\d{9}$/.test(cleaned)) {
    return cleaned.replace(/^(09\d{2})(\d{3})(\d{4})$/, "$1 $2 $3");
  }

  if (/^639\d{9}$/.test(cleaned)) {
    return cleaned.replace(/^(63)(9\d{2})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");
  }

  return phone;
};

export function useCustomerForm() {
  const base = useFormBase(EMPTY_FORM);
  const [showSidePane, setShowSidePane] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const openCreateSidePane = () => {
    base.resetForm();
    setEditingCustomer(null);
    setShowSidePane(true);
  };

  const openEditSidePane = (customer) => {
    const addr = customer.address || {};
    const country = addr.country || "";
    const province = addr.province || "";
    const city = addr.municipality || "";

    base.setFormData({
      assignedTo: "",
      firstName: customer.firstName || "",
      middleName: customer.middleName || "",
      lastName: customer.lastName || "",
      suffixName: customer.suffixName || "",
      birthday: formatDateInput(customer.dateOfBirth),
      gender: customer.sex || "",
      company: customer.company || "",
      leadSource: customer.leadSource || "",
      industry: customer.industry || "",
      email: customer.email || "",
      phone: formatPhone(customer.phone || ""), 
      country,
      province,
      city,
      barangay: addr.barangay || "",
      street: addr.street || "",
      houseNumber: addr.houseNumber || "",
      zipCode: addr.zipCode || "",
      notes: customer.notes || "",
      status: customer.status || "Active",
      removeProfilePicture: false,
    });

    base.setAddressCodes(base.resolveEditCodes(country, province, city));
    setEditingCustomer(customer._id);
    base.setPreviewFromPath(
      customer.profilePicture
        ? `http://localhost:5000${customer.profilePicture}`
        : "",
    );
    base.setAvatar(null);
    setShowSidePane(true);
  };

  const closeSidePane = () => {
    setShowSidePane(false);
    setEditingCustomer(null);
    base.resetForm();
  };

  return {
    ...base,
    showSidePane,
    editingCustomer,
    openCreateSidePane,
    openEditSidePane,
    closeSidePane,
  };
}