import { 
    FileText, Briefcase, FileSpreadsheet, Layers, 
    LayoutGrid, Calendar, Settings, Car, Plus 
  } from "lucide-react";
  
  export const AVAILABLE_BLOCKS = [
    { type: "text", label: "Text Field" },
    { type: "textarea", label: "Text Area" },
    { type: "number", label: "Number" },
    { type: "currency", label: "Currency" },
    { type: "date", label: "Date" },
    { type: "dropdown", label: "Dropdown" },
    { type: "checkbox", label: "Checkbox" },
    { type: "radio", label: "Radio Button" },
    { type: "client_info", label: "Client Information" },
    { type: "company_info", label: "Company Information" },
    { type: "pricing_table", label: "Pricing Table" },
    { type: "product_table", label: "Product Table" },
    { type: "service_table", label: "Service Table" },
    { type: "image", label: "Image/Logo" },
    { type: "divider", label: "Divider" },
    { type: "signature", label: "Signature" },
    { type: "payment_terms", label: "Payment Terms" },
    { type: "terms_conditions", label: "Terms & Conditions" },
    { type: "attachments", label: "Attachments" }
  ];
  
  export const DEFAULT_TEMPLATES = [
    {
      id: "standard",
      name: "Standard Quotation",
      description: "Most businesses can use this.",
      icon: FileText,
      sections: [
        { id: "sec_std_1", name: "Company Information", fields: [{ id: "f1", type: "company_info", label: "Company Details" }] },
        { id: "sec_std_2", name: "Client Information", fields: [{ id: "f2", type: "client_info", label: "Client Details" }] },
        { id: "sec_std_3", name: "Quotation Details", fields: [{ id: "f3", type: "text", label: "Quote Number" }, { id: "f4", type: "date", label: "Date Issued" }] },
        { id: "sec_std_4", name: "Products/Services Table", fields: [{ id: "f5", type: "product_table", label: "Items" }] },
        { id: "sec_std_5", name: "Financial Adjustments", fields: [{ id: "f6", type: "number", label: "Discount (%)" }, { id: "f7", type: "number", label: "Tax (%)" }] },
        { id: "sec_std_6", name: "Total Amount", fields: [{ id: "f8", type: "currency", label: "Grand Total" }] },
        { id: "sec_std_7", name: "Terms & Conditions", fields: [{ id: "f9", type: "payment_terms", label: "Payment Terms" }, { id: "f10", type: "terms_conditions", label: "Terms & Conditions" }] },
        { id: "sec_std_8", name: "Authorization", fields: [{ id: "f11", type: "signature", label: "Authorized Signature" }] }
      ]
    },
    {
      id: "service",
      name: "Service Quotation",
      description: "For agencies, consulting firms, IT services, etc.",
      icon: Briefcase,
      sections: [
        { id: "sec_srv_1", name: "Company Information", fields: [{ id: "s1", type: "company_info", label: "Company Details" }] },
        { id: "sec_srv_2", name: "Client Information", fields: [{ id: "s2", type: "client_info", label: "Client Details" }] },
        { id: "sec_srv_3", name: "Project Framework", fields: [{ id: "s3", type: "textarea", label: "Service Description" }, { id: "s4", type: "textarea", label: "Scope of Work" }] },
        { id: "sec_srv_4", name: "Execution Details", fields: [{ id: "s5", type: "textarea", label: "Deliverables" }, { id: "s6", type: "text", label: "Timeline" }] },
        { id: "sec_srv_5", name: "Financials", fields: [{ id: "s7", type: "service_table", label: "Pricing" }, { id: "s8", type: "textarea", label: "Payment Schedule" }] },
        { id: "sec_srv_6", name: "Terms & Sign-off", fields: [{ id: "s9", type: "terms_conditions", label: "Terms" }, { id: "s10", type: "signature", label: "Client Signature" }] }
      ]
    },
    {
      id: "product",
      name: "Product Quotation",
      description: "For selling physical inventory items.",
      icon: FileSpreadsheet,
      sections: [
        { id: "sec_prd_1", name: "Client Details", fields: [{ id: "p1", type: "client_info", label: "Client" }] },
        { id: "sec_prd_2", name: "Product List Table", fields: [{ id: "p2", type: "product_table", label: "Inventory Matrix (SKU, Qty, Unit Price, Total)" }] },
        { id: "sec_prd_3", name: "Logistics & Warranty", fields: [{ id: "p3", type: "currency", label: "Shipping Fee" }, { id: "p4", type: "text", label: "Warranty Rules" }] },
        { id: "sec_prd_4", name: "Provisions", fields: [{ id: "p5", type: "terms_conditions", label: "Terms" }] }
      ]
    },
    {
      id: "construction",
      name: "Construction Quotation",
      description: "For general contractors and building trades.",
      icon: Layers,
      sections: [
        { id: "sec_con_1", name: "Project Information", fields: [{ id: "c1", type: "text", label: "Project Location/Name" }] },
        { id: "sec_con_2", name: "Client Details", fields: [{ id: "c2", type: "client_info", label: "Client" }] },
        { id: "sec_con_3", name: "Job Cost Breakdown", fields: [{ id: "c3", type: "pricing_table", label: "Materials Cost" }, { id: "c4", type: "currency", label: "Labor Cost" }, { id: "c5", type: "currency", label: "Equipment Costs" }] },
        { id: "sec_con_4", name: "Schedule & Milestones", fields: [{ id: "c6", type: "text", label: "Timeline" }, { id: "c7", type: "currency", label: "Total Project Cost" }, { id: "c8", type: "textarea", label: "Payment Milestones" }] },
        { id: "sec_con_5", name: "Provisions", fields: [{ id: "c9", type: "terms_conditions", label: "Terms" }] }
      ]
    },
    {
      id: "software",
      name: "Software Development Quotation",
      description: "For tech product engineering.",
      icon: LayoutGrid,
      sections: [
        { id: "sec_soft_1", name: "Project Blueprint", fields: [{ id: "sw1", type: "textarea", label: "Project Overview" }, { id: "sw2", type: "textarea", label: "Features List" }, { id: "sw3", type: "textarea", label: "Modules" }] },
        { id: "sec_soft_2", name: "Timeline & Valuation", fields: [{ id: "sw4", type: "text", label: "Development Timeline" }, { id: "sw5", type: "pricing_table", label: "Cost Breakdown" }, { id: "sw6", type: "currency", label: "Maintenance Fee" }] },
        { id: "sec_soft_3", name: "SLA Terms", fields: [{ id: "sw7", type: "textarea", label: "Payment Schedule" }, { id: "sw8", type: "terms_conditions", label: "Terms" }] }
      ]
    },
    {
      id: "event",
      name: "Event Quotation",
      description: "For custom event planning.",
      icon: Calendar,
      sections: [
        { id: "sec_evt_1", name: "Event Fundamentals", fields: [{ id: "e1", type: "textarea", label: "Event Details" }, { id: "e2", type: "text", label: "Venue Options" }] },
        { id: "sec_evt_2", name: "Vendor Matrix", fields: [{ id: "e3", type: "text", label: "Catering Options" }, { id: "e4", type: "text", label: "Decorations" }, { id: "e5", type: "text", label: "Equipment Required" }, { id: "e6", type: "text", label: "Staff Needed" }] },
        { id: "sec_evt_3", name: "Packaging Rates", fields: [{ id: "e7", type: "currency", label: "Package Price" }, { id: "e8", type: "textarea", label: "Optional Add-ons" }] }
      ]
    },
    {
      id: "maintenance",
      name: "Maintenance Quotation",
      description: "For recurring service contracts.",
      icon: Settings,
      sections: [
        { id: "sec_maint_1", name: "Asset Registry", fields: [{ id: "m1", type: "text", label: "Equipment Details" }, { id: "m2", type: "dropdown", label: "Service Frequency" }] },
        { id: "sec_maint_2", name: "Resource Matrix", fields: [{ id: "m3", type: "text", label: "Parts Allocation" }, { id: "m4", type: "currency", label: "Labor Costs" }] },
        { id: "sec_maint_3", name: "SLA Cost Breakdown", fields: [{ id: "m5", type: "currency", label: "Monthly Cost" }, { id: "m6", type: "currency", label: "Annual Cost" }] }
      ]
    },
    {
      id: "rental",
      name: "Rental Quotation",
      description: "For leasing equipment or vehicles.",
      icon: Car,
      sections: [
        { id: "sec_rnt_1", name: "Asset Lease Logistics", fields: [{ id: "r1", type: "text", label: "Item Details" }, { id: "r2", type: "text", label: "Rental Duration" }] },
        { id: "sec_rnt_2", name: "Financial Adjustments", fields: [{ id: "r3", type: "currency", label: "Daily Rate" }, { id: "r4", type: "currency", label: "Security Deposit" }, { id: "r5", type: "date", label: "Return Date" }] },
        { id: "sec_rnt_3", name: "Provisions", fields: [{ id: "r6", type: "terms_conditions", label: "Terms" }] }
      ]
    }
  ];