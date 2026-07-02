import React, { useEffect, useState } from "react";
import FormDrawer from "../../../components/form/FormDrawer";
import FormSection from "../../../components/form/FormSection";
import {
  FormLabel,
  FormInput,
  FormTextarea,
  inputClass,
} from "../../../components/form/FormField";

const initialForm = {
  companyName: "",
  companyEmailAddress: "",
  companyWebsite: "",
  natureOfBusiness: "",
  numberOfEmployees: "",

  businessAddress: {
    houseNumber: "",
    streetAddress: "",
    city: "",
    province: "",
    country: "Philippines",
  },

  ownerName: {
    lastName: "",
    firstName: "",
    middleInitial: "",
  },

  representativeName: {
    lastName: "",
    firstName: "",
    middleInitial: "",
  },

  title: "",
  emailAddress: "",
  viber: "",
  phone: "",

  leadSource: "Website",
  status: "New",

  notes: "",
};

const ProspectForm = ({
  open,
  onClose,
  onSave,
  editingProspect,
}) => {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingProspect) {
      setFormData({
        ...initialForm,
        ...editingProspect,
        businessAddress: {
          ...initialForm.businessAddress,
          ...(editingProspect.businessAddress || {}),
        },
        ownerName: {
          ...initialForm.ownerName,
          ...(editingProspect.ownerName || {}),
        },
        representativeName: {
          ...initialForm.representativeName,
          ...(editingProspect.representativeName || {}),
        },
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingProspect]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.companyEmailAddress ||
      !formData.phone
    ) {
      alert(
        "Company Name, Company Email Address and Phone are required."
      );
      return;
    }

    onSave(formData);
    setFormData(initialForm);
  };

  return (
    <FormDrawer
      open={open}
      title={editingProspect ? "Edit Prospect" : "Add Prospect"}
      formId="prospect-form"
      loading={false}
      onClose={onClose}
      onCancel={onClose}
    >
      <form
        id="prospect-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <FormSection title="Company Profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <FormLabel required>Company Name</FormLabel>
              <FormInput
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <FormLabel required>Company Email Address</FormLabel>
              <FormInput
                type="email"
                name="companyEmailAddress"
                value={formData.companyEmailAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <FormLabel>Company Website</FormLabel>
              <FormInput
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Nature of Business</FormLabel>
              <FormInput
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Number of Employees</FormLabel>
              <FormInput
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>House Number</FormLabel>
              <FormInput
                name="businessAddress.houseNumber"
                value={formData.businessAddress.houseNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Street Address</FormLabel>
              <FormInput
                name="businessAddress.streetAddress"
                value={formData.businessAddress.streetAddress}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>City</FormLabel>
              <FormInput
                name="businessAddress.city"
                value={formData.businessAddress.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Province</FormLabel>
              <FormInput
                name="businessAddress.province"
                value={formData.businessAddress.province}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Country</FormLabel>
              <FormInput
                name="businessAddress.country"
                value={formData.businessAddress.country}
                onChange={handleChange}
              />
            </div>

          </div>
        </FormSection>

        <FormSection title="Owner Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <FormLabel>Last Name</FormLabel>
              <FormInput
                name="ownerName.lastName"
                value={formData.ownerName.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>First Name</FormLabel>
              <FormInput
                name="ownerName.firstName"
                value={formData.ownerName.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Middle Initial</FormLabel>
              <FormInput
                name="ownerName.middleInitial"
                value={formData.ownerName.middleInitial}
                onChange={handleChange}
              />
            </div>

          </div>
        </FormSection>

        <FormSection title="Representative Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <FormLabel>Last Name</FormLabel>
              <FormInput
                name="representativeName.lastName"
                value={formData.representativeName.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>First Name</FormLabel>
              <FormInput
                name="representativeName.firstName"
                value={formData.representativeName.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Middle Initial</FormLabel>
              <FormInput
                name="representativeName.middleInitial"
                value={formData.representativeName.middleInitial}
                onChange={handleChange}
              />
            </div>

          </div>
        </FormSection>
                <FormSection title="Owner Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Owner First Name</FormLabel>
              <FormInput
                name="ownerName.firstName"
                value={formData.ownerName.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Owner Last Name</FormLabel>
              <FormInput
                name="ownerName.lastName"
                value={formData.ownerName.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Middle Initial</FormLabel>
              <FormInput
                name="ownerName.middleInitial"
                value={formData.ownerName.middleInitial}
                onChange={handleChange}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Representative Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Representative First Name</FormLabel>
              <FormInput
                name="representativeName.firstName"
                value={formData.representativeName.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Representative Last Name</FormLabel>
              <FormInput
                name="representativeName.lastName"
                value={formData.representativeName.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <FormLabel>Middle Initial</FormLabel>
              <FormInput
                name="representativeName.middleInitial"
                value={formData.representativeName.middleInitial}
                onChange={handleChange}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <FormLabel>Title</FormLabel>
              <FormInput
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Procurement Manager"
              />
            </div>

            <div>
              <FormLabel>Email Address</FormLabel>
              <FormInput
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                placeholder="representative@email.com"
              />
            </div>

            <div>
              <FormLabel>Viber</FormLabel>
              <FormInput
                name="viber"
                value={formData.viber}
                onChange={handleChange}
                placeholder="+639123456789"
              />
            </div>

            <div>
              <FormLabel required>Phone</FormLabel>
              <FormInput
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="054-123-4567"
              />
            </div>

          </div>
        </FormSection>

        <FormSection title="CRM Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <FormLabel>Lead Source</FormLabel>
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Email">Email</option>
                <option value="Other">Other</option>
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
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <FormLabel>Notes</FormLabel>
              <FormTextarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Interested in custom CRM software solutions."
              />
            </div>

          </div>
        </FormSection>

      </form>
    </FormDrawer>
  );
};

export default ProspectForm;