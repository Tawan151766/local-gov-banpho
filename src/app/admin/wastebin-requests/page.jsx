'use client';

import { App } from 'antd';
import WastebinRequestsManagement from '../components/WastebinRequestsManagement';

export default function WastebinRequestsPage() {
  return (
    <App>
      <div className="min-h-screen bg-gray-50">
        <WastebinRequestsManagement />
      </div>
    </App>
  );
}