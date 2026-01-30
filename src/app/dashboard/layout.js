// src/app/dashboard/layout.js
'use client';

import React from 'react';
import { AuthProvider } from '../components/auth/AuthContext';
import UserDataProvider from '../components/dashboard/UserDataProvider';

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <UserDataProvider>
        {children}
      </UserDataProvider>
    </AuthProvider>
  );
}