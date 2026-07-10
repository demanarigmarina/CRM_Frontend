import { useState } from "react";
import { DEFAULT_TEMPLATES } from "../utils/templateDefaults";

export function useQuotationTemplates() {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState(DEFAULT_TEMPLATES[0]);

  const selectTemplate = (id) => {
    const found = templates.find((t) => t.id === id);
    if (found) setActiveTemplate(found);
  };

  const addSection = (templateId, sectionName) => {
    setTemplates(prev => prev.map(t => {
      if (t.id !== templateId) return t;
      const newSection = {
        id: `sec_custom_${Date.now()}`,
        name: sectionName || "New Custom Section",
        fields: []
      };
      const updated = { ...t, sections: [...t.sections, newSection] };
      if (t.id === activeTemplate.id) setActiveTemplate(updated);
      return updated;
    }));
  };

  const addFieldToSection = (templateId, sectionId, fieldType, fieldLabel) => {
    setTemplates(prev => prev.map(t => {
      if (t.id !== templateId) return t;
      const updatedSections = t.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          fields: [...s.fields, { id: `f_${Date.now()}`, type: fieldType, label: fieldLabel }]
        };
      });
      const updated = { ...t, sections: updatedSections };
      if (t.id === activeTemplate.id) setActiveTemplate(updated);
      return updated;
    }));
  };

  const createCustomTemplate = (name) => {
    const newTemplate = {
      id: `custom_${Date.now()}`,
      name: name || "Custom Template Layout",
      description: "User-defined layout template",
      icon: null,
      sections: []
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplate(newTemplate);
    return newTemplate;
  };

  return {
    templates,
    activeTemplate,
    selectTemplate,
    addSection,
    addFieldToSection,
    createCustomTemplate
  };
}