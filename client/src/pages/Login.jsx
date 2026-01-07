import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-10 bg-white shadow-xl rounded-2xl ring-1 ring-gray-200">
        <h2 className="mb-2 text-4xl font-extrabold text-center text-gray-800">
          Admin Login
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Enter your credentials to access the admin panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="absolute px-1 text-sm font-medium text-gray-500 bg-white -top-3 left-3">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="absolute px-1 text-sm font-medium text-gray-500 bg-white -top-3 left-3">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Login
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          &copy; {new Date().getFullYear()} Kalam Ahmmed. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
