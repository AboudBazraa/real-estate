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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function BasicInfoForm({ data, onChange, onTypeChange }) {
  const { currentLanguage, isRTL } = useTranslation();

  // Translations
  const translations = {
    en: {
      basicInfo: "Basic Information",
      basicDescription: "Enter the basic details about the property.",
      propertyTitle: "Property Title",
      propertyTitlePlaceholder: "Enter property title",
      propertyType: "Property Type",
      selectType: "Select type",
      apartment: "Apartment",
      house: "House",
      villa: "Villa",
      land: "Land",
      commercial: "Commercial",
      other: "Other",
      price: "Price",
      pricePlaceholder: "Enter price",
      listingType: "Listing Type",
      selectListingType: "Select listing type",
      forSale: "For Sale",
      forRent: "For Rent",
      status: "Status",
      selectStatus: "Select status",
      active: "Active",
      pending: "Pending",
      sold: "Sold",
      rented: "Rented",
      inactive: "Inactive",
      yearBuilt: "Year Built",
      yearBuiltPlaceholder: "Year built",
      description: "Description",
      descriptionPlaceholder: "Enter property description",
      featuredProperty: "Featured Property",
    },
    ar: {
      basicInfo: "معلومات أساسية",
      basicDescription: "أدخل التفاصيل الأساسية عن العقار.",
      propertyTitle: "عنوان العقار",
      propertyTitlePlaceholder: "أدخل عنوان العقار",
      propertyType: "نوع العقار",
      selectType: "اختر النوع",
      apartment: "شقة",
      house: "منزل",
      villa: "فيلا",
      land: "أرض",
      commercial: "تجاري",
      other: "أخرى",
      price: "السعر",
      pricePlaceholder: "أدخل السعر",
      listingType: "نوع القائمة",
      selectListingType: "اختر نوع القائمة",
      forSale: "للبيع",
      forRent: "للإيجار",
      status: "الحالة",
      selectStatus: "اختر الحالة",
      active: "نشط",
      pending: "قيد الانتظار",
      sold: "تم البيع",
      rented: "مؤجر",
      inactive: "غير نشط",
      yearBuilt: "سنة البناء",
      yearBuiltPlaceholder: "سنة البناء",
      description: "الوصف",
      descriptionPlaceholder: "أدخل وصف العقار",
      featuredProperty: "عقار مميز",
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

  const handleFeaturedChange = (checked) => {
    onChange("featured", checked);
  };

  const handleListingTypeChange = (value) => {
    onChange("listing_type", value);
  };

  const handleStatusChange = (value) => {
    onChange("status", value);
  };

  return (
    <Card className={isRTL ? "rtl" : ""}>
      <CardHeader>
        <CardTitle>{t.basicInfo}</CardTitle>
        <CardDescription>{t.basicDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">{t.propertyTitle}</Label>
            <Input
              id="title"
              type="text"
              value={data.title}
              placeholder={t.propertyTitlePlaceholder}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="property_type">{t.propertyType}</Label>
            <Select
              value={data.property_type.toString()}
              onValueChange={onTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="APARTMENT" value="APARTMENT">
                  {t.apartment}
                </SelectItem>
                <SelectItem key="HOUSE" value="HOUSE">
                  {t.house}
                </SelectItem>
                <SelectItem key="VILLA" value="VILLA">
                  {t.villa}
                </SelectItem>
                <SelectItem key="LAND" value="LAND">
                  {t.land}
                </SelectItem>
                <SelectItem key="COMMERCIAL" value="COMMERCIAL">
                  {t.commercial}
                </SelectItem>
                <SelectItem key="OTHER" value="OTHER">
                  {t.other}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">{t.price}</Label>
            <Input
              id="price"
              type="number"
              value={data.price || ""}
              placeholder={t.pricePlaceholder}
              onChange={handleNumberChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="listing_type">{t.listingType}</Label>
            <Select
              value={data.listing_type}
              onValueChange={handleListingTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectListingType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="SALE" value="SALE">
                  {t.forSale}
                </SelectItem>
                <SelectItem key="RENT" value="RENT">
                  {t.forRent}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">{t.status}</Label>
            <Select value={data.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="ACTIVE" value="ACTIVE">
                  {t.active}
                </SelectItem>
                <SelectItem key="PENDING" value="PENDING">
                  {t.pending}
                </SelectItem>
                <SelectItem key="SOLD" value="SOLD">
                  {t.sold}
                </SelectItem>
                <SelectItem key="RENTED" value="RENTED">
                  {t.rented}
                </SelectItem>
                <SelectItem key="INACTIVE" value="INACTIVE">
                  {t.inactive}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="year_built">{t.yearBuilt}</Label>
            <Input
              id="year_built"
              type="text"
              value={data.year_built || ""}
              placeholder={t.yearBuiltPlaceholder}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">{t.description}</Label>
          <Textarea
            id="description"
            value={data.description}
            placeholder={t.descriptionPlaceholder}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : "space-x-2"
          }`}
        >
          <Switch
            id="featured"
            checked={data.featured}
            onCheckedChange={handleFeaturedChange}
            disabled={true}
          />
          <Label htmlFor="featured">{t.featuredProperty}</Label>
        </div>
      </CardContent>
    </Card>
  );
}
