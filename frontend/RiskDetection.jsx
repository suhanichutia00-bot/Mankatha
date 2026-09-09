import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RiskDetection.css";

const RiskDetection = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeRisk = async () => {
    if (!message.trim()) {
      setError("Please tell us what you are going through. 🌼");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/risk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Risk detection failed."
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        "Could not connect to Risk Detection. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = () => {
    if (!result) return "";

    if (result.riskLevel === "LOW") {
      return "risk-low";
    }

    if (result.riskLevel === "MODERATE") {
      return "risk-moderate";
    }

    return "risk-high";
  };

  return (
    <div className="risk-page">

      <div className="risk-sun">☀️</div>
      <div className="risk-flower risk-flower-left">🌻</div>
      <div className="risk-flower risk-flower-right">🌼</div>
      <div className="risk-butterfly risk-butterfly-left">🦋</div>
      <div className="risk-butterfly risk-butterfly-right">🦋</div>

      <div className="risk-wrapper">

        <button
          className="risk-back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>

        <div className="risk-header">

          <div className="risk-icon">
            🛡️
          </div>

          <h1>Let's Check In 🌼</h1>

          <p>
            Tell Mankatha what's on your mind.
            We'll gently check if you may need additional support.
          </p>

        </div>

        <div className="risk-card">

          <div className="risk-card-title">

            <span>💛</span>

            <div>
              <h2>How are you feeling?</h2>

              <p>
                You can be completely honest. There is no judgment here.
              </p>
            </div>

          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you're going through..."
            maxLength={1000}
          />

          <div className="risk-character-count">
            {message.length}/1000
          </div>

          <button
            className="risk-analyze-button"
            onClick={analyzeRisk}
            disabled={loading}
          >
            {loading
              ? "Checking in with you..."
              : "Check My Wellbeing →"}
          </button>

          {error && (
            <div className="risk-error">
              🌸 {error}
            </div>
          )}

          {result && (
            <div className={`risk-result ${getRiskClass()}`}>

              <div className="risk-result-icon">
                {result.riskLevel === "LOW" && "🌿"}
                {result.riskLevel === "MODERATE" && "💛"}
                {result.riskLevel === "HIGH" && "🫂"}
              </div>

              <p className="risk-result-label">
                Mankatha's safety check
              </p>

              <h2>
                {result.riskLevel === "LOW" && "Low Risk"}
                {result.riskLevel === "MODERATE" && "Moderate Risk"}
                {result.riskLevel === "HIGH" && "High Risk"}
              </h2>

              <p className="risk-reason">
                {result.reason}
              </p>

              <div className="risk-action">

                <strong>What you can do:</strong>

                <p>
                  {result.recommendedAction}
                </p>

              </div>

              {result.riskLevel === "HIGH" && (
                <div className="emergency-message">

                  <strong>
                    🫂 You don't have to handle this alone.
                  </strong>

                  <p>
                    If you are in immediate danger or feel you may
                    hurt yourself or someone else, please contact
                    local emergency services or reach out to a
                    trusted person who can stay with you.
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

        <div className="risk-footer">
          🌿 Mankatha is a wellness support tool, not a replacement
          for professional mental-health care. 🌿
        </div>

      </div>

    </div>
  );
};

export default RiskDetection;
