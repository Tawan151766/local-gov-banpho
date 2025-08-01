'use client';

import { App } from 'antd';
import WasteCollectionRequestsManagement from '../components/WasteCollectionRequestsManagement';

export default function WasteCollectionRequestsPage() {
  return (
    <App>
      <div className="min-h-screen bg-gray-50">
        <WasteCollectionRequestsManagement />
      </div>
    </App>
  );
}