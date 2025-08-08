"use client";

import { App } from "antd";
import AdminNavigation from "../components/AdminNavigation";
import PeopleManagement from "../components/PeopleManagement";

export default function PeopleManagementPage() {
  return (
    <App>
      <AdminNavigation>
        <PeopleManagement />
      </AdminNavigation>
    </App>
  );
}