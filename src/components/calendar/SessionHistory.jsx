import { useMemo, useState } from "react";

import {
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Search,
  Pagination,
  Button,
  IconButton,
  Select,
  SelectItem,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";

import {
  Renew,
  Filter,
  Download,
  Launch,
  Bookmark,
  CheckmarkFilled,
  OverflowMenuHorizontal,
  ChevronDown,
} from "@carbon/icons-react";

import "./SessionHistory.scss";

const headers = [
  { key: "activity", header: "Activity" },
  { key: "sessionId", header: "Session ID" },
  { key: "date", header: "Date" },
  { key: "status", header: "Status" },
  { key: "category", header: "Category" },
  { key: "type", header: "Type" },
  { key: "facilitator", header: "Facilitator" },
  { key: "reportStatus", header: "Report Status" },
  { key: "actions", header: "" },
];

function StatusIcon({ status }) {
  if (status === "completed") {
    return <CheckmarkFilled className="sh-status-icon sh-status-icon--completed" />;
  }

  return (
    <span className="sh-status-icon sh-status-icon--pending" aria-hidden="true">
      <OverflowMenuHorizontal size={12} />
    </span>
  );
}

function SessionHistory({ sessions = [], onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Session");
  const [summaryRow, setSummaryRow] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const rows = useMemo(() => {
    const source =
      sessions.length > 0
        ? sessions
        : [
            {
              id: "1",
              title: "Swithika Aravind - Individual Session",
              start: "2026-03-12",
            },
          ];

    return source.map((item, index) => ({
      id: String(item.id),
      activity:
        index === 0
          ? "Swithika Aravind - Individual Session"
          : item.title,
      sessionId:
        index === 0 ? "ASN12235BN811V" : `ASN${item.id}`,
      date: "12 Mar 2026",
      status: "Completed",
      category: index === 0 ? "Workshop" : "Session",
      type: "Individual",
      facilitator: "Saranya LK",
      reportStatus: "Pending",
    }));
  }, [sessions]);

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      search.length === 0 ||
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      category === "All" ||
      row.category === category ||
      category === "Session";

    return matchesSearch && matchesCategory;
  });

  const start = (page - 1) * pageSize;
  const paginatedRows = filteredRows.slice(start, start + pageSize);

  const refreshHistory = () => {
    setSearch("");
    setCategory("Session");
    setPage(1);
  };

  const downloadHistory = () => {
    console.log("download csv");
  };

  return (
    <section className="sh-shell">
      <div className="sh-panel">

        {/* ── HEADER ── */}
        <div className="sh-intro">
          <div className="sh-intro__text">
            <h2 className="sh-intro__title">View Session History</h2>
            <p className="sh-intro__desc">
              View a complete timeline of counselling sessions, assessments,
              referrals, follow ups, workshops and wellbeing activities
              associated with the student.
            </p>
          </div>
          <button className="sh-close-btn" type="button" aria-label="Close">
            ×
          </button>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="sh-toolbar">
          {/* Category inline select */}
          <div className="sh-toolbar__category">
            <span className="sh-toolbar__category-label">Category</span>
            <Select
              id="sh-category"
              labelText=""
              hideLabel
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="sh-category-select"
            >
              <SelectItem value="Session" text="Session" />
              <SelectItem value="Workshop" text="Workshop" />
              <SelectItem value="Assessment" text="Assessment" />
              <SelectItem value="All" text="All" />
            </Select>
          </div>

          {/* Search */}
          <div className="sh-toolbar__search">
            <Search
              size="sm"
              labelText="Search"
              placeholder="Search assessments, sessions, notes, or activities"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Icon actions */}
          <div className="sh-toolbar__icons">
            <IconButton
              kind="ghost"
              label="Save"
              size="sm"
            >
              <Bookmark />
            </IconButton>
            <IconButton
              kind="ghost"
              label="Filter"
              size="sm"
            >
              <Filter />
            </IconButton>
            <IconButton
              kind="ghost"
              label="Download"
              size="sm"
              onClick={downloadHistory}
            >
              <Download />
            </IconButton>
          </div>

          {/* Actions overflow styled as dark button */}
          <OverflowMenu
            ariaLabel="Actions"
            flipped
            renderIcon={() => null}
            className="sh-actions-btn"
            menuOptionsClass="sh-actions-menu"
          >
            <OverflowMenuItem
              itemText="Refresh"
              onClick={refreshHistory}
            />
            <OverflowMenuItem itemText="Export" />
            <OverflowMenuItem itemText="Delete Selected" isDelete />
          </OverflowMenu>
        </div>

        {/* ── TABLE ── */}
        <TableContainer className="sh-table-container">
          <DataTable rows={paginatedRows} headers={headers}>
            {({
              rows,
              headers,
              getTableProps,
              getHeaderProps,
              getRowProps,
            }) => (
              <Table {...getTableProps()} size="md">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map((cell) => {

                        /* Activity – blue link */
                        if (cell.info.header === "activity") {
                          return (
                            <TableCell key={cell.id}>
                              <button
                                className="sh-activity-link"
                                onClick={() =>
                                  setSummaryRow(
                                    paginatedRows.find((r) => r.id === row.id)
                                  )
                                }
                              >
                                {cell.value}
                              </button>
                            </TableCell>
                          );
                        }

                        /* Status – green dot + text */
                        if (cell.info.header === "status") {
                          return (
                            <TableCell key={cell.id}>
                              <span className="sh-status sh-status--completed">
                                <StatusIcon status="completed" />
                                Completed
                              </span>
                            </TableCell>
                          );
                        }

                        /* Report Status – gray dot + text */
                        if (cell.info.header === "reportStatus") {
                          return (
                            <TableCell key={cell.id}>
                              <span className="sh-status sh-status--pending">
                                <StatusIcon status="pending" />
                                Pending
                              </span>
                            </TableCell>
                          );
                        }

                        /* Row overflow menu */
                        if (cell.info.header === "actions") {
                          return (
                            <TableCell key={cell.id} className="sh-actions-cell">
                              <OverflowMenu flipped size="sm">
                                <OverflowMenuItem
                                  itemText="Edit"
                                  onClick={() => onEdit?.(row.id)}
                                />
                                <OverflowMenuItem
                                  itemText="Delete"
                                  isDelete
                                  onClick={() => onDelete?.(row.id)}
                                />
                              </OverflowMenu>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
        </TableContainer>

        {/* ── PAGINATION ── */}
        <Pagination
          page={page}
          pageSize={pageSize}
          pageSizes={[5, 10, 15]}
          totalItems={filteredRows.length}
          onChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>

      {/* ── SUMMARY DRAWER ── */}
      {/* ── SUMMARY DRAWER ── */}
{summaryRow && (
  <div
    className="sh-overlay"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setSummaryRow(null);
      }
    }}
  >
    <aside className="sh-drawer">

      <div className="sh-drawer-header">
        <div>
          <div className="sh-drawer-title">
            {summaryRow.activity}
          </div>

          <div className="sh-drawer-subtitle">
            ASN12235BN811V · 12 Mar 2026 · Saranya LK
          </div>
        </div>

        <button
          className="sh-drawer-close"
          onClick={() => setSummaryRow(null)}
        >
          ×
        </button>
      </div>

      <div className="sh-section">
        <div className="sh-section-title-row">
          <span>Session Summary</span>
          <span className="ai-chip">AI</span>
        </div>

        <div className="sh-section-content">
          During this individual counselling session,
          the student discussed current academic and
          personal concerns, exploring thoughts,
          emotions and experiences contributing to
          their present challenges. Through guided
          reflection, the student identified key
          stressors, strengths and areas requiring
          support.
        </div>
      </div>

      <div className="sh-guide-section">
        <div className="sh-guide-title">
          <ChevronDown size={16} />
          <span>Facilitator guide</span>
        </div>

        <ul>
          <li>
            Helps participants understand and embrace
            change by identifying fears and strengths.
          </li>

          <li>
            Uses reflective activities and self
            reflection.
          </li>

          <li>
            Encourages participants to take meaningful
            actions confidently.
          </li>
        </ul>
      </div>

      <div className="sh-overview-section">

        <div className="sh-overview-title">
          Overview
        </div>

        <div className="sh-overview-row">
          <span>Session Date</span>
          <span>19 May 2026</span>
        </div>

        <div className="sh-overview-row">
          <span>Facilitator</span>
          <span>Janice Antony</span>
        </div>

        <div className="sh-overview-row">
          <span>Session Type</span>
          <span>Follow Up</span>
        </div>

        <div className="sh-overview-row">
          <span>Report Status</span>

          <span className="submitted-status">
            ● Submitted
          </span>
        </div>

      </div>

      <div className="sh-drawer-footer">

        <Button
          kind="primary"
          renderIcon={Launch}
        >
          Open Report
        </Button>

        <button
          className="sh-notes-link"
          type="button"
        >
          View Notes
        </button>

      </div>

    </aside>
  </div>
)}
    </section>
  );
}

export default SessionHistory;
