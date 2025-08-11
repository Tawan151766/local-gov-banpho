"use client";

import { useSystemInfoValues } from "@/hooks/useSystemInfo";

const TEST_KEYS = ['phone', 'email', 'organization_name'];

export default function TestSystemInfo() {
  const { values, loading } = useSystemInfoValues(TEST_KEYS);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test System Info</h1>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      
      <h2>Values:</h2>
      <ul>
        <li>Phone: {values.phone}</li>
        <li>Email: {values.email}</li>
        <li>Organization: {values.organization_name}</li>
      </ul>
      
      <h2>Raw Data:</h2>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
}