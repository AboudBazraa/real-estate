"use client";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
// import { useApiMutatio } from "@/shared/hooks/useApi";

export default function AddPropertyForm() {
//   const agentAddProperty = useApiMutatio({
//     url: "/Agent/Create",
//     method: "POST",
//   });

  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    price: 0,
    type: 0,
    location: "",
    latitude: 0,
    longitude: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProperty = async () => {
    await agentAddProperty.mutateAsync({
      userId: "a63aca26-7989-4196-8859-d2fd18cb0d44", // Replace with actual user ID
      fullName: "string", // Replace with actual full name
      phone: "string", // Replace with actual phone
      email: "string", // Replace with actual email
      properties: [newProperty],
    });
    // Optionally reset the form or handle success
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold">Add Property</h2>
      {Object.keys(newProperty).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          onChange={handleInputChange}
          type={typeof newProperty[key] === "number" ? "number" : "text"}
        />
      ))}
      <Button onClick={handleAddProperty}>Add Property</Button>
    </div>
  );
}
