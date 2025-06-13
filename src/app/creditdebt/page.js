"use client";

import { Suspense } from "react";
import CreditDebtModule from "../components/CreditDebtModule";

export default function CreditDebtPage() {
  return (
    <Suspense fallback={<div>Loading module...</div>}>
      <CreditDebtModule />
    </Suspense>
  );
}
