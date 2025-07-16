"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Routes } from "@/routes/Routes";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-6 bg-gray-100 p-6 rounded-full">
        <FileQuestion className="h-16 w-16 text-gray-500" />
      </div>

      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>

      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you were looking for. It may have been moved,
        deleted, or perhaps never existed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href={Routes.Home}>Go to Home</Link>
        </Button>

        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
