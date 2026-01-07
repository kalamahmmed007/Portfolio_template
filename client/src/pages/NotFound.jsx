import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="mb-4 font-extrabold text-red-500 text-9xl">404</h1>
      <h2 className="mb-2 text-3xl font-bold text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="max-w-md mb-6 text-center text-gray-600">
        The page you are looking for doesn’t exist or has been moved. Try going back to the homepage.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
