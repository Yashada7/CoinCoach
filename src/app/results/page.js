'use client';
import ResultsComponent from "../components/Results";
import { UserDataProvider } from '../components/dashboard/UserDataProvider';
import { Suspense } from "react";

export default function ResultsPage() {
  return (
    <UserDataProvider>
      <Suspense fallback={<div>Loading results...</div>}>
        <ResultsComponent />
      </Suspense>
    </UserDataProvider>
  );
}
