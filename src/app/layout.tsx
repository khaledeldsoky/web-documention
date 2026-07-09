import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Technical Guides — Documentation Hub",
  description: "Practical, step-by-step technical guides",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
