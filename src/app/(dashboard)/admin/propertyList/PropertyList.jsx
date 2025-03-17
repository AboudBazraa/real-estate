"use client";
import { DataTableDemo } from "../../components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import AllProperties from "./AllProperties";

export default function PropertyList({ properties }) {
  return (
    <Tabs defaultValue="List" className="space-y-4">
      <TabsList className="w-48">
        <TabsTrigger value="List" className="w-full">
          List
        </TabsTrigger>
        <TabsTrigger value="View" className="w-full">
          View
        </TabsTrigger>
      </TabsList>
      <TabsContent value="List" className="space-y-4">
        <DataTableDemo data={properties} />
      </TabsContent>
      <TabsContent value="View" className="space-y-4">
        <AllProperties data={properties} />
      </TabsContent>
    </Tabs>
  );
}
