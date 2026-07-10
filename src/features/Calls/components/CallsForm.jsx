import { useEffect, useState } from "react";

import FormDrawer from "../../../components/form/FormDrawer";
import FormSection from "../../../components/form/FormSection";
import {
  FormInput,
  FormLabel,
  FormTextarea,
  inputClass,
} from "../../../components/form/FormField";

const FORM_ID = "calls-form";

const initialFormData = {
  client: "",
  company: "",
  contactMethod: "Mobile",
  contactNumber: "",
  callType: "Outbound", // Ginawang 'Outbound' para valid sa backend schema enum
  status: "Scheduled",
  schedule: "",
  notes: "",
};

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const getContactPlaceholder = (contactMethod) => {
  switch (contactMethod) {
    case "WhatsApp":
      return "Enter WhatsApp number...";
    case "Viber":
      return "Enter Viber number...";
    default:
      return "Enter Mobile number...";
  }
};

export default function CallsForm({
  open,
  editingCall,
  onSubmit,
  onClose,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!open) return;

    if (editingCall) {
      setFormData({
        client: editingCall.client || "",
        company: editingCall.company || "",
        contactMethod: editingCall.contactMethod || "Mobile",
        contactNumber: editingCall.contactNumber || "",
        callType: editingCall.callType || "Outbound",
        status: editingCall.status || "Scheduled",
        schedule: toDateTimeLocal(editingCall.schedule),
        notes: editingCall.notes || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [open, editingCall]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleContactMethodChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,
      contactMethod: value,
      contactNumber: "", // Reset field values pag nagbago ng option
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      client: formData.client,
      company: formData.company,
      contactNumber: formData.contactNumber || "",
      callType: formData.callType,
      schedule: formData.schedule || null,
      status: formData.status || "Scheduled",
      notes: formData.notes || "",
    };

    await onSubmit(payload);
  };

  return (
    <FormDrawer
      open={open}
      title={editingCall ? "Edit Call" : "Add Call"}
      formId={FORM_ID}
      loading={loading}
      onClose={onClose}
      onCancel={onCancel}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Call Information">
          <div>
            <FormLabel required>Client Name</FormLabel>
            <FormInput
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              placeholder="Enter client name..."
            />
          </div>

          <div>
            <FormLabel>Company Name</FormLabel>
            <FormInput
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name..."
            />
          </div>

          <div>
            <FormLabel required>Contact Method</FormLabel>
            <select
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleContactMethodChange}
              required
              className={inputClass}
            >
              <option value="Mobile">Mobile</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Viber">Viber</option>
            </select>
          </div>

          <div>
            <FormLabel required>
              {formData.contactMethod === "WhatsApp"
                ? "WhatsApp Number"
                : formData.contactMethod === "Viber"
                ? "Viber Number"
                : "Mobile Number"}
            </FormLabel>
            <FormInput
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              placeholder={getContactPlaceholder(formData.contactMethod)}
            />
          </div>

          <div>
            <FormLabel required>Call Type</FormLabel>
            <select
              name="callType"
              value={formData.callType}
              onChange={handleChange}
              required
              className={inputClass}
            >
              {/* 3. 🟢 ITINAMA: Ginawang Inbound/Outbound para tumugma sa enum restriction ng controller at model */}
              <option value="Outbound">Outbound (We called client)</option>
              <option value="Inbound">Inbound (Client called us)</option>
            </select>
          </div>
        </FormSection>

        <FormSection title="Schedule">
          <div>
            <FormLabel required>Scheduled Date and Time</FormLabel>
            <FormInput
              type="datetime-local"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <FormLabel required>Status</FormLabel>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        </FormSection>

        <FormSection title="Notes">
          <div>
            <FormLabel>Notes</FormLabel>
            <FormTextarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add short description or context about the call..."
            />
          </div>
        </FormSection>
      </form>
    </FormDrawer>
  );
}