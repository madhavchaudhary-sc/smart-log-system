import { useEffect, useState } from "react";
import "./App.css";
import { getLogs } from "./services/api";
import StatsCards from "./components/StatsCards";
import LogTable from "./components/LogTable";
import LogDetails from "./components/LogDetails";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        setLogs(data.logs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.source?.toLowerCase().includes(search.toLowerCase()) ||
      log.eventType?.toLowerCase().includes(search.toLowerCase()) ||
      log.message?.toLowerCase().includes(search.toLowerCase()) ||
      String(log.status).includes(search);

    const matchesFilter =
      filter === "all" ||
      (filter === "normal" && !log.isAnomaly) ||
      (filter === "anomaly" && log.isAnomaly) ||
      (filter === "critical" && log.severity === "CRITICAL");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="loading-state">Loading logs...</div>;
  }

  if (error) {
    return <div className="loading-state error-state">Error: {error}</div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <span className="brand-kicker">Monitoring</span>
            <h2>Smart Log Analyzer</h2>
          </div>
        </div>

        <div className="status-pill">
          <span className="status-dot" />
          Live monitoring
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Operations overview</p>
            <h1>Discover risk before it becomes a problem.</h1>
          </div>

          <div className="controls">
            <label className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <label className="select-box">
              <span>Filter</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="normal">Normal</option>
                <option value="anomaly">Anomaly</option>
                <option value="critical">Critical</option>
              </select>
            </label>
          </div>
        </section>

        <StatsCards logs={logs} />

        <section className="table-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Activity feed</p>
              <h2>Recent system logs</h2>
            </div>

            <span className="table-badge">{filteredLogs.length} visible</span>
          </div>

          <LogTable
            logs={filteredLogs}
            onSelectLog={(log) => {
              console.log("Selected log:", log);
              setSelectedLog(log);
            }}
          />
        </section>
      </main>

      <LogDetails
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}

export default App;