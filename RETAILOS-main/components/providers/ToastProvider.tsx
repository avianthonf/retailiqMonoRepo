"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(23, 23, 23, 0.8)",
            color: "#fff",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          },
          duration: 4000,
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {children}
    </>
  );
}
