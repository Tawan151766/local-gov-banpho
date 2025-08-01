'use client';

import { App } from 'antd';
import WaterSupportRequestsManagement from '../components/WaterSupportRequestsManagement';

export default function WaterSupportRequestsPage() {
  return (
    <App>
      <div className="min-h-screen bg-gray-50">
        <WaterSupportRequestsManagement />
      </div>
    </App>
  );
}