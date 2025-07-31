"use client";
import { usePathname } from "next/navigation";
import PublicLayout from "./PublicLayout";
import AdminAccess from "../app/component/AdminAccess/AdminAccess";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return (
      <>
        {children}
        <AdminAccess />
      </>
    );
  }
  
  return (
    <PublicLayout>
      {children}
      <AdminAccess />
    </PublicLayout>
  );
}