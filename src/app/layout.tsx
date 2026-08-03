import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Piece of Science",
  description: "Practical, step-by-step technical guides",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
