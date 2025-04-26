"use client";

import { useState } from "react";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";

export default function TestPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Calendar Test Page</h1>

      <div className="max-w-sm mx-auto border p-4 rounded">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />

        <div className="pt-4 text-center">
          <p>Selected date: {date ? date.toDateString() : "None"}</p>
          <Button onClick={() => setDate(new Date())} className="mt-2">
            Reset to Today
          </Button>
        </div>
      </div>
    </div>
  );
}
