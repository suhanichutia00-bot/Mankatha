import { useState } from "react";
import "./AIChatbot.css";

const AIChatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessages([
        ...updatedMessages,
        {
          role: "model",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages([
        ...updatedMessages,
        {
          role: "model",
          text: "Sorry, I couldn't connect to Mankatha right now. Please try again. 🌼",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">

      <div className="sun-decoration"></div>

      <div className="chat-wrapper">

        {/* Header */}

        <header className="chat-header">

          <div className="sun-icon">
            ☀️
          </div>

          <h1>Good to see you 🌼</h1>

          <p>
            This is your little space to talk, reflect,
            and let things out.
          </p>

        </header>


        {/* Chat Card */}

        <div className="chat-card">

          {/* Top Bar */}

          <div className="chat-topbar">

            <div className="bot-profile">

              <div className="bot-avatar">
                🌻
              </div>

              <div>
                <div className="bot-name">
                  Mankatha
                </div>

                <div className="bot-status">
                  Your wellness companion
                </div>
              </div>

            </div>

            <div className="online-dot"></div>

          </div>


          {/* Messages */}

          <div className="messages-container">

            {messages.length === 0 && (

              <div className="welcome-message">

                <div className="welcome-flower">
                  🌷
                </div>

                <h2>
                  What's on your mind?
                </h2>

                <p>
                  You can talk about your day,
                  your feelings, stress, worries,
                  or anything you'd like to share.
                </p>

              </div>

            )}


            {messages.map((msg, index) => (

              <div
                key={index}
                className={`message-row ${
                  msg.role === "user"
                    ? "user"
                    : "bot"
                }`}
              >

                <div className="message-bubble">

                  <span className="message-label">
                    {msg.role === "user"
                      ? "You"
                      : "🌻 Mankatha"}
                  </span>

                  {msg.text}

                </div>

              </div>

            ))}


            {loading && (

              <div className="message-row bot">

                <div className="typing-bubble">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}

          </div>


          {/* Input */}

          <div className="input-area">

            <div className="input-wrapper">

              <textarea
                className="chat-input"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Tell Mankatha what's on your mind..."
                rows="2"
              />

              <button
                className="send-button"
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                aria-label="Send message"
              >
                ➤
              </button>

            </div>

            <p className="chat-disclaimer">
              Mankatha is a wellness support tool and
              not a replacement for professional care.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AIChatbot;
