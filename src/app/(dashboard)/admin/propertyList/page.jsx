"use client";
import AddPropertyForm from "./AddPropertyForm";
import PropertyList from "./PropertyList";
import { useApiQuery } from "@/shared/hooks/useApi";

export default function PropertyListPage() {
  const { data, isLoading } = useApiQuery(["properties"], {
    url: "/Properties/GetAll",
  });
  const properties = data?.data || [];
  console.log(properties);  

  return (
    <div className="flex flex-col gap-4">
      {/* <AddPropertyForm /> */}
      <PropertyList properties={properties} />
    </div>
  );
}
