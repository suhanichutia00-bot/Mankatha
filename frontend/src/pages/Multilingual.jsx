import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Multilingual.css";

const Multilingual = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("Assamese");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const translateMessage = async () => {
    if (!message.trim()) {
      setError("Please enter a message first. 🌼");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/multilingual",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
            language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Translation failed."
        );
      }

      setResult(data.translatedText);

    } catch (error) {
      console.error(error);

      setError(
        "Could not connect to the multilingual service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multilingual-page">

      <div className="multi-sun">☀️</div>

      <div className="multi-flower multi-flower-left">
        🌻
      </div>

      <div className="multi-flower multi-flower-right">
        🌼
      </div>

      <div className="multilingual-wrapper">

        <button
          className="multi-back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>

        <div className="multi-header">

          <div className="multi-icon">
            🌍
          </div>

          <h1>Express Yourself 🌼</h1>

          <p>
            Share your thoughts in the language
            you feel most comfortable with.
          </p>

        </div>

        <div className="multi-card">

          <h2>🌷 Choose your language</h2>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Assamese">অসমীয়া</option>
            <option value="Bengali">বাংলা</option>
          </select>

          <h2>💛 Your message</h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write what you're feeling..."
            maxLength={1000}
          />

          <div className="multi-character-count">
            {message.length}/1000
          </div>

          <button
            className="multi-button"
            onClick={translateMessage}
            disabled={loading}
          >
            {loading
              ? "Translating..."
              : "Translate Message →"}
          </button>

          {error && (
            <div className="multi-error">
              🌸 {error}
            </div>
          )}

          {result && (
            <div className="multi-result">

              <div className="multi-result-icon">
                🌍
              </div>

              <p>
                Your message in {language}
              </p>

              <h3>
                {result}
              </h3>

            </div>
          )}

        </div>

        <div className="multi-footer">
          🌿 Mankatha helps you express yourself
          in a language that feels comfortable. 🌿
        </div>

      </div>

    </div>
  );
};

export default Multilingual;
