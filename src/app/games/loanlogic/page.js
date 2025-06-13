"use client";
import React, { Suspense } from "react";
import LoanLogic from "@/app/components/loanLogic";

export const dynamic = "force-dynamic";

export default function LoanLogicPage() {
  return (
    <Suspense fallback={<div>Loading Loan Logic Game...</div>}>
      <LoanLogic />
    </Suspense>
  );
}
