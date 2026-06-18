import { useMemo, useState } from "react";
import "./SessionHistory.scss";
import {
  ChevronDown,
  Download,
  Filter,
  Launch,
  OverflowMenuVertical,
  Renew,
  Search,
} from "@carbon/icons-react";

const pageSizes = [5, 10, 15];
const makeSessionCode = (session, index) => {
  if (index === 0) return "ASN12235BN811V";

  return `ASN${String(session.id).padStart(9, "0")}V`.slice(0, 15);
};

const formatSessionDate = (value) => {
  const date = new Date(
    String(value || "").includes("T") ? value : `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value || "12 Mar 2026";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

function SessionHistory({ sessions, onDelete, onEdit }) {
  const [category, setCategory] = useState("Session");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [summaryRow, setSummaryRow] = useState(null);
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const historyRows = useMemo(() => {
    const sourceRows =
      sessions.length > 0
        ? sessions
        : [
            {
              id: "fallback",
              title: "Swithika Aravind - Individual Session",
              start: "2026-03-12",
            },
          ];

    return sourceRows.map((session, index) => ({
      id: String(session.id),
      activity:
        index === 0
          ? "Swithika Aravind - Individual Session"
          : session.title || "Individual Session",
      sessionId:
        index === 0
          ? "ASN12235BN811V"
          : makeSessionCode(session, index),
      date: index === 0 ? "12 Mar 2026" : formatSessionDate(session.start),
      status: "Completed",
      category: index === 0 ? "Workshop" : "Session",
      type: "Individual",
      facilitator: "Saranya LK",
      reportStatus: "Pending",
    }));
  }, [sessions]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return historyRows.filter((row) => {
      const matchesCategory =
        category === "All" ||
        category === "Session" ||
        row.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(normalizedQuery)
        );
      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      return matchesCategory && matchesQuery && matchesStatus;
    });
  }, [category, historyRows, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(pageStart, pageStart + pageSize);

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const refreshHistory = () => {
    setCategory("Session");
    setQuery("");
    setStatusFilter("All");
    setFilterOpen(false);
    setOpenRowMenu(null);
    setPage(1);
  };

  const downloadHistory = () => {
    const headers = [
      "Activity",
      "Session ID",
      "Date",
      "Status",
      "Category",
      "Type",
      "Facilitator",
      "Report Status",
    ];
    const csvRows = filteredRows.map((row) =>
      [
        row.activity,
        row.sessionId,
        row.date,
        row.status,
        row.category,
        row.type,
        row.facilitator,
        row.reportStatus,
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    );
    const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "session-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="session-history-shell">
      <div className="session-history-panel">
        <div className="session-history-intro">
          <div>
            <h2>View Session History</h2>
            <p>
              View a complete timeline of counselling sessions, assessments,
              referrals, follow ups, workshops, and other wellbeing activities
              associated with the student.
            </p>
          </div>
          <button className="history-close-button" type="button" aria-label="Close">
            x
          </button>
        </div>

        <div className="history-table-frame">
          <div className="history-toolbar">
            <label className="category-select">
              <span>Category</span>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                aria-label="Category"
              >
                <option>Session</option>
                <option>All</option>
                <option>Workshop</option>
                <option>Assessment</option>
              </select>
              <ChevronDown size={16} />
            </label>

            <label className="history-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search assessments, sessions, notes, or activities"
                type="search"
              />
            </label>

            <div className="history-toolbar-icons" aria-label="Table tools">
              <button type="button" aria-label="Refresh" onClick={refreshHistory}>
                <Renew size={16} />
              </button>
              <button
                type="button"
                aria-label="Filter"
                onClick={() => setFilterOpen((value) => !value)}
              >
                <Filter size={16} />
              </button>
              <button type="button" aria-label="Download" onClick={downloadHistory}>
                <Download size={16} />
              </button>
            </div>

            <label className="actions-select">
              <select aria-label="Actions" defaultValue="Actions">
                <option>Actions</option>
                <option>Export</option>
                <option>Delete selected</option>
              </select>
              <ChevronDown size={16} />
            </label>
          </div>

          {filterOpen && (
            <div className="history-filter-bar">
              <label>
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                >
                  <option>All</option>
                  <option>Completed</option>
                </select>
              </label>
              <label>
                Category
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                >
                  <option>Session</option>
                  <option>All</option>
                  <option>Workshop</option>
                  <option>Assessment</option>
                </select>
              </label>
            </div>
          )}

          <div className="history-table-scroll">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Session ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Facilitator</th>
                  <th>Report Status</th>
                  <th aria-label="Row actions" />
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <button
                        className="activity-link"
                        type="button"
                        onClick={() => setSummaryRow(row)}
                      >
                        {row.activity}
                      </button>
                    </td>
                    <td>{row.sessionId}</td>
                    <td>{row.date}</td>
                    <td>
                      <span className="status-pill status-completed">
                        <span className="status-dot" />
                        {row.status}
                      </span>
                    </td>
                    <td>{row.category}</td>
                    <td>{row.type}</td>
                    <td>{row.facilitator}</td>
                    <td>
                      <span className="status-pill report-pending">
                        <span className="status-dot" />
                        {row.reportStatus}
                      </span>
                    </td>
                    <td>
                      <div className="history-row-actions">
                        <button
                          className="row-menu-button"
                          type="button"
                          aria-label={`Open actions for ${row.activity}`}
                          onClick={() =>
                            setOpenRowMenu((value) =>
                              value === row.id ? null : row.id
                            )
                          }
                        >
                          <OverflowMenuVertical size={16} />
                        </button>
                        {openRowMenu === row.id && (
                          <div className="history-row-menu">
                            <button
                              type="button"
                              onClick={() => {
                                onEdit?.(row.id);
                                setOpenRowMenu(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="danger"
                              onClick={() => {
                                if (row.id !== "fallback") {
                                  onDelete?.(Number(row.id));
                                }
                                setOpenRowMenu(null);
                              }}
                            >
                              Delete app
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 && (
                  <tr>
                    <td className="empty-row" colSpan="9">
                      No sessions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="history-pagination">
            <label>
              Items per page:
              <select value={pageSize} onChange={handlePageSizeChange}>
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>

            <span>
              {filteredRows.length === 0 ? 0 : pageStart + 1}-
              {Math.min(pageStart + pageSize, filteredRows.length)} of{" "}
              {filteredRows.length} items
            </span>

            <div className="history-page-select">
              <select
                value={currentPage}
                onChange={(event) => setPage(Number(event.target.value))}
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <option key={pageNumber} value={pageNumber}>
                      {pageNumber}
                    </option>
                  )
                )}
              </select>
              <ChevronDown size={14} />
              <span>of {totalPages} pages</span>
            </div>

            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronDown className="previous-icon" size={16} />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              <ChevronDown className="next-icon" size={16} />
            </button>
          </div>
        </div>
      </div>
      {summaryRow && (
        <div className="summary-drawer-overlay">
          <aside className="summary-drawer" aria-label="Session summary">
            <header>
              <div>
                <h2>{summaryRow.activity}</h2>
                <p>SES-MY-IN-001</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSummaryRow(null)}>
                x
              </button>
            </header>

            <section className="summary-section primary-summary">
              <div className="summary-title-row">
                <h3>Session Summary</h3>
                <span>AI</span>
              </div>
              <p>
                During this individual counselling session, the student discussed
                current academic and personal concerns, exploring the thoughts,
                emotions, and experiences contributing to their present
                challenges. Through guided reflection, the student identified key
                stressors, personal strengths, and areas requiring support.
              </p>
            </section>

            <section className="summary-section facilitator-guide">
              <h3>Facilitator guide</h3>
              <ul>
                <li>Helps participants understand and embrace change by identifying fears, strengths, support systems, and opportunities.</li>
                <li>Uses interactive activities, self reflection, team collaboration, and grounding techniques.</li>
                <li>Encourages participants to take meaningful actions with confidence.</li>
              </ul>
            </section>

            <section className="summary-section overview-list">
              <h3>Overview</h3>
              <dl>
                <div>
                  <dt>Session Date</dt>
                  <dd>19 May 2026</dd>
                </div>
                <div>
                  <dt>Facilitator</dt>
                  <dd>Janice Antony</dd>
                </div>
                <div>
                  <dt>Session Type</dt>
                  <dd>Follow Up</dd>
                </div>
                <div>
                  <dt>Report Status</dt>
                  <dd><span className="submitted-dot" />Submitted</dd>
                </div>
              </dl>
            </section>

            <div className="summary-actions">
              <button type="button">
                Open Report
                <Launch size={16} />
              </button>
              <button type="button">View Notes</button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default SessionHistory;
