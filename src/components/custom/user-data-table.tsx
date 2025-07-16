"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define the data type for our table entries
interface DataEntry {
  id: string;
  userId: string;
  email: string;
  createdAt: Date;
}

interface DataTableProps {
  data: DataEntry[];
}

export default function DataTable({ data = [] }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof DataEntry>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  // Filter data based on search term
  const filteredData = data.filter(
    (entry) =>
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data based on sort field and direction
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Handle sort toggle
  const handleSort = (field: keyof DataEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

  const onViewDetails = (id: string) => {
    router.push(`/t/user-list/${id}`);
  };

  return (
    <div className="space-y-4 max-w-5xl ml-8">
      {/* Search and page size controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[33%] text-black font-medium">
                <Button
                  variant="ghost"
                  className="p-0 font-medium text-black flex items-center"
                  onClick={() => handleSort("email")}
                >
                  User
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[33%] text-black font-medium">
                <Button
                  variant="ghost"
                  className="p-0 font-medium text-black flex items-center"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[34%] text-center text-black font-medium">
                <span>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="w-[33%]">
                    <div className="text-sm text-gray-700">{entry.email}</div>
                    <div className="text-xs text-gray-600">
                      ID: {entry.userId}
                    </div>
                  </TableCell>
                  <TableCell className="w-[33%]">
                    {formatDate(entry.createdAt)}
                  </TableCell>
                  <TableCell className="w-[34%] text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(entry.id)}
                      className="hover:bg-pink-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {paginatedData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + pageSize, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
