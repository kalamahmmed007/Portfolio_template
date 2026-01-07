import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Common layout
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
