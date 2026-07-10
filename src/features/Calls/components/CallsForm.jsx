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
<<<<<<< HEAD
  client: "",
  company: "",
  contactMethod: "Mobile",
  contactNumber: "",
  callType: "Outbound", // Ginawang 'Outbound' para valid sa backend schema enum
=======
  contactName: "",
  companyPerson: "",
  contactMethod: "Mobile",
  contactValue: "",
  callType: "Follow-up Call",
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
  status: "Scheduled",
  schedule: "",
  notes: "",
  outcome: "",
};


const toDateTimeLocal = (value) =>  
    {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  return new Date(
    date.getTime() - offset * 60000,
  )
    .toISOString()
    .slice(0, 16);
};

<<<<<<< HEAD
const getContactPlaceholder = (contactMethod) => {
  switch (contactMethod) {
=======

const getContactPlaceholder = (method) => {
  switch (method) {
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
    case "WhatsApp":
      return "Enter WhatsApp number...";

    case "Viber":
      return "Enter Viber number...";

    default:
      return "Enter mobile number...";
  }
};

<<<<<<< HEAD
=======

>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
export default function CallsForm({
  open,
  editingCall,
  onSubmit,
  onClose,
  onCancel,
  loading,
}) {
  const [formData, setFormData] =
    useState(initialFormData);


  useEffect(() => {
    if (!open) return;

    if (editingCall) {
      setFormData({
<<<<<<< HEAD
        client: editingCall.client || "",
        company: editingCall.company || "",
        contactMethod: editingCall.contactMethod || "Mobile",
        contactNumber: editingCall.contactNumber || "",
        callType: editingCall.callType || "Outbound",
        status: editingCall.status || "Scheduled",
        schedule: toDateTimeLocal(editingCall.schedule),
        notes: editingCall.notes || "",
=======
        contactPerson:
          editingCall.contactPerson || "",

        companyName:
          editingCall.companyName || "",

        contactMethod:
          editingCall.contactMethod || "Mobile",

        contactValue:
          editingCall.contactValue ||
          editingCall.phone ||
          "",

        callType:
          editingCall.callType ||
          "Follow-up Call",

        status:
          editingCall.status ||
          "Scheduled",

        scheduledAt:
          toDateTimeLocal(
            editingCall.scheduledAt,
          ),

        completedAt:
          toDateTimeLocal(
            editingCall.completedAt,
          ),

        notes:
          editingCall.notes || "",

        outcome:
          editingCall.outcome || "",
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
      });
    } else {
      setFormData(initialFormData);
    }
  }, [open, editingCall]);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleContactMethodChange = (event) => {
    setFormData((previous) => ({
      ...previous,
<<<<<<< HEAD
      contactMethod: value,
      contactNumber: "", // Reset field values pag nagbago ng option
=======
      contactMethod: event.target.value,
      contactValue: "",
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
<<<<<<< HEAD
      client: formData.client,
      company: formData.company,
      contactNumber: formData.contactNumber || "",
      callType: formData.callType,
      schedule: formData.schedule || null,
      status: formData.status || "Scheduled",
      notes: formData.notes || "",
=======
      ...formData,

      phone:
        formData.contactMethod === "Mobile"
          ? formData.contactValue
          : "",

      WhatsApp:
        formData.contactMethod === "WhatsApp"
          ? formData.contactValue
          : "",

      Viber:
        formData.contactMethod === "Viber"
          ? formData.contactValue
          : "",

      scheduledAt:
        formData.scheduledAt || null,

      completedAt:
        formData.status === "Completed"
          ? formData.completedAt || null
          : null,
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
    };

    await onSubmit(payload);
  };


  return (
    <FormDrawer
      open={open}
      title={
        editingCall
          ? "Edit Call"
          : "Add Call"
      }
      formId={FORM_ID}
      loading={loading}
      onClose={onClose}
      onCancel={onCancel}
    >
<<<<<<< HEAD
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
=======
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <FormSection title="Call Information">

            <div>
            <FormLabel>
              Company Name
            </FormLabel>

>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
            <FormInput
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name..."
            />
          </div>

          <div>
            <FormLabel required>
<<<<<<< HEAD
              {formData.contactMethod === "WhatsApp"
                ? "WhatsApp Number"
                : formData.contactMethod === "Viber"
                ? "Viber Number"
                : "Mobile Number"}
=======
              Contact Person
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
            </FormLabel>

            <FormInput
<<<<<<< HEAD
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
=======
              name="contactPerson"
              value={formData.contactPerson}
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
              onChange={handleChange}
              placeholder="Enter contact person..."
              required
            />
          </div>


        

          <div className="grid grid-cols-2 gap-4">

            <div>
              <FormLabel required>
                Contact Method
              </FormLabel>

              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleContactMethodChange}
                className={inputClass}
                required
              >
                <option value="Mobile">
                  Mobile
                </option>

                <option value="WhatsApp">
                  WhatsApp
                </option>

                <option value="Viber">
                  Viber
                </option>
              </select>
            </div>


            <div>
              <FormLabel required>
                Contact Number
              </FormLabel>

              <FormInput
                name="contactValue"
                value={formData.contactValue}
                onChange={handleChange}
                placeholder={
                  getContactPlaceholder(
                    formData.contactMethod,
                  )
                }
                required
              />
            </div>

          </div>


          <div>
            <FormLabel required>
              Call Type
            </FormLabel>

            <select
              name="callType"
              value={formData.callType}
              onChange={handleChange}
              className={inputClass}
              required
            >
<<<<<<< HEAD
              {/* 3. 🟢 ITINAMA: Ginawang Inbound/Outbound para tumugma sa enum restriction ng controller at model */}
              <option value="Outbound">Outbound (We called client)</option>
              <option value="Inbound">Inbound (Client called us)</option>
=======
              <option value="Follow-up Call">
                Follow-up Call
              </option>

              <option value="Initial Client Contact">
                Initial Client Contact
              </option>

              <option value="Sales Discussion">
                Sales Discussion
              </option>

              <option value="Other">
                Other
              </option>
>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
            </select>
          </div>

        </FormSection>

<<<<<<< HEAD
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
=======
            <FormSection title="Schedule">

            <div className="grid grid-cols-2 gap-4">

                <div>
                <FormLabel required>
                    Scheduled Date and Time
                </FormLabel>

                <FormInput
                    type="datetime-local"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    required
                />
                </div>


                <div>
                <FormLabel required>
                    Status
                </FormLabel>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                    required
                >
                    <option value="Scheduled">
                    Scheduled
                    </option>

                    <option value="Completed">
                    Completed
                    </option>

                    <option value="Cancelled">
                    Cancelled
                    </option>

                    <option value="Missed">
                    Missed
                    </option>
                </select>
                </div>

            </div>


            {formData.status === "Completed" && (
                <div>
                <FormLabel>
                    Completed Date and Time
                </FormLabel>

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

          <FormTextarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Add call notes..."
          />

>>>>>>> a2e780bede0037974f150d7b9f2ebd7add0968fa
        </FormSection>

      </form>
    </FormDrawer>
  );
}