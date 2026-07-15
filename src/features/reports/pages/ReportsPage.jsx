import {useEffect,useMemo,useState} from "react";
import {FaPlus} from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";
import {PageBase,PageHeader,PageToolbar} from "../../../components/page";
import FilterPopover from "../../../components/filters/FilterPopover";
import {useFilterPopover} from "../../../components/filters/useFilterPopover";
import {getSelectProps} from "../../../components/select/selectConfig";
import {TablePagination,useTablePagination} from "../../../components/table";
import ReportTable from "../components/ReportTable";
import ReportModal from "../components/ReportModal";

const STORAGE_KEY="intellicrm_reports";
const initialReports=[
  {id:1,title:"Sales Report",description:"Monitor sales progress and revenue",category:"Sales",route:"/reports/sales"},
  {id:2,title:"Lead Conversion Report",description:"View lead conversion statistics",category:"Leads",route:"/reports/leads"},
  {id:3,title:"Client Report",description:"Generate client information reports",category:"Clients",route:"/reports/clients"},
];
const emptyForm={title:"",description:"",category:"Sales"};
const categoryOptions=[
  {label:"All Reports",value:"All"},
  {label:"Sales",value:"Sales"},
  {label:"Leads",value:"Leads"},
  {label:"Clients",value:"Clients"},
];
const Toast=Swal.mixin({
  toast:true,position:"top-end",showConfirmButton:false,
  timer:3000,timerProgressBar:true,width:"auto",
});

const loadReports=()=>{
  try{
    const stored=localStorage.getItem(STORAGE_KEY);
    if(!stored){
      localStorage.setItem(STORAGE_KEY,JSON.stringify(initialReports));
      return initialReports;
    }
    const parsed=JSON.parse(stored);
    return Array.isArray(parsed)?parsed:initialReports;
  }catch{
    return initialReports;
  }
};

