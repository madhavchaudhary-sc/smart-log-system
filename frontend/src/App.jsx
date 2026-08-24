import { useEffect, useState } from "react";
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
    return <h2>Loading logs...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div>
      <h1>Smart Log Analyzer</h1>

      <StatsCards logs={logs} />

      <input
        type="text"
        placeholder="Search logs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="normal">Normal</option>
        <option value="anomaly">Anomaly</option>
        <option value="critical">Critical</option>
      </select>

      
         
      <LogTable
  logs={filteredLogs}
  onSelectLog={(log) => {
    console.log("Selected log:", log);
    setSelectedLog(log);
  }}
/>
      
     

      <LogDetails
  log={selectedLog}
  onClose={() => setSelectedLog(null)}
/>

    </div>
  );
}

export default App;