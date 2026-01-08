// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./components/admin/Dashboard";
import ProjectList from "./components/admin/ProjectList";
import SkillForm from "./components/admin/SkillForm";
import MessageList from "./components/admin/MessageList";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Nested Routes */}
              <Route path="/admin/*" element={<Admin />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<ProjectList />} />
                <Route path="skills" element={<SkillForm />} />
                <Route path="messages" element={<MessageList />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
