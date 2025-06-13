// app/404/page.jsx
"use client";

import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

function NotFoundContent() {
  return (
    <div className="text-center mt-32">
      <h1 className="text-5xl font-bold text-purple-800">404</h1>
      <p className="mt-4 text-gray-600 text-lg">This page does not exist.</p>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading 404 page...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
