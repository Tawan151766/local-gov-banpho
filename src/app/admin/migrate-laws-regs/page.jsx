'use client';

import { useState } from 'react';
import { Card, Button, Typography, Space, Alert, Divider } from 'antd';
import { DatabaseOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function MigrateLawsRegsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tableStructure, setTableStructure] = useState(null);

  const checkTableStructure = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/laws-regs/migrate-columns', {
        method: 'GET'
      });
      const data = await response.json();
      setTableStructure(data);
    } catch (error) {
      console.error('Error checking table structure:', error);
      setTableStructure({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/laws-regs/migrate-columns', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
      
      // Refresh table structure after migration
      if (data.success) {
        await checkTableStructure();
      }
    } catch (error) {
      console.error('Error running migration:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <DatabaseOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2}>Laws & Regulations Database Migration</Title>
            <Paragraph type="secondary">
              This tool will add missing columns to the laws_regs_files table to support the new file upload features.
            </Paragraph>
          </div>

          <Divider />

          <div>
            <Title level={4}>Required Columns:</Title>
            <ul>
              <li><Text code>original_name</Text> - VARCHAR(255) NULL - Store original filename</li>
              <li><Text code>file_size</Text> - BIGINT NULL - Store file size in bytes</li>
              <li><Text code>description</Text> - TEXT NULL - Store file description</li>
            </ul>
          </div>

          <Space>
            <Button 
              type="default" 
              icon={<DatabaseOutlined />}
              onClick={checkTableStructure}
              loading={loading}
            >
              Check Current Table Structure
            </Button>
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={runMigration}
              loading={loading}
            >
              Run Migration
            </Button>
          </Space>

          {tableStructure && (
            <Card title="Current Table Structure" size="small">
              {tableStructure.success ? (
                <div>
                  <Text strong>Table: {tableStructure.tableName}</Text>
                  <div style={{ marginTop: '8px' }}>
                    {tableStructure.columns.map((col, index) => (
                      <div key={index} style={{ marginBottom: '4px' }}>
                        <Text code>{col.COLUMN_NAME}</Text> - {col.DATA_TYPE} 
                        {col.IS_NULLABLE === 'YES' ? ' NULL' : ' NOT NULL'}
                        {col.COLUMN_DEFAULT && ` DEFAULT ${col.COLUMN_DEFAULT}`}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert 
                  type="error" 
                  message="Error checking table structure" 
                  description={tableStructure.error}
                />
              )}
            </Card>
          )}

          {result && (
            <Alert
              type={result.success ? 'success' : 'error'}
              message={result.success ? 'Migration Successful' : 'Migration Failed'}
              description={
                <div>
                  <p>{result.message}</p>
                  {result.addedColumns && result.addedColumns.length > 0 && (
                    <div>
                      <Text strong>Added columns:</Text>
                      <ul>
                        {result.addedColumns.map((col, index) => (
                          <li key={index}><Text code>{col}</Text></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.error && <Text type="danger">{result.error}</Text>}
                  {result.details && <Text type="secondary">{result.details}</Text>}
                </div>
              }
              showIcon
            />
          )}

          <Alert
            type="info"
            message="Instructions"
            description={
              <div>
                <p>1. First, click "Check Current Table Structure" to see the current columns</p>
                <p>2. Then click "Run Migration" to add the missing columns</p>
                <p>3. After successful migration, you can use the file upload feature in Laws & Regulations management</p>
              </div>
            }
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
}