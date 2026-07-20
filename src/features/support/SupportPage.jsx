import { useState } from "react";

import {
  PageBase,
  PageHeader,
  PageContentState,
} from "../../components/page";

const FormLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const FormInput = ({ ...props }) => (
  <input
    {...props}
    className="w-full text-sm border border-gray-300 rounded-md px-3.5 py-2 
               focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400
               placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
  />
);

export default function SupportPage() {
  const [ticket, setTicket] = useState({
    title: "",
    category: "General Inquiry",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Simulating API save action
    setTimeout(() => {
      setSubmitted(false);
      setTicket({ title: "", category: "General Inquiry", description: "" });
    }, 3000);
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Help Desk & Support"
          subtitle="Submit technical tickets and review core infrastructure channels"
        />
      </div>

      <PageContentState>
        <div className="space-y-6">
          {/* Main Form Block */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Submit a Support Ticket
            </p>
            
            <div className="border border-gray-200 rounded-md p-5 bg-white shadow-sm">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-4 text-sm text-center font-medium">
                  🎉 Ticket submitted successfully! Our support staff will review your case shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    <div className="md:col-span-3">
                      <FormLabel required>Ticket Title / Subject</FormLabel>
                      <FormInput
                        name="title"
                        value={ticket.title}
                        onChange={handleChange}
                        placeholder="e.g. Cannot complete client assignment workflow"
                        required
                      />
                    </div>

                    <div>
                      <FormLabel required>Category</FormLabel>
                      <select
                        name="category"
                        value={ticket.category}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-300 rounded-md px-3.5 py-2 bg-white 
                                   focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 text-gray-800"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Account / Access">Account / Access</option>
                      </select>
                    </div>

                    <div className="md:col-span-4">
                      <FormLabel required>Detailed Description</FormLabel>
                      <textarea
                        name="description"
                        value={ticket.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Provide explicit context, step-by-step instructions to reproduce the behavior, or specific error banners you encountered..."
                        className="w-full text-sm border border-gray-300 rounded-md px-3.5 py-2 
                                   focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 placeholder-gray-400 text-gray-800"
                        required
                      />
                    </div>

                  </div>

                  {/* Action row matching application layout line definitions */}
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-md cursor-pointer transition-all shadow-sm"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* SLA Diagnostics Information Block */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              System SLA & Diagnostics
            </p>
            <div className="border border-gray-200 rounded-md p-5 bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-xs">
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Standard Response Time</span>
                  <p className="text-gray-500 leading-relaxed">Tickets are triaged and handled within 2-4 target operational business hours.</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Infrastructure Channels</span>
                  <p className="text-gray-500 leading-relaxed">All local routing databases and core endpoints are monitored 24/7/365.</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Escalation Rule</span>
                  <p className="text-gray-500 leading-relaxed">Critical blocks bypass queue pools and route directly to Support Staff management tiers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContentState>
    </PageBase>
  );
}