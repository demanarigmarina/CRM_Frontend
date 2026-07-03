import { useMemo, useState } from "react";
import Select from "react-select";

import { PageBase, PageHeader, PageToolbar } from "../../../components/page";

import FilterPopover from "../../../components/filters/FilterPopover";
import { useFilterPopover } from "../../../components/filters/useFilterPopover";
import { getSelectProps } from "../../../components/select/selectConfig";

import ReportTable from "../components/ReportTable";

// Temporary report list
const reports = [
  {
    id: 1,
    title: "Sales Report",
    description: "Monitor sales progress and revenue",
    category: "Sales",
    route: "/reports/sales",
  },
  {
    id: 2,
    title: "Lead Conversion Report",
    description: "View lead conversion statistics",
    category: "Leads",
    route: "/reports/leads",
  },
  {
    id: 3,
    title: "Client Report",
    description: "Generate client information reports",
    category: "Clients",
    route: "/reports/clients",
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const clearAllFilters = () => {
    setFilterCategory("All");
  };

  const { filterOpen, setFilterOpen, filterRef, activeFilterCount } =
    useFilterPopover(
      {
        filterCategory,
      },
      clearAllFilters,
    );

  const filteredReports = useMemo(() => {
    const keyword = search.toLowerCase();

    return reports.filter((report) => {
      const searchMatch =
        report.title.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword);

      const categoryMatch =
        filterCategory === "All" ||
        report.category === filterCategory;

      return searchMatch && categoryMatch;
    });
  }, [search, filterCategory]);

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Reports"
          subtitle="Generate reports to monitor CRM activities, sales progress, and team performance."
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search reports..."
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((prev) => !prev)}
              activeFilterCount={
                filterCategory === "All" ? 0 : activeFilterCount
              }
              onClearAll={clearAllFilters}
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Report Category
                </p>

                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All Reports"
                  options={[
                    {
                      label: "All Reports",
                      value: "All",
                    },
                    {
                      label: "Sales",
                      value: "Sales",
                    },
                    {
                      label: "Leads",
                      value: "Leads",
                    },
                    {
                      label: "Clients",
                      value: "Clients",
                    },
                  ]}
                  value={{
                    label:
                      filterCategory === "All"
                        ? "All Reports"
                        : filterCategory,
                    value: filterCategory,
                  }}
                  onChange={(option) =>
                    setFilterCategory(option?.value || "All")
                  }
                />
              </div>
            </FilterPopover>
          }
        />
      </div>

      <ReportTable reports={filteredReports} />
    </PageBase>
  );
}