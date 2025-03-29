"use client";

import Header from "@/components/common/Header";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, createContext, useMemo } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="main-content">{children}</div>;
}
