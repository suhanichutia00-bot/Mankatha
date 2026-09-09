import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="home-container">

      <h1>Welcome to Mankatha 👋</h1>

      {user && <h2>Hello, {user.name}! 🌼</h2>}

      <p>
        Your little space for emotional wellness and self-reflection.
      </p>

      <div className="home-options">

        {/* Mood Detection */}

        <div className="home-card">

          <div className="home-card-icon">
            🌤️
          </div>

          <h3>Mood Detection</h3>

          <p>
            Express how you're feeling and let Mankatha
            understand your current mood.
          </p>

          <button
            onClick={() => navigate("/mood-detection")}
          >
            Detect My Mood →
          </button>

        </div>


        {/* AI Chatbot */}

        <div className="home-card chatbot-card">

          <div className="home-card-icon">
            🌻
          </div>

          <h3>AI Chatbot</h3>

          <p>
            Talk to Mankatha about your thoughts,
            feelings, worries, or simply your day.
          </p>

          <button
            onClick={() => navigate("/ai-chat")}
          >
            Talk to Mankatha →
          </button>

        </div>
       <div className="home-card">
  <div className="home-card-icon">🛡️</div>

  <h3>Risk Detection</h3>

  <p>
    Check in with Mankatha and identify when you may need
    additional emotional support.
  </p>

  <button onClick={() => navigate("/risk-detection")}>
    Check My Wellbeing →
  </button>
</div>

     <div className="home-card">

          <div className="home-card-icon">
            🌍
          </div>

          <h3>Multilingual Support</h3>

          <p>
            Express your thoughts in the language
            you feel most comfortable with.
          </p>

          <button
            onClick={() => navigate("/multilingual")}
          >
            Choose Language →
          </button>

        </div>

      </div>


      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
};

export default Home;
