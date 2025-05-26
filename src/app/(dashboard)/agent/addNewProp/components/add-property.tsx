"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { BasicInfoForm } from "@/app/(dashboard)/agent/addNewProp/components/BasicInfoForm";
import { DetailsForm } from "@/app/(dashboard)/agent/addNewProp/components/DetailsForm";
import { LocationForm } from "@/app/(dashboard)/agent/addNewProp/components/LocationForm";
import { MediaDocumentsForm } from "@/app/(dashboard)/agent/addNewProp/components/MediaDocumentsForm";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { useProperties } from "@/shared/hooks/useProperties";
import { useRouter } from "next/navigation";
import { Property } from "@/shared/types/property";
import { useToast } from "@/shared/hooks/use-toast";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
  Loader2,
  Home,
  Info,
  MapPin,
  Images,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function AddProperty() {
  const router = useRouter();
  const { toast } = useToast();
  const { createProperty, loading: hookLoading } = useProperties();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(25);
  const [success, setSuccess] = useState(false);
  const { currentLanguage, isRTL } = useTranslation();

  // Translations
  const translations = {
    en: {
      progress: "Progress",
      error: "Error",
      success: "Success",
      successMessage: "Property created successfully! Redirecting...",
      basicInfo: "Basic Info",
      details: "Details",
      location: "Location",
      media: "Media",
      nextDetails: "Next: Details",
      backBasic: "Back: Basic Info",
      nextLocation: "Next: Location",
      backDetails: "Back: Details",
      nextMedia: "Next: Media",
      backLocation: "Back: Location",
      saveProperty: "Save Property",
      saving: "Saving...",
      saved: "Saved!",
      validationError: "Validation Error",
      titleRequired: "Property title is required",
      priceRequired: "Property price must be greater than 0",
      descriptionRequired: "Property description is required",
    },
    ar: {
      progress: "التقدم",
      error: "خطأ",
      success: "نجاح",
      successMessage: "تم إنشاء العقار بنجاح! جاري إعادة التوجيه...",
      basicInfo: "معلومات أساسية",
      details: "التفاصيل",
      location: "الموقع",
      media: "الوسائط",
      nextDetails: "التالي: التفاصيل",
      backBasic: "الرجوع: المعلومات الأساسية",
      nextLocation: "التالي: الموقع",
      backDetails: "الرجوع: التفاصيل",
      nextMedia: "التالي: الوسائط",
      backLocation: "الرجوع: الموقع",
      saveProperty: "حفظ العقار",
      saving: "جاري الحفظ...",
      saved: "تم الحفظ!",
      validationError: "خطأ في التحقق",
      titleRequired: "عنوان العقار مطلوب",
      priceRequired: "سعر العقار يجب أن يكون أكبر من 0",
      descriptionRequired: "وصف العقار مطلوب",
    },
  };

  const t = translations[currentLanguage === "ar" ? "ar" : "en"];

  const [propertyData, setPropertyData] = useState<
    Omit<
      Property,
      "id" | "created_at" | "updated_at" | "user_id" | "images" | "primaryImage"
    >
  >({
    title: "",
    property_type: PROPERTY_TYPES.HOUSE,
    price: 0,
    description: "",
    listing_type: "SALE",
    status: "ACTIVE",
    featured: false,
    year_built: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    lot_size: 0,
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    latitude: 0,
    longitude: 0,
    location: "", // Will be set during submission based on city and state
    features: false, // Changed from empty array to boolean
  });

  const [images, setImages] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("basic-info");

  useEffect(() => {
    // Update progress based on active tab
    switch (activeTab) {
      case "basic-info":
        setFormProgress(25);
        break;
      case "details":
        setFormProgress(50);
        break;
      case "location":
        setFormProgress(75);
        break;
      case "media":
        setFormProgress(100);
        break;
    }
  }, [activeTab]);

  const handleFormChange = (field, value) => {
    // Clear error when user makes changes
    if (error) setError(null);

    setPropertyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (value) => {
    if (error) setError(null);

    setPropertyData((prev) => ({
      ...prev,
      property_type: value,
    }));
  };

  const validateForm = () => {
    // Required fields validation
    if (!propertyData.title) {
      setError(t.titleRequired);
      setActiveTab("basic-info");
      return false;
    }

    if (propertyData.price <= 0) {
      setError(t.priceRequired);
      setActiveTab("basic-info");
      return false;
    }

    if (!propertyData.description) {
      setError(t.descriptionRequired);
      setActiveTab("basic-info");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      toast({
        title: t.validationError,
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Start submission
    setIsSubmitting(true);

    try {
      // Create the property in the database
      const newProperty = await createProperty(
        { ...propertyData, user_id: "" },
        images
      );

      if (newProperty) {
        setSuccess(true);
        toast({
          title: t.success,
          description: t.successMessage,
        });

        // Briefly show success state before redirecting
        setTimeout(() => {
          // Redirect to properties list
          router.push("/search");
        }, 1500);
      } else {
        throw new Error("Failed to create property");
      }
    } catch (err: any) {
      console.error("Error creating property:", err);
      setError(err.message || "Failed to create property");
      toast({
        title: t.error,
        description: err.message || "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveToNextTab = () => {
    if (activeTab === "basic-info") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("location");
    else if (activeTab === "location") setActiveTab("media");
  };

  const moveToPreviousTab = () => {
    if (activeTab === "media") setActiveTab("location");
    else if (activeTab === "location") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("basic-info");
  };

  return (
    <div className={`w-full mx-auto relative ${isRTL ? "rtl" : ""}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{t.progress}</span>
          <span className="text-sm font-medium">{formProgress}%</span>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t.error}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Alert
              variant="default"
              className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            >
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>{t.success}</AlertTitle>
              <AlertDescription>{t.successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 w-full">
            <TabsTrigger
              value="basic-info"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">{t.basicInfo}</span>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{t.details}</span>
            </TabsTrigger>
            <TabsTrigger
              value="location"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">{t.location}</span>
            </TabsTrigger>
            <TabsTrigger
              value="media"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Images className="h-4 w-4" />
              <span className="hidden sm:inline">{t.media}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="basic-info-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInUp}
              >
                <BasicInfoForm
                  data={propertyData}
                  onChange={handleFormChange}
                  onTypeChange={handleTypeChange}
                />
                <div className="flex justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                    onClick={moveToNextTab}
                    disabled={isSubmitting}
                  >
                    {t.nextDetails}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="details-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInUp}
              >
                <DetailsForm data={propertyData} onChange={handleFormChange} />
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={moveToPreviousTab}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {t.backBasic}
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                    onClick={moveToNextTab}
                    disabled={isSubmitting}
                  >
                    {t.nextLocation}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="location-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInUp}
              >
                <LocationForm data={propertyData} onChange={handleFormChange} />
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={moveToPreviousTab}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {t.backDetails}
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                    onClick={moveToNextTab}
                    disabled={isSubmitting}
                  >
                    {t.nextMedia}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="media-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeInUp}
              >
                <MediaDocumentsForm setImages={setImages} />
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={moveToPreviousTab}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {t.backLocation}
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                      success
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                    disabled={isSubmitting || success}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> {t.saving}
                      </span>
                    ) : success ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> {t.saved}
                      </span>
                    ) : (
                      t.saveProperty
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
