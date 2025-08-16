// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./components/LoginPage";
import AddLogForm from "./components/AddLogForm";
import LogList from "./components/LogList";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Dark mode toggle example (optional)
 const [isDarkMode, setIsDarkMode] = useState(false);
const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Centered loading screen
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-300 bg-gradient-to-tr from-blue-900 via-indigo-600 to-pink-400 dark:bg-gray-900 transition-colors duration-500">
        Loading...
      </div>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div
      className={`min-h-screen min-w-full relative overflow-x-hidden select-none transition-colors duration-500 ${
        isDarkMode ? "dark" : "light"
      }`}
    >
      {/* Animated background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-pink-300 opacity-30 rounded-full mix-blend-multiply animate-pulse-slow pointer-events-none z-0"></div>
      <div className="absolute bottom-[-80px] right-[-120px] w-[300px] h-[300px] bg-blue-300 opacity-25 rounded-full mix-blend-multiply animate-pulse pointer-events-none z-0"></div>

      <Router>
        {user && (
          <nav
            className="relative z-10 bg-white/60 backdrop-blur-xl shadow-xl border border-white/30
                rounded-2xl mx-auto mt-8 mb-10 px-6 py-5 flex items-center justify-between max-w-4xl
                ring-4 ring-pink-200/20 hover:ring-blue-400/30 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:ring-purple-800"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  user.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.displayName || "User"
                  )}`
                }
                alt={user.displayName}
                className="h-11 w-11 rounded-full border-2 border-gradient-to-r from-pink-400 to-blue-500 shadow-md"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=User&background=gray&color=fff";
                }}
              />
              <span className="text-xl font-extrabold text-gray-800 drop-shadow dark:text-white">
                Welcome,{" "}
                <span className="text-blue-600 underline decoration-pink-400 dark:text-pink-400">
                  {user.displayName || "User"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/add-log"
                className="bg-gradient-to-r from-blue-500 to-pink-400 text-white px-4 py-2 rounded-md font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-150 border border-white/40"
              >
                Add Work Log
              </Link>
              <Link
                to="/logs"
                className="bg-gradient-to-r from-indigo-400 to-pink-500 text-white px-4 py-2 rounded-md font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-150 border border-white/40"
              >
                View Logs
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                aria-disabled={loggingOut}
                className="flex items-center px-5 py-2 bg-red-500 hover:bg-red-700 text-white rounded-full font-semibold shadow transition-all
                 duration-150 disabled:opacity-40 disabled:cursor-not-allowed border border-white/40"
              >
                {loggingOut && (
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-20"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-60"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                )}
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
              {/* Dark mode toggle button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                aria-label="Toggle dark mode"
                className="ml-3 px-2 py-2 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-yellow-300 hover:bg-yellow-400 transition"
                title="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m8.66-10.34l-.7.7m-15.9 0l-.7-.7M21 12h-1M4 12H3m16.66 4.66l-.7-.7m-15.9 0l-.7.7M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c.132 0 .263.002.393.007a9 9 0 11-1.277 17.473c-.328-.029-.652-.076-.97-.138a9 9 0 01.874-17.342c.202-.031.406-.05.58-.05z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </nav>
        )}

        <main className="max-w-4xl mx-auto px-4 pb-12 relative z-10">
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/add-log" replace />}
            />

            {/* Protected Routes */}
            <Route
              path="/add-log"
              element={user ? <AddLogForm /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/logs"
              element={user ? <LogList /> : <Navigate to="/login" replace />}
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/add-log" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>

      {/* Toast for user feedback (success, error) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;






