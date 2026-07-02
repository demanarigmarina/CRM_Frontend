import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

import {
  ProspectForm,
  ProspectsFilter,
  useProspects,
} from "../../features/prospects";
import {
  PageBase,
  PageHeader,
  PageToolbar,
  PageContentState,
} from "../../components/page";
import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

export default function Prospects() {
  const {
    prospects,
    loading,

    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    sourceFilter,
    setSourceFilter,

    addProspect,
    editProspect,
    removeProspect,
    contactProspect,
  } = useProspects();

  const [openForm, setOpenForm] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);

  const {
    currentPage,
    rowsPerPage,
    totalRows,
    totalPages,
    paginatedItems,
    pageWindow,
    from,
    to,
    goTo,
    setRowsPerPage,
  } = useTablePagination(prospects, 10);

  useEffect(() => {
    if (totalRows === 0 || currentPage > totalPages) {
      goTo(1);
    }
  }, [currentPage, totalRows, totalPages, goTo]);

  const handleSave = async (prospect) => {
    const success = editingProspect
      ? await editProspect(editingProspect._id, prospect)
      : await addProspect(prospect);

    if (!success) return;

    Toast.fire({
      icon: "success",
      title: editingProspect ? "Prospect updated successfully" : "Prospect created successfully",
    });

    setEditingProspect(null);
    setOpenForm(false);
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Prospects"
          subtitle="Store client forms and track potential customers before they are contacted."
        />

        <PageToolbar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search by company, contact person, or email..."
          filterSlot={
            <ProspectsFilter
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
            />
          }
        actionButton={
  <button
    type="button"
    onClick={() => {
      setEditingProspect(null);
      setOpenForm(true);
    }}
    className="bg-red-500 hover:bg-red-600 text-white h-12 px-6 rounded-md cursor-pointer min-w-[175px]"
  >
    <span className="flex items-center justify-center gap-2 text-sm whitespace-nowrap font-medium">
      <FaPlus size={11} />
      Add Prospect
    </span>
  </button>
}
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-500">
          Loading prospects...
        </div>
      ) : (
        <>
          <BaseTable
            columns={[
              { label: "#" },
              { label: "Company" },
              { label: "Contact Person" },
              { label: "Email" },
              { label: "Phone" },
              { label: "Lead Source" },
              { label: "Status" },
              { label: "", align: "text-right" },
            ]}
            empty={paginatedItems.length === 0 ? "No prospects found." : null}
            colSpan={8}
            heightClass="h-[450px]"
          >
            {paginatedItems.map((prospect, index) => (
              <TableRow key={prospect._id || index}>
                <TableCell>{from + index}</TableCell>

                <TableCell>{prospect.company}</TableCell>

                <TableCell>{prospect.contactPerson}</TableCell>

                <TableCell>{prospect.companyEmail || prospect.email}</TableCell>

                <TableCell>{prospect.phone}</TableCell>

                <TableCell>{prospect.leadSource}</TableCell>

                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {prospect.status}
                  </span>
                </TableCell>

                <TableCell align="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProspect(prospect);
                        setOpenForm(true);
                      }}
                      className="text-gray-500 hover:text-red-600 transition-colors text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProspect(prospect._id);
                      }}
                      className="text-gray-500 hover:text-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        contactProspect(prospect._id);
                      }}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      Contact
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </BaseTable>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            from={from}
            to={to}
            pageWindow={pageWindow}
            onGoTo={goTo}
            onRowsPerPageChange={setRowsPerPage}
          />
        </>
      )}

      <ProspectForm
        open={openForm}
        editingProspect={editingProspect}
        onClose={() => {
          setOpenForm(false);
          setEditingProspect(null);
        }}
        onSave={handleSave}
      />
    </PageBase>
  );
}