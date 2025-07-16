"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-6 bg-red-50 p-6 rounded-full">
        <AlertTriangle className="h-16 w-16 text-red-500" />
      </div>

      <h1 className="text-4xl font-bold mb-2">Something Went Wrong</h1>

      <p className="text-gray-600 mb-4 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>

      {process.env.NODE_ENV === "development" && error?.message && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md text-left overflow-auto max-w-xl w-full">
          <p className="font-mono text-sm text-red-600">{error.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset}>Try Again</Button>

        <Button asChild variant="outline">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