export default function ReportsPage({settingsMode=false,embedded=false}){
  const [reports,setReports]=useState(loadReports);
  const [search,setSearch]=useState("");
  const [filterCategory,setFilterCategory]=useState("All");
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [editingReport,setEditingReport]=useState(null);
  const [formData,setFormData]=useState(emptyForm);
  const [submitting,setSubmitting]=useState(false);

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(reports));
  },[reports]);

  const clearAllFilters=()=>setFilterCategory("All");
  const {filterOpen,setFilterOpen,filterRef,activeFilterCount}=useFilterPopover(
    {filterCategory},
    clearAllFilters,
  );

  const openCreateModal=()=>{
    setEditingReport(null);
    setFormData({...emptyForm});
    setIsModalOpen(true);
  };

  const openEditModal=report=>{
    setEditingReport(report);
    setFormData({
      title:report.title,
      description:report.description,
      category:report.category,
    });
    setIsModalOpen(true);
  };

  const closeModal=()=>{
    setIsModalOpen(false);
    setEditingReport(null);
    setFormData({...emptyForm});
  };

  const handleFieldChange=(field,value)=>{
    setFormData(current=>({...current,[field]:value}));
  };

  const handleSubmit=async event=>{
    event.preventDefault();
    const title=formData.title.trim();
    const description=formData.description.trim();
    const category=formData.category.trim();

    if(!title||!category){
      await Swal.fire({
        icon:"error",
        title:"Validation error",
        text:"Please enter a report name and category.",
      });
      return;
    }

    setSubmitting(true);

    try{
      await new Promise(resolve=>window.setTimeout(resolve,400));
      const slug=title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"")||"report";

      if(editingReport){
        setReports(current=>current.map(report=>
          report.id===editingReport.id
            ?{...report,title,description,category,route:`/reports/${slug}`}
            :report,
        ));
        Toast.fire({icon:"success",title:"Report updated successfully"});
      }else{
        setReports(current=>[
          {id:Date.now(),title,description,category,route:`/reports/${slug}`},
          ...current,
        ]);
        Toast.fire({icon:"success",title:"Report created successfully"});
      }

      closeModal();
    }finally{
      setSubmitting(false);
    }
  };

  const handleDelete=async reportId=>{
    const result=await Swal.fire({
      title:"Delete report?",
      text:"This action cannot be undone.",
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:"#d33",
      cancelButtonColor:"#3085d6",
      confirmButtonText:"Yes, delete it!",
    });

    if(!result.isConfirmed)return;
    setSubmitting(true);

    try{
      await new Promise(resolve=>window.setTimeout(resolve,350));
      setReports(current=>current.filter(report=>report.id!==reportId));
      Toast.fire({icon:"success",title:"Report deleted successfully"});
    }finally{
      setSubmitting(false);
    }
  };

  const filteredReports=useMemo(()=>{
    const keyword=search.trim().toLowerCase();

    return reports.filter(report=>{
      const searchMatch=[
        report.title,report.description,report.category,
      ].some(value=>String(value||"").toLowerCase().includes(keyword));

      const categoryMatch=
        filterCategory==="All"||
        report.category===filterCategory;

      return searchMatch&&categoryMatch;
    });
  },[reports,search,filterCategory]);

  const paginationSource=settingsMode?[]:filteredReports;

  const {
    currentPage,rowsPerPage,totalRows,totalPages,paginatedItems,
    pageWindow,from,to,goTo,setRowsPerPage,
  }=useTablePagination(paginationSource,10);

  const toolbar=(
    <div className="mb-4 mt-4 flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <PageHeader
        title="Reports"
        subtitle="Generate reports to monitor CRM activities, sales progress, and team performance."
      />

      <PageToolbar
        searchValue={search}
        onSearchChange={event=>setSearch(event.target.value)}
        searchPlaceholder="Search reports..."
        filterSlot={
          <FilterPopover
            filterRef={filterRef}
            filterOpen={filterOpen}
            onToggle={()=>setFilterOpen(previous=>!previous)}
            activeFilterCount={filterCategory==="All"?0:activeFilterCount}
            onClearAll={clearAllFilters}
          >
            <div>
              <p className="mb-1 text-xs text-gray-400">Report Category</p>
              <Select
                {...getSelectProps({variant:"filter"})}
                placeholder="All Reports"
                options={categoryOptions}
                value={
                  categoryOptions.find(
                    option=>option.value===filterCategory,
                  )||categoryOptions[0]
                }
                onChange={option=>setFilterCategory(option?.value||"All")}
              />
            </div>
          </FilterPopover>
        }
        actionButton={
          <button
            type="button"
            onClick={openCreateModal}
            className="min-w-[150px] cursor-pointer rounded-md bg-red-500 px-5 py-2 text-white hover:bg-red-600"
          >
            <span className="flex items-center justify-center gap-2 whitespace-nowrap text-sm">
              <FaPlus size={11}/>
              Add Report
            </span>
          </button>
        }
      />
    </div>
  );

  const settingsTable=(
    <table className="w-full min-w-[760px] border-collapse">
      <thead className="sticky top-0 z-10 bg-white">
        <tr className="border-b border-gray-200">
          <th className="w-[27%] px-3 pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Report Name
          </th>
          <th className="w-[40%] px-3 pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Description
          </th>
          <th className="w-[18%] px-3 pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category
          </th>
          <th className="w-[15%] px-3 pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody/>
    </table>
  );

  const content=(
    <div className="flex h-full min-h-0 flex-col">
      {toolbar}

      <div className="min-h-0 flex-1 overflow-auto pr-1 [scrollbar-gutter:stable]">
        {settingsMode
          ?settingsTable
          :(
            <ReportTable
              reports={paginatedItems}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          )
        }
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white pt-3">
        <TablePagination
          currentPage={totalRows?currentPage:1}
          totalPages={Math.max(totalPages,1)}
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          from={totalRows?from:0}
          to={totalRows?to:0}
          pageWindow={totalRows?pageWindow:[1]}
          onGoTo={totalRows?goTo:()=>{}}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>

      <ReportModal
        open={isModalOpen}
        editingReport={editingReport}
        formData={formData}
        loading={submitting}
        onChange={handleFieldChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );

  return embedded?content:<PageBase>{content}</PageBase>;
}