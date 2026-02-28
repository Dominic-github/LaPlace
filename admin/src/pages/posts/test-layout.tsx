import React from 'react';
import { PostEditorLayout } from '../../components/posts';
import { Card } from 'antd';

/**
 * Test page để verify WordPress-style layout
 * URL: http://localhost:4002/posts/test-layout
 */
export const PostTestLayout = () => {
  const mainContent = (
    <Card title="Main Content (Bên trái)" style={{ background: '#e3f2fd' }}>
      <h1 style={{ fontSize: 32, color: '#1976d2' }}>✅ Layout 2 cột đã hoạt động!</h1>
      <p style={{ fontSize: 18 }}>Nếu bạn thấy text này ở bên TRÁI và sidebar ở bên PHẢI, layout đã OK!</p>
      <p>Đây là main content area (70% width trên desktop)</p>
    </Card>
  );

  const sidebar = (
    <Card title="Sidebar (Bên phải)" style={{ background: '#fff3e0', marginBottom: 16 }}>
      <h2 style={{ fontSize: 24, color: '#f57c00' }}>✅ Sidebar</h2>
      <p>Đây là sidebar (30% width)</p>
      <p>Nó sẽ sticky khi scroll</p>
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Test WordPress-Style Layout</h1>
      <PostEditorLayout
        mainContent={mainContent}
        sidebar={sidebar}
      />
    </div>
  );
};

