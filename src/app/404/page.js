"use client";

import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">Sorry, we couldn’t find what you were looking for.</p>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading 404...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
