"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Create your account",
    fields: [
      { name: "email", label: "Email address", type: "email" },
      { name: "password", label: "Password", type: "password" },
    ],
  },
  {
    id: 2,
    title: "Tell us about your business",
    fields: [
      { name: "businessName", label: "Business Name", type: "text" },
      { name: "businessType", label: "Business Type", type: "text" },
    ],
  },
  {
    id: 3,
    title: "Set your currency",
    fields: [{ name: "currency", label: "Currency", type: "text" }],
  },
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const currentStep = steps.find((s) => s.id === step);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 animate-[gradient-animation_15s_ease_infinite]" />
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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center text-white">
              {currentStep?.title}
            </h2>
            <form className="mt-8 space-y-6">
              {currentStep?.fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-300"
                  >
                    {field.label}
                  </label>
                  <div className="mt-1">
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      required
                      className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              ))}
            </form>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between">
          {step > 1 && (
            <Button onClick={handlePrev} variant="outline">
              Previous
            </Button>
          )}
          {step < steps.length ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Register
            </Button>
          )}
        </div>
      </motion.div>
      <style jsx global>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
