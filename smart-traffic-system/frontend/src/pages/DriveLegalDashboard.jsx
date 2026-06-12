import React, { useState } from 'react';
import { AppProvider } from '@/providers/AppProvider';

// Import all pages natively
import OverviewPage from '@/app/page.tsx';
import AssistantPage from '@/app/assistant/page.tsx';
import ChallanCalculatorPage from '@/app/calculator/page.tsx';
import LawsDatabasePage from '@/app/laws/page.tsx';
import AnalyticsPage from '@/app/analytics/page.tsx';
import AlertsPage from '@/app/alerts/page.tsx';
import GeoZonesPage from '@/app/geo-zones/page.tsx';
import DocumentsPage from '@/app/documents/page.tsx';
import PolicePortalPage from '@/app/police-portal/page.tsx';
import SyncPage from '@/app/sync/page.tsx';
import SettingsPage from '@/app/settings/page.tsx';

export default function DriveLegalDashboard({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState('/');

  const handleNavigate = (path) => {
    setCurrentPage(path);
  };

  const renderContent = () => {
    switch (currentPage) {
      case '/':
        return <OverviewPage onNavigate={handleNavigate} />;
      case '/assistant':
        return <AssistantPage />;
      case '/calculator':
        return <ChallanCalculatorPage />;
      case '/laws':
        return <LawsDatabasePage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/alerts':
        return <AlertsPage />;
      case '/geo-zones':
        return <GeoZonesPage />;
      case '/documents':
        return <DocumentsPage />;
      case '/police-portal':
        return <PolicePortalPage />;
      case '/sync':
        return <SyncPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppProvider 
      currentPath={currentPage} 
      onNavigate={handleNavigate} 
      onLogout={onLogout}
    >
      {renderContent()}
    </AppProvider>
  );
}
