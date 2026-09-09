import { useState } from "react";
import "./MoodDetection.css";

const MoodDetection = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const detectMood = async () => {
    if (!text.trim()) {
      setError("Please tell us how you are feeling first. 🌼");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setResult(data);
    } catch (error) {
      setError(
        "Could not connect to Mood Detection. Please make sure the AI server is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="mood-page">

      {/* Decorative elements */}

      <div className="mood-sun">
        ☀️
      </div>

      <div className="mood-flower flower-left">
        🌻
      </div>

      <div className="mood-flower flower-right">
        🌼
      </div>

      <div className="mood-butterfly butterfly-left">
        🦋
      </div>

      <div className="mood-butterfly butterfly-right">
        🦋
      </div>


      {/* Main content */}

      <div className="mood-wrapper">

        {/* Header */}

        <div className="mood-header">

          <div className="mood-icon">
            🌤️
          </div>

          <h1>
            How are you feeling today?
          </h1>

          <p>
            Share what's on your mind and let Mankatha
            gently understand your mood.
          </p>

        </div>


        {/* Main card */}

        <div className="mood-card">

          <div className="card-title">

            <span>
              🌷
            </span>

            <div>
              <h2>
                Tell me how you're feeling
              </h2>

              <p>
                There are no right or wrong feelings.
              </p>
            </div>

          </div>


          {/* Text input */}

          <div className="mood-input-wrapper">

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I am feeling..."
              maxLength={500}
            />

            <div className="character-count">
              {text.length}/500
            </div>

          </div>


          {/* Examples */}

          <div className="examples">

            <p className="examples-title">
              🌼 Not sure what to write? Try:
            </p>

            <div className="example-buttons">

              <button
                type="button"
                onClick={() =>
                  setText("I feel happy today")
                }
              >
                I feel happy today
              </button>

              <button
                type="button"
                onClick={() =>
                  setText("I'm feeling a bit stressed")
                }
              >
                I'm a bit stressed
              </button>

              <button
                type="button"
                onClick={() =>
                  setText("I feel sad today")
                }
              >
                I feel sad
              </button>

              <button
                type="button"
                onClick={() =>
                  setText("I'm feeling anxious")
                }
              >
                I feel anxious
              </button>

            </div>

          </div>


          {/* Detect button */}

          <button
            className="detect-button"
            onClick={detectMood}
            disabled={loading}
          >
            {loading
              ? "Understanding your mood..."
              : "Detect My Mood  →"}
          </button>


          {/* Error */}

          {error && (
            <div className="mood-error">
              🌸 {error}
            </div>
          )}


          {/* Result */}

          {result && (
            <div className="mood-result">

              <div className="result-sparkle">
                ✨
              </div>

              <p className="result-label">
                Mankatha detected your mood as
              </p>

              <h2>
                {result.mood}
              </h2>

              <div className="confidence">

                <span>
                  Confidence
                </span>

                <strong>
                  {result.confidence}%
                </strong>

              </div>

              <div className="confidence-bar">

                <div
                  className="confidence-fill"
                  style={{
                    width: `${result.confidence}%`,
                  }}
                ></div>

              </div>

              <p className="result-note">
                Thank you for sharing how you feel. 🌷
              </p>

            </div>
          )}

        </div>


        {/* Bottom message */}

        <div className="mood-bottom-message">

          <span>🌿</span>

          <p>
            It's okay to feel what you feel.
            <br />
            Take things one little step at a time.
          </p>

          <span>🌿</span>

        </div>

      </div>

    </div>
  );
};

export default MoodDetection;
