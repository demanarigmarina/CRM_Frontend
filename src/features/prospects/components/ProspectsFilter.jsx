import React, { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";

const ProspectsFilter = ({
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="filter-wrapper">
      <button
        className="filter-btn"
        onClick={() => setOpen(!open)}
      >
        <Filter size={16} />
        <span>Filter</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="filter-menu">

          {/* STATUS */}
          <div className="filter-group">
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="New">New</option>
              <option value="Pending Contact">Pending Contact</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>

          {/* LEAD SOURCE */}
          <div className="filter-group">
            <label>Lead Source</label>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="All">All</option>
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
        </div>
      )}

      <style>{`
        .filter-wrapper{
          position:relative;
        }

        .filter-btn{
          display:flex;
          align-items:center;
          gap:8px;
          background:#fff;
          border:1px solid #d1d5db;
          border-radius:8px;
          padding:10px 16px;
          cursor:pointer;
          font-size:13px;
          font-weight:500;
          transition:.2s;
        }

        .filter-btn:hover{
          background:#f9fafb;
        }

        .filter-menu{
          position:absolute;
          top:110%;
          right:0;
          width:230px;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:10px;
          box-shadow:0 8px 20px rgba(0,0,0,.08);
          padding:15px;
          z-index:100;
        }

        .filter-group{
          display:flex;
          flex-direction:column;
          margin-bottom:15px;
        }

        .filter-group:last-child{
          margin-bottom:0;
        }

        .filter-group label{
          font-size:12px;
          font-weight:600;
          color:#555;
          margin-bottom:6px;
        }

        .filter-group select{
          border:1px solid #d1d5db;
          border-radius:6px;
          padding:8px 10px;
          font-size:13px;
          outline:none;
        }

        .filter-group select:focus{
          border-color:#ef4444;
        }
      `}</style>
    </div>
  );
};

export default ProspectsFilter;