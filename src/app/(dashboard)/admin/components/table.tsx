"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";

const invoices = [
  {
    name: "INV001",
    type: "Paid",
    amount: "$250.00",
    agent: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    amount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    amount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    amount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    amount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    amount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    amount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const ITEMS_PER_PAGE = 7;

export function TableDemo() {
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < invoices.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  // Calculate total amount for the current page
  const totalAmount = currentInvoices.reduce(
    (acc, invoice) => acc + parseFloat(invoice.amount.replace("$", "")),
    0
  );

  return (
    <>
      <div>
        <p className="italic text-gray-700">last input get in</p>
        <Table className="rounded-lg overflow-hidden">
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentInvoices.map((invoice, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{invoice.name}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>{invoice.agent}</TableCell>
                <TableCell className="text-right">
                  ${parseFloat(invoice.amount.replace("$", "")).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                ${totalAmount.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {/* 
        <div className="flex justify-between mt-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= invoices.length}
          >
            Next
          </Button>
        </div> */}
      </div>
    </>
  );
}
