import { useState } from "react";
import { explainAnomaly } from "../services/api";

function LogDetails({ log, onClose }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  if (!log) return null;

  const handleGenerateAI = async () => {
    try {
      setAiLoading(true);
      setAiError("");

      const data = await explainAnomaly(log._id);

      setAnalysis(data.analysis);
    } catch (error) {
      console.error("AI Error:", error);
      setAiError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Log Details</h2>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="details-grid">
          <div>
            <span>Timestamp</span>
            <strong>
              {new Date(log.timestamp).toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Source</span>
            <strong>{log.source}</strong>
          </div>

          <div>
            <span>Event</span>
            <strong>{log.eventType}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{log.status}</strong>
          </div>

          <div>
            <span>Severity</span>
            <strong>{log.severity}</strong>
          </div>

          <div>
            <span>Anomaly Score</span>
            <strong>{log.anomalyScore}</strong>
          </div>
        </div>

        <div className="detail-section">
          <h3>Message</h3>
          <p>{log.message}</p>
        </div>

        <div className="detail-section">
          <h3>Detection Reason</h3>
          <p>
            {log.anomalyReason || "No unusual pattern detected"}
          </p>
        </div>

        {log.isAnomaly && (
          <div className="ai-section">
            <h3>AI Analysis</h3>

            {analysis ? (
              <>
                <p>
                  <strong>Explanation:</strong>{" "}
                  {analysis.explanation}
                </p>

                <p>
                  <strong>Likely Root Cause:</strong>{" "}
                  {analysis.rootCause}
                </p>

                <p>
                  <strong>Recommended Next Step:</strong>{" "}
                  {analysis.nextStep}
                </p>
              </>
            ) : (
              <>
                <p>AI explanation not generated yet.</p>

                <button
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                >
                  {aiLoading
                    ? "Generating..."
                    : "Generate AI Explanation"}
                </button>

                {aiError && (
                  <p style={{ color: "red" }}>
                    {aiError}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LogDetails;