import { useEffect, useState } from "react";

import FormDrawer from "../../../components/form/FormDrawer";
import FormSection from "../../../components/form/FormSection";
import {
  FormInput,
  FormLabel,
  FormTextarea,
  inputClass,
} from "../../../components/form/FormField";

const formId = "prospect-form";

const initialFormData = {
  companyName: "",
  natureOfBusiness: "",
  companyEmailAddress: "",
  phone: "",
  leadSource: "",
  status: "New",
  representativeName: {
    firstName: "",
    middleInitial: "",
    lastName: "",
  },
  ownerName: {
    firstName: "",
    middleInitial: "",
    lastName: "",
  },
  notes: "",
};

const leadSourceOptions = [
  "Website",
  "Facebook",
  "Referral",
  "Walk-in",
  "Email",
  "Phone Call",
  "Event",
  "Other",
];

const statusOptions = ["New", "Contacted", "Qualified", "Converted", "Lost"];

function mergeProspectData(prospect) {
  if (!prospect) return initialFormData;

  return {
    ...initialFormData,
    ...prospect,
    representativeName: {
      ...initialFormData.representativeName,
      ...(prospect.representativeName || {}),
    },
    ownerName: {
      ...initialFormData.ownerName,
      ...(prospect.ownerName || {}),
    },
  };
}

export default function ProspectForm({
  open,
  editingProspect,
  prospect,
  loading = false,
  onSave,
  onClose,
}) {
  const activeProspect = editingProspect || prospect || null;
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(mergeProspectData(activeProspect));
    }
  }, [open, activeProspect]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const isSubmitting = loading || saving;

  return (
    <FormDrawer
      open={open}
      title={activeProspect ? "Edit Prospect" : "Add Prospect"}
      formId={formId}
      loading={isSubmitting}
      onClose={handleCancel}
      onCancel={handleCancel}
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Company Information">
          <div>
            <FormLabel required>Company Name</FormLabel>
            <FormInput
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div>
            <FormLabel>Nature of Business</FormLabel>
            <FormInput
              name="natureOfBusiness"
              value={formData.natureOfBusiness}
              onChange={handleChange}
              placeholder="Enter nature of business"
            />
          </div>

          <div>
            <FormLabel>Email Address</FormLabel>
            <FormInput
              type="email"
              name="companyEmailAddress"
              value={formData.companyEmailAddress}
              onChange={handleChange}
              placeholder="company@email.com"
            />
          </div>

          <div>
            <FormLabel>Phone Number</FormLabel>
            <FormInput
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>
        </FormSection>

        <FormSection title="Representative Name">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <FormLabel>First Name</FormLabel>
              <FormInput
                value={formData.representativeName.firstName}
                onChange={(e) =>
                  handleNestedChange(
                    "representativeName",
                    "firstName",
                    e.target.value
                  )
                }
                placeholder="First name"
              />
            </div>

            <div>
              <FormLabel>Middle Initial</FormLabel>
              <FormInput
                value={formData.representativeName.middleInitial}
                onChange={(e) =>
                  handleNestedChange(
                    "representativeName",
                    "middleInitial",
                    e.target.value
                  )
                }
                placeholder="M.I."
                maxLength={5}
              />
            </div>

            <div>
              <FormLabel>Last Name</FormLabel>
              <FormInput
                value={formData.representativeName.lastName}
                onChange={(e) =>
                  handleNestedChange(
                    "representativeName",
                    "lastName",
                    e.target.value
                  )
                }
                placeholder="Last name"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Owner Name">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <FormLabel>First Name</FormLabel>
              <FormInput
                value={formData.ownerName.firstName}
                onChange={(e) =>
                  handleNestedChange("ownerName", "firstName", e.target.value)
                }
                placeholder="First name"
              />
            </div>

            <div>
              <FormLabel>Middle Initial</FormLabel>
              <FormInput
                value={formData.ownerName.middleInitial}
                onChange={(e) =>
                  handleNestedChange(
                    "ownerName",
                    "middleInitial",
                    e.target.value
                  )
                }
                placeholder="M.I."
                maxLength={5}
              />
            </div>

            <div>
              <FormLabel>Last Name</FormLabel>
              <FormInput
                value={formData.ownerName.lastName}
                onChange={(e) =>
                  handleNestedChange("ownerName", "lastName", e.target.value)
                }
                placeholder="Last name"
              />
            </div>
          </div>

        <FormSection title="Prospect Details">
          <div>
            <FormLabel>Lead Source</FormLabel>
            <select
              name="leadSource"
              value={formData.leadSource}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select lead source</option>
              {leadSourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FormLabel>Status</FormLabel>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FormLabel>Notes</FormLabel>
            <FormTextarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add notes about this prospect"
            />
          </div>
        </FormSection>
      </form>
    </FormDrawer>
  );
}