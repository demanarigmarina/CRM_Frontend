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
  clientName: "",
  companyName: "",
  contactMethod: "Phone",
  contactValue: "",
  callType: "Follow-up Call",
  status: "Scheduled",
  scheduledAt: "",
  completedAt: "",
  notes: "",
  outcome: "",
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
    case "Email":
      return "Enter email address";
    case "Text":
      return "Enter mobile number";
    default:
      return "Enter phone number";
  }
};

const getContactInputType = (contactMethod) => {
  if (contactMethod === "Email") return "email";
  return "text";
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
        clientName: editingCall.clientName || "",
        companyName: editingCall.companyName || "",
        contactMethod: editingCall.contactMethod || "Phone",
        contactValue:
          editingCall.contactValue ||
          editingCall.phone ||
          editingCall.email ||
          "",
        callType: editingCall.callType || "Follow-up Call",
        status: editingCall.status || "Scheduled",
        scheduledAt: toDateTimeLocal(editingCall.scheduledAt),
        completedAt: toDateTimeLocal(editingCall.completedAt),
        notes: editingCall.notes || "",
        outcome: editingCall.outcome || "",
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
      contactValue: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      phone:
        formData.contactMethod === "Phone" || formData.contactMethod === "Text"
          ? formData.contactValue
          : "",
      email: formData.contactMethod === "Email" ? formData.contactValue : "",
      completedAt:
        formData.status === "Completed" && formData.completedAt
          ? formData.completedAt
          : null,
      scheduledAt: formData.scheduledAt || null,
      contactValue: formData.contactValue || "",
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
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Enter client name"
            />
          </div>

          <div>
            <FormLabel>Company Name</FormLabel>
            <FormInput
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
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
              <option value="Phone">Phone</option>
              <option value="Text">Text</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <div>
            <FormLabel required>
              {formData.contactMethod === "Email"
                ? "Email Address"
                : "Contact Number"}
            </FormLabel>
            <FormInput
              type={getContactInputType(formData.contactMethod)}
              name="contactValue"
              value={formData.contactValue}
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
              <option value="Follow-up Call">Follow-up Call</option>
              <option value="Initial Client Contact">
                Initial Client Contact
              </option>
              <option value="Sales Discussion">Sales Discussion</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </FormSection>

        <FormSection title="Schedule">
          <div>
            <FormLabel required>Scheduled Date and Time</FormLabel>
            <FormInput
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
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

          {formData.status === "Completed" && (
            <div>
              <FormLabel>Completed Date and Time</FormLabel>
              <FormInput
                type="datetime-local"
                name="completedAt"
                value={formData.completedAt}
                onChange={handleChange}
              />
            </div>
          )}
        </FormSection>

        <FormSection title="Notes">
          <div>
            <FormLabel>Notes</FormLabel>
            <FormTextarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add call notes"
            />
          </div>

          <div>
            <FormLabel>Outcome</FormLabel>
            <FormTextarea
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              rows={3}
              placeholder="Add call outcome"
            />
          </div>
        </FormSection>
      </form>
    </FormDrawer>
  );
}