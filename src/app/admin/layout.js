import { ConfigProvider, App } from 'antd';
import thTH from 'antd/locale/th_TH';

export const metadata = {
  title: 'Admin Panel - องค์การบริหารเทศบาลบ้านโพธิ์',
  description: 'ระบบจัดการสำหรับเว็บไซต์องค์การบริหารเทศบาลบ้านโพธิ์',
};

export default function AdminLayout({ children }) {
  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}