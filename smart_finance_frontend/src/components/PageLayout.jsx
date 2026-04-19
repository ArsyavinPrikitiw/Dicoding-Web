import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function PageLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
