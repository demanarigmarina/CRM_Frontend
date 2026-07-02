import React from "react";

const ProspectTable = ({
  prospects,
  onEdit,
  onDelete,
  onConvert,
}) => {
  return (
    <div className="table-container">
      <table className="prospect-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Company Name</th>
            <th>Representative</th>
            <th>Company Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Lead Source</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {prospects.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-table">
                No prospects found.
              </td>
            </tr>
          ) : (
            prospects.map((prospect, index) => (
              <tr key={prospect._id || index}>
                <td>{index + 1}</td>

                {/* Company */}
                <td>{prospect.companyName}</td>

                {/* Representative */}
                <td>
                  {[
                    prospect.representativeName?.firstName,
                    prospect.representativeName?.middleInitial,
                    prospect.representativeName?.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ") || "N/A"}
                </td>

                {/* Company Email */}
                <td>{prospect.companyEmailAddress}</td>

                {/* Phone */}
                <td>{prospect.phone}</td>

                {/* City */}
                <td>{prospect.businessAddress?.city || "-"}</td>

                {/* Lead Source */}
                <td>{prospect.leadSource}</td>

                {/* Status */}
                <td>
                  <span
                    className={`status ${prospect.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {prospect.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(prospect)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(prospect._id)}
                  >
                    Delete
                  </button>

                  <button
                    className="convert-btn"
                    onClick={() => onConvert(prospect._id)}
                  >
                    Contact
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style>{`
        .table-container{
          margin-top:16px;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:10px;
          overflow:hidden;
        }

        .prospect-table{
          width:100%;
          border-collapse:collapse;
        }

        .prospect-table thead{
          background:#f9fafb;
        }

        .prospect-table th{
          padding:10px 12px;
          text-align:left;
          font-size:12px;
          font-weight:600;
          color:#6b7280;
          border-bottom:1px solid #e5e7eb;
          white-space:nowrap;
        }

        .prospect-table td{
          padding:10px 12px;
          font-size:12px;
          color:#374151;
          border-bottom:1px solid #f3f4f6;
          vertical-align:middle;
        }

        .prospect-table tbody tr:hover{
          background:#fafafa;
        }

        .empty-table{
          text-align:center;
          padding:30px;
          color:#9ca3af;
          font-size:12px;
        }

        .action-buttons{
          display:flex;
          gap:6px;
          flex-wrap:wrap;
        }

        button{
          cursor:pointer;
          border:none;
          padding:5px 10px;
          border-radius:6px;
          font-size:11px;
          font-weight:600;
          transition:.2s;
        }

        .edit-btn{
          background:#f3f4f6;
          color:#374151;
        }

        .edit-btn:hover{
          background:#e5e7eb;
        }

        .delete-btn{
          background:#fee2e2;
          color:#dc2626;
        }

        .delete-btn:hover{
          background:#fecaca;
        }

        .convert-btn{
          background:#16a34a;
          color:#fff;
        }

        .convert-btn:hover{
          background:#15803d;
        }

        .status{
          display:inline-block;
          padding:4px 10px;
          border-radius:999px;
          font-size:11px;
          font-weight:600;
          color:white;
        }

        .new{
          background:#2563eb;
        }

        .contacted{
          background:#16a34a;
        }

        .qualified{
          background:#9333ea;
        }

        .lost{
          background:#dc2626;
        }
      `}</style>
    </div>
  );
};

export default ProspectTable;