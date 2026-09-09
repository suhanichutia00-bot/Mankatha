import AIChatbot from "./pages/AIChatbot";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MoodDetection from "./pages/MoodDetection";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

       <Route
        path="/ai-chat"
        element={
        <ProtectedRoute>
        <AIChatbot />
        </ProtectedRoute>
        }
        />

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
        path="/mood-detection"
        element={
        <ProtectedRoute>
        <MoodDetection />
        </ProtectedRoute>
        }
      />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
