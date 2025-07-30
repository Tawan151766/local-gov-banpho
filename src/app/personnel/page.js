import { Suspense } from 'react';
import PersonnelOrgChart from '../component/Personnel/PersonnelOrgChart';

function PersonnelOrgChartWithSuspense() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>}>
      <PersonnelOrgChart />
    </Suspense>
  );
}

export default function PersonnelPage() {
  return <PersonnelOrgChartWithSuspense />;
}