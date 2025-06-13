'use client';

import React from 'react';
import Dashboard from './dashboard/Dashboard';
import { UserDataProvider } from './dashboard/UserDataProvider';

export default function DashboardPage() {
  return (
    <UserDataProvider> 
      <Dashboard />
    </UserDataProvider>
  );
}