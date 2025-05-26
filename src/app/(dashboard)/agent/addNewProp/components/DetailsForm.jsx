import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function DetailsForm({ data, onChange }) {
  const { currentLanguage, isRTL } = useTranslation();

  // Translations
  const translations = {
    en: {
      propertyDetails: "Property Details",
      propertyDetailsDescription:
        "Enter the specific details about the property features.",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Area (sqft)",
      lotSize: "Lot Size (sqft)",
      additionalFeatures:
        "You can add more property features like parking spaces, garage size, appliances, and other amenities in the property description.",
    },
    ar: {
      propertyDetails: "تفاصيل العقار",
      propertyDetailsDescription: "أدخل التفاصيل المحددة حول ميزات العقار.",
      bedrooms: "غرف النوم",
      bathrooms: "الحمامات",
      area: "المساحة (قدم مربع)",
      lotSize: "مساحة الأرض (قدم مربع)",
      additionalFeatures:
        "يمكنك إضافة المزيد من ميزات العقار مثل أماكن وقوف السيارات، وحجم المرآب، والأجهزة، والمرافق الأخرى في وصف العقار.",
    },
  };

  const t = translations[currentLanguage === "ar" ? "ar" : "en"];

  const handleChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value);
  };

  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value === "" ? 0 : Number(value));
  };

  return (
    <Card className={isRTL ? "rtl" : ""}>
      <CardHeader>
        <CardTitle>{t.propertyDetails}</CardTitle>
        <CardDescription>{t.propertyDetailsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="bedrooms">{t.bedrooms}</Label>
            <Input
              id="bedrooms"
              type="number"
              value={data.bedrooms || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">{t.bathrooms}</Label>
            <Input
              id="bathrooms"
              type="number"
              value={data.bathrooms || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="area">{t.area}</Label>
            <Input
              id="area"
              type="number"
              value={data.area || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="lot_size">{t.lotSize}</Label>
            <Input
              id="lot_size"
              type="number"
              value={data.lot_size || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
        </div>

        {/* Additional property features could be added here */}
        <div className="p-4 bg-gray-50 rounded-md dark:bg-gray-900">
          <p className="text-sm text-muted-foreground">
            {t.additionalFeatures}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
