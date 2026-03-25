"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" />
      </motion.div>
      <motion.div
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="M18.7 8.3a2.4 2.4 0 0 0-3.4 0" />
            <path d="M15.3 11.7a2.4 2.4 0 0 0-3.4 0" />
            <path d="M11.9 15.1a2.4 2.4 0 0 0-3.4 0" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-center text-white">RetailOS</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="admin@example.com"
                className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="password"
                className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-xs text-center text-gray-500">
          Demo: admin@example.com / password
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

