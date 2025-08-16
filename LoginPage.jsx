import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google!");
      // Add redirect logic here if needed
    } catch (error) {
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center w-full h-full">
        <div className="bg-white/90 dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-md w-full mt-8">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
            WorkVault Login
          </h1>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center w-full py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition"
          >
            {/* Google Logo SVG */}
            <svg
              className="w-6 h-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
            >
              <g>
                <path fill="#4285F4" d="M24 9.5c3.6 0 6.8 1.2 9 3.3l6.7-6.7C35.4 2.1 30.2 0 24 0 14.8 0 6.8 5.6 2.8 13.4l7.8 6C12.4 13 17.7 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.1 24.6c0-1.8-.2-3.2-.5-4.6h-21v8.8h12.5c-.2 1.3-1.4 3.2-3.8 4.6l6 4.7c3.5-3.2 5.8-8 5.8-13.5z" />
                <path fill="#FBBC05" d="M10.6 28.3c-1-2.9-1-6 0-8.9l-7.8-6C1.5 17.5 0 20.6 0 24s1.5 6.5 2.8 9.7l7.8-6z" />
                <path fill="#EA4335" d="M24 48c6.2 0 11.4-2 15.1-5.5l-7.3-5.7c-2 1.5-4.8 2.5-7.8 2.5-6.1 0-11.3-4.1-13.1-9.7l-7.8 6C6.8 42.4 14.8 48 24 48z" />
              </g>
            </svg>
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
        <footer className="w-full pt-6 pb-2 flex justify-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} WorkVault. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default LoginPage;






