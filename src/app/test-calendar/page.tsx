"use client";

import { useState } from "react";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function TestCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Calendar Test Page</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Calendar Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />

          <div className="pt-4">
            <p>Selected date: {date ? date.toDateString() : "None"}</p>
            <Button onClick={() => setDate(new Date())} className="mt-2">
              Reset to Today
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
