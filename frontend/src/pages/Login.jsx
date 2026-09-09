import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Decorative background */}

      <div className="soft-sun"></div>

      <div className="floating-flower flower-one">
        🌻
      </div>

      <div className="floating-flower flower-two">
        🌻
      </div>

      <div className="floating-flower flower-three">
        🌼
      </div>

      <div className="floating-butterfly butterfly-one">
        🦋
      </div>

      <div className="floating-butterfly butterfly-two">
        🦋
      </div>


      {/* Left decorative message */}

      <div className="auth-side-message left-message">

        <div className="handwriting">
          Better days
          <br />
          are ahead
        </div>

        <div className="tiny-heart">
          ♡
        </div>

      </div>


      {/* Main Login Card */}

      <div className="auth-card">

        {/* Logo */}

        <div className="auth-logo">

          <div className="mini-sun">
            ☼
          </div>

          <h1>Mankatha</h1>

          <p>
            Your little wellness companion
          </p>

        </div>


        {/* Heading */}

        <div className="auth-heading">

          <h2>
            Welcome Back! 🌻
          </h2>

          <p>
            Log in to continue your journey
          </p>

        </div>


        {/* Error */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* Login Form */}

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <span className="input-icon">
              ✉
            </span>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="input-group">

            <span className="input-icon">
              🔒
            </span>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In  →"}
          </button>

        </form>


        {/* Signup */}

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Create Account
          </Link>

        </div>


        {/* Small decorative quote */}

        <div className="auth-bottom-note">
          <span>✦</span>
          Take it one day at a time
          <span>✦</span>
        </div>

      </div>


      {/* Right sunflower decoration */}

      <div className="auth-sunflower-garden">

        <div className="garden-flower big">
          🌻
        </div>

        <div className="garden-flower medium">
          🌻
        </div>

        <div className="garden-flower small">
          🌼
        </div>

        <div className="garden-leaves">
          🌿
        </div>

      </div>

    </div>
  );
};

export default Login;
