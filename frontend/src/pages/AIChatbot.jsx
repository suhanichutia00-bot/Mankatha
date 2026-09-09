import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIChatbot.css";

const AIChatbot = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("English");
  const [started, setStarted] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [mood, setMood] = useState(null);
  const [risk, setRisk] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startChat = () => {
    setStarted(true);
  };

  const detectMood = async (text) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Mood detection failed.");
      }

      return data;

    } catch (error) {
      console.error("Mood detection error:", error);

      return null;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessage("");
    setError("");
    setLoading(true);

    const userChatMessage = {
      role: "user",
      text: userMessage,
    };

    const updatedMessages = [
      ...messages,
      userChatMessage,
    ];

    setMessages(updatedMessages);

    try {
      // -----------------------------
      // STEP 1: MOOD DETECTION
      // -----------------------------

      const moodResult = await detectMood(userMessage);

      let detectedMood = null;

      if (moodResult) {
        detectedMood = moodResult.mood;

        setMood(moodResult);
      }

      // -----------------------------
      // STEP 2:
      // SEND MESSAGE + MOOD TO GEMINI
      // -----------------------------

      const history = updatedMessages
        .slice(-10)
        .map((item) => ({
          role: item.role,
          text: item.text,
        }));

      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
            history,
            mood: detectedMood,
            language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to generate AI response."
        );
      }

      // -----------------------------
      // STEP 3:
      // SAVE RISK RESULT
      // -----------------------------

      setRisk({
        riskLevel: data.riskLevel,
        reason: data.reason,
        recommendedAction:
          data.recommendedAction,
      });

      // -----------------------------
      // STEP 4:
      // SHOW MANKATHA RESPONSE
      // -----------------------------

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.response,
        },
      ]);

    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = () => {
    if (!risk) return "";

    if (risk.riskLevel === "HIGH") {
      return "risk-high";
    }

    if (risk.riskLevel === "MODERATE") {
      return "risk-moderate";
    }

    return "risk-low";
  };

  if (!started) {
    return (
      <div className="chat-container">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Back
        </button>

        <div className="language-card">

          <div className="chat-icon">
            🌻
          </div>

          <h1>Talk to Mankatha</h1>

          <p>
            Choose the language you feel most
            comfortable using.
          </p>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >
            <option value="English">
              🇬🇧 English
            </option>

            <option value="Hindi">
              🇮🇳 हिंदी
            </option>

            <option value="Assamese">
              অসমীয়া Assamese
            </option>

            <option value="Bengali">
              বাংলা Bengali
            </option>
          </select>

          <button
            className="start-chat-button"
            onClick={startChat}
          >
            Start Chat 🌻
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">

      <div className="chat-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Home
        </button>

        <div>
          <h1>🌻 Mankatha</h1>

          <p>
            Language: <strong>{language}</strong>
          </p>
        </div>

      </div>

      <div className="chat-body">

        {messages.length === 0 && (
          <div className="welcome-message">

            <div className="chat-icon">
              🌻
            </div>

            <h2>
              Hi! I'm Mankatha 💛
            </h2>

            <p>
              You can talk to me about your
              thoughts, feelings, worries,
              or simply your day.
            </p>

          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "message user-message"
                : "message ai-message"
            }
          >

            <div className="message-label">
              {msg.role === "user"
                ? "You"
                : "🌻 Mankatha"}
            </div>

            <div className="message-text">
              {msg.text}
            </div>

          </div>
        ))}

        {loading && (
          <div className="message ai-message">

            <div className="message-label">
              🌻 Mankatha
            </div>

            <div className="message-text">
              Understanding what you shared... 🌼
            </div>

          </div>
        )}

      </div>

      {(mood || risk) && (
        <div className="analysis-card">

          <h3>
            🌼 Your Emotional Check-in
          </h3>

          {mood && (
            <p>
              🌤️ Detected Mood:
              <strong>
                {" "}
                {mood.mood}
              </strong>

              {mood.confidence && (
                <>
                  {" "}
                  ({mood.confidence}%)
                </>
              )}
            </p>
          )}

          {risk && (
            <div className={getRiskClass()}>

              <p>
                🛡️ Risk Level:
                <strong>
                  {" "}
                  {risk.riskLevel}
                </strong>
              </p>

              {risk.riskLevel === "HIGH" && (
                <p className="emergency-message">
                  🚨 Please contact a trusted
                  person or local emergency
                  service immediately if you
                  are in immediate danger.
                </p>
              )}

            </div>
          )}

        </div>
      )}

      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}

      <form
        className="chat-input-area"
        onSubmit={sendMessage}
      >

        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Tell me how you're feeling..."
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "..." : "Send 🌻"}
        </button>

      </form>

    </div>
  );
};

export default AIChatbot;
