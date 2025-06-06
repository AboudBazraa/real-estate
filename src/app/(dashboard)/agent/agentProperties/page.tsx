"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/shared/providers/UserProvider";
import { useProperties } from "@/shared/hooks/useProperties";
import { useTheme } from "next-themes";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Property,
  PropertyFilters,
  PropertySort,
} from "@/shared/types/property";
import {
  formatCurrency,
  formatDate,
  getPropertyTypeLabel,
} from "@/shared/utils/property-utils";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyDetailsModal } from "../components/PropertyDetailsModal";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Bed,
  Bath,
  Building,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  SunMoon,
  Filter,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { PropertyEditForm } from "../components/PropertyEditForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const skeletonPulse = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 0.8, 0.6],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  },
};

export default function AgentProperties() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const {
    properties,
    loading,
    error,
    totalCount,
    fetchProperties,
    deleteProperty,
  } = useProperties();
  const { theme, setTheme } = useTheme();
  const { currentLanguage, isRTL } = useTranslation();

  // Translations
  const translations = {
    en: {
      myProperties: "My Properties",
      addNewProperty: "Add New Property",
      searchPlaceholder: "Search properties...",
      filters: "Filters",
      clearFilters: "Clear Filters",
      sort: "Sort",
      sortNewest: "Newest First",
      sortOldest: "Oldest First",
      sortPriceHigh: "Price: High to Low",
      sortPriceLow: "Price: Low to High",
      propertyType: "Property Type",
      allTypes: "All Types",
      apartment: "Apartment",
      house: "House",
      villa: "Villa",
      commercial: "Commercial",
      land: "Land",
      status: "Status",
      allStatuses: "All Statuses",
      active: "Active",
      pending: "Pending",
      sold: "Sold",
      rented: "Rented",
      price: "Price",
      location: "Location",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Area",
      actions: "Actions",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      noProperties: "No properties found",
      noPropertiesMessage:
        "Try adding a new property or adjusting your filters.",
      propertyDeleted: "Property Deleted",
      propertyDeletedMessage: "The property has been successfully deleted",
      confirmDelete: "Confirm Delete",
      confirmDeleteMessage:
        "Are you sure you want to delete this property? This action cannot be undone.",
      cancel: "Cancel",
      of: "of",
      previous: "Previous",
      next: "Next",
      sqft: "sq ft",
      details: "Details",
      close: "Close",
      propertyDetails: "Property Details",
      editProperty: "Edit Property",
      applyFilters: "Apply Filters",
      loading: "Loading your properties...",
      errorLoading: "Error Loading Properties",
      verified: "Verified",
      notVerified: "Not Verified",
      noImage: "No image",
      verification: "Verification",
      dateAdded: "Date Added",
      perMonth: "/month",
      showing: "Showing",
      properties: "properties",
      signInRequired: "Sign In Required",
      signInMessage:
        "You need to be logged in to view and manage your properties.",
      goToLogin: "Go to Login",
      loadingProfile: "Loading your profile...",
      toggleTheme: "Toggle theme",
      refinePropertyListings: "Refine your property listings",
      listingType: "Listing Type",
      allListingTypes: "All Listing Types",
      forSale: "For Sale",
      forRent: "For Rent",
      saleRent: "Sale/Rent",
      available: "Available",
      offMarket: "Off Market",
      openMenu: "Open menu",
      townhouse: "Townhouse",
      condo: "Condo",
      industrial: "Industrial",
      titleAsc: "Title: A-Z",
      titleDesc: "Title: Z-A",
    },
    ar: {
      myProperties: "عقاراتي",
      addNewProperty: "إضافة عقار جديد",
      searchPlaceholder: "البحث في العقارات...",
      filters: "التصفية",
      clearFilters: "مسح التصفية",
      sort: "الترتيب",
      sortNewest: "الأحدث أولاً",
      sortOldest: "الأقدم أولاً",
      sortPriceHigh: "السعر: من الأعلى إلى الأقل",
      sortPriceLow: "السعر: من الأقل إلى الأعلى",
      propertyType: "نوع العقار",
      allTypes: "جميع الأنواع",
      apartment: "شقة",
      house: "منزل",
      villa: "فيلا",
      commercial: "تجاري",
      land: "أرض",
      status: "الحالة",
      allStatuses: "جميع الحالات",
      active: "نشط",
      pending: "قيد الانتظار",
      sold: "تم البيع",
      rented: "تم التأجير",
      price: "السعر",
      location: "الموقع",
      bedrooms: "غرف النوم",
      bathrooms: "الحمامات",
      area: "المساحة",
      actions: "الإجراءات",
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
      noProperties: "لم يتم العثور على عقارات",
      noPropertiesMessage: "حاول إضافة عقار جديد أو تعديل التصفية.",
      propertyDeleted: "تم حذف العقار",
      propertyDeletedMessage: "تم حذف العقار بنجاح",
      confirmDelete: "تأكيد الحذف",
      confirmDeleteMessage:
        "هل أنت متأكد من رغبتك في حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      of: "من",
      previous: "السابق",
      next: "التالي",
      sqft: "قدم مربع",
      details: "التفاصيل",
      close: "إغلاق",
      propertyDetails: "تفاصيل العقار",
      editProperty: "تعديل العقار",
      applyFilters: "تطبيق التصفية",
      loading: "جاري تحميل عقاراتك...",
      errorLoading: "خطأ في تحميل العقارات",
      verified: "موثق",
      notVerified: "غير موثق",
      noImage: "لا توجد صورة",
      verification: "التوثيق",
      dateAdded: "تاريخ الإضافة",
      perMonth: "/شهر",
      showing: "عرض",
      properties: "عقارات",
      signInRequired: "تسجيل الدخول مطلوب",
      signInMessage: "تحتاج إلى تسجيل الدخول لعرض وإدارة عقاراتك.",
      goToLogin: "الذهاب إلى تسجيل الدخول",
      loadingProfile: "جاري تحميل ملفك الشخصي...",
      toggleTheme: "تبديل المظهر",
      refinePropertyListings: "تنقيح قائمة العقارات الخاصة بك",
      listingType: "نوع القائمة",
      allListingTypes: "جميع أنواع القوائم",
      forSale: "للبيع",
      forRent: "للإيجار",
      saleRent: "بيع/إيجار",
      available: "متاح",
      offMarket: "خارج السوق",
      openMenu: "فتح القائمة",
      townhouse: "تاون هاوس",
      condo: "شقة تمليك",
      industrial: "صناعي",
      titleAsc: "العنوان: أ-ي",
      titleDesc: "العنوان: ي-أ",
    },
  };

  const t = translations[currentLanguage === "ar" ? "ar" : "en"];

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [sort, setSort] = useState<PropertySort>({
    column: "created_at",
    ascending: false,
  });

  // Fetch user's properties
  useEffect(() => {
    if (user) {
      const activeFilters: PropertyFilters = {
        ...filters,
      };

      if (searchTerm) {
        activeFilters.search_term = searchTerm;
      }

      fetchProperties(
        pageIndex,
        pageSize,
        Object.keys(activeFilters).length > 0 ? activeFilters : undefined,
        sort,
        true // Only fetch user's properties
      );
    }
  }, [user, pageIndex, searchTerm, filters, sort, fetchProperties]);

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setPageIndex(0);
  };

  const handleFilterChange = (filterKey: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value || undefined,
    }));
    setPageIndex(0); // Reset to first page when filtering
  };

  const handleSortChange = (value: string) => {
    const [column, ascending] = value.split("-");
    setSort({ column, ascending: ascending === "true" });
    setPageIndex(0); // Reset to first page when sorting
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setSort({ column: "created_at", ascending: false });
    setPageIndex(0);
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    const success = await deleteProperty(propertyToDelete);

    if (success) {
      toast({
        title: t.propertyDeleted,
        description: t.propertyDeletedMessage,
      });
    }

    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  // Dummy function to fix the onToggleFavorite prop requirement
  const handleToggleFavorite = () => {
    // This function is required by the PropertyCard component but not actually used in this view
    console.log("Favorite toggled - not implemented in agent view");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PENDING":
        return "secondary";
      case "SOLD":
        return "outline";
      case "RENTED":
        return "outline";
      case "INACTIVE":
        return "destructive";
      default:
        return "destructive";
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (userLoading) {
    return (
      <motion.div
        className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.p
            className="text-muted-foreground font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {t.loadingProfile}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-xl border shadow-sm">
          <div className="text-center space-y-2">
            <div className="mx-auto w-fit p-3 rounded-full bg-muted mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground h-6 w-6"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6" />
                <path d="M22 11h-6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-muted-foreground">{t.signInMessage}</p>
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="w-full shadow-sm"
          >
            {t.goToLogin}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`container mx-auto p-2 md:p-4 space-y-6 ${isRTL ? "rtl" : ""}`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {t.myProperties}
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  <SunMoon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.toggleTheme}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            onClick={() => router.push("/agent/addNewProp")}
          >
            <Plus className="h-4 w-4" /> {t.addNewProperty}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className={`absolute ${
                isRTL ? "right-3" : "left-3"
              } top-2.5 h-4 w-4 text-muted-foreground`}
            />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isRTL ? "pr-9" : "pl-9"
              } h-10 bg-background border-muted`}
            />
          </div>
          <Button type="submit" size="default" className="shadow-sm">
            {t.searchPlaceholder.split("...")[0]}
          </Button>
        </form>

        <Select
          value={`${sort.column}-${sort.ascending}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="h-10 bg-background border-muted">
            <SelectValue placeholder={t.sort} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-false">{t.sortNewest}</SelectItem>
            <SelectItem value="created_at-true">{t.sortOldest}</SelectItem>
            <SelectItem value="price-true">{t.sortPriceLow}</SelectItem>
            <SelectItem value="price-false">{t.sortPriceHigh}</SelectItem>
            <SelectItem value="title-true">{t.titleAsc}</SelectItem>
            <SelectItem value="title-false">{t.titleDesc}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden md:flex flex-wrap gap-2 mb-8">
        <Select
          value={filters.property_type || "all_types"}
          onValueChange={(value) =>
            handleFilterChange(
              "property_type",
              value === "all_types" ? "" : value
            )
          }
        >
          <SelectTrigger className="w-[180px] h-9 bg-background border-muted">
            <SelectValue placeholder={t.propertyType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_types">{t.allTypes}</SelectItem>
            <SelectItem value="house">{t.house}</SelectItem>
            <SelectItem value="apartment">{t.apartment}</SelectItem>
            <SelectItem value="condo">{t.condo}</SelectItem>
            <SelectItem value="townhouse">{t.townhouse}</SelectItem>
            <SelectItem value="land">{t.land}</SelectItem>
            <SelectItem value="commercial">{t.commercial}</SelectItem>
            <SelectItem value="industrial">{t.industrial}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all_status"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all_status" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px] h-9 bg-background border-muted">
            <SelectValue placeholder={t.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_status">{t.allStatuses}</SelectItem>
            <SelectItem value="available">{t.available}</SelectItem>
            <SelectItem value="pending">{t.pending}</SelectItem>
            <SelectItem value="sold">{t.sold}</SelectItem>
            <SelectItem value="off_market">{t.offMarket}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.listing_type || "all_listing_types"}
          onValueChange={(value) =>
            handleFilterChange(
              "listing_type",
              value === "all_listing_types" ? "" : value
            )
          }
        >
          <SelectTrigger className="w-[180px] h-9 bg-background border-muted">
            <SelectValue placeholder={t.listingType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_listing_types">
              {t.allListingTypes}
            </SelectItem>
            <SelectItem value="sale">{t.forSale}</SelectItem>
            <SelectItem value="rent">{t.forRent}</SelectItem>
            <SelectItem value="both">{t.saleRent}</SelectItem>
          </SelectContent>
        </Select>

        {(Object.keys(filters).length > 0 ||
          searchTerm ||
          sort.column !== "created_at" ||
          sort.ascending) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            size="sm"
            className="h-9"
          >
            {t.clearFilters}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex justify-center items-center py-16 rounded-xl border border-dashed bg-muted/20"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
              <motion.p
                className="text-muted-foreground font-medium"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {t.loading}
              </motion.p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            className="text-center py-10 rounded-xl border border-destructive/20 bg-destructive/5"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <div className="mx-auto w-fit p-3 rounded-full bg-destructive/10 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-destructive h-6 w-6"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <p className="text-lg font-medium text-destructive mb-2">
              {t.errorLoading}
            </p>
            <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
          </motion.div>
        ) : properties.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-16 rounded-xl border border-dashed bg-muted/20"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <div className="mx-auto w-fit p-4 rounded-full bg-muted mb-4">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium mb-2">{t.noProperties}</p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t.noPropertiesMessage}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
              onClick={() => router.push("/agent/addNewProp")}
            >
              <Plus className="h-4 w-4" /> {t.addNewProperty}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="space-y-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <div className="hidden md:block overflow-hidden rounded-xl border shadow-sm">
              <Table className="w-full">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-left font-medium text-muted-foreground">
                      {t.propertyType}
                    </TableHead>
                    <TableHead className="text-left font-medium text-muted-foreground">
                      {t.price}
                    </TableHead>
                    <TableHead className="text-left font-medium text-muted-foreground">
                      {t.details}
                    </TableHead>
                    <TableHead className="text-left font-medium text-muted-foreground">
                      {t.status}
                    </TableHead>
                    <TableHead className="text-left font-medium text-muted-foreground">
                      {t.dateAdded}
                    </TableHead>
                    <TableHead className="text-left font-medium text-muted-foreground">
                      {t.verification}
                    </TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground w-[100px]">
                      {t.actions}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key={property.id}
                      className="group border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0 transition-transform group-hover:scale-105">
                            {property.primaryImage ? (
                              <img
                                src={property.primaryImage}
                                alt={property.title}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                {t.noImage}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium truncate max-w-[200px] group-hover:text-primary transition-colors">
                              {property.title}
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {property.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {formatCurrency(property.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.listing_type === "rent" ? t.perMonth : ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {getPropertyTypeLabel(property.property_type)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1">
                            <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5" />{" "}
                            {property.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" /> {property.area}{" "}
                            {t.sqft}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(property.status)}
                          className="capitalize px-2 text-xs font-medium"
                        >
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(property.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            property.featured === true
                              ? "secondary"
                              : "destructive"
                          }
                          className="capitalize px-1 text-xs font-medium"
                        >
                          {property.featured ? t.verified : t.notVerified}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t.openMenu}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewProperty(property)}
                              className={`cursor-pointer flex items-center ${
                                isRTL ? "flex-row-reverse justify-between" : ""
                              }`}
                            >
                              <Eye
                                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`}
                              />{" "}
                              {t.view}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProperty(property)}
                              className={`cursor-pointer flex items-center ${
                                isRTL ? "flex-row-reverse justify-between" : ""
                              }`}
                            >
                              <Edit
                                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`}
                              />{" "}
                              {t.edit}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className={`text-destructive focus:text-destructive cursor-pointer flex items-center ${
                                isRTL ? "flex-row-reverse justify-between" : ""
                              }`}
                              onClick={() => handleDeleteClick(property.id)}
                            >
                              <Trash2
                                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`}
                              />{" "}
                              {t.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile property cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-background border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <PropertyCard
                    property={property}
                    onView={() => handleViewProperty(property)}
                    onEdit={() => handleEditProperty(property)}
                    onDelete={() => handleDeleteClick(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                    variant="compact"
                    showStatus={true}
                    id={property.id}
                    title={property.title || ""}
                    price={property.price || 0}
                    status={property.status || ""}
                    primaryImage={
                      property.primaryImage ||
                      (property.images && property.images.length > 0
                        ? property.images[0].image_url
                        : null)
                    }
                    address={property.address || ""}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm text-muted-foreground">
                {t.showing}{" "}
                <span className="font-medium">{pageIndex * pageSize + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min((pageIndex + 1) * pageSize, totalCount)}
                </span>{" "}
                {t.of} <span className="font-medium">{totalCount}</span>{" "}
                {t.properties}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageIndex - 1)}
                  disabled={pageIndex === 0}
                  className="h-9 px-4"
                >
                  {t.previous}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageIndex + 1)}
                  disabled={(pageIndex + 1) * pageSize >= totalCount}
                  className="h-9 px-4"
                >
                  {t.next}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filters Drawer */}
      <Drawer open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <DrawerContent className={`px-4 ${isRTL ? "rtl" : ""}`}>
          <DrawerHeader>
            <DrawerTitle>{t.filters}</DrawerTitle>
            <DrawerDescription>{t.refinePropertyListings}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.propertyType}</label>
              <Select
                value={filters.property_type || "all_types"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "property_type",
                    value === "all_types" ? "" : value
                  )
                }
              >
                <SelectTrigger className="w-full bg-background border-muted">
                  <SelectValue placeholder={t.propertyType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">{t.allTypes}</SelectItem>
                  <SelectItem value="house">{t.house}</SelectItem>
                  <SelectItem value="apartment">{t.apartment}</SelectItem>
                  <SelectItem value="condo">{t.condo}</SelectItem>
                  <SelectItem value="townhouse">{t.townhouse}</SelectItem>
                  <SelectItem value="land">{t.land}</SelectItem>
                  <SelectItem value="commercial">{t.commercial}</SelectItem>
                  <SelectItem value="industrial">{t.industrial}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.status}</label>
              <Select
                value={filters.status || "all_status"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "status",
                    value === "all_status" ? "" : value
                  )
                }
              >
                <SelectTrigger className="w-full bg-background border-muted">
                  <SelectValue placeholder={t.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_status">{t.allStatuses}</SelectItem>
                  <SelectItem value="available">{t.available}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="sold">{t.sold}</SelectItem>
                  <SelectItem value="off_market">{t.offMarket}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.listingType}</label>
              <Select
                value={filters.listing_type || "all_listing_types"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "listing_type",
                    value === "all_listing_types" ? "" : value
                  )
                }
              >
                <SelectTrigger className="w-full bg-background border-muted">
                  <SelectValue placeholder={t.listingType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_listing_types">
                    {t.allListingTypes}
                  </SelectItem>
                  <SelectItem value="sale">{t.forSale}</SelectItem>
                  <SelectItem value="rent">{t.forRent}</SelectItem>
                  <SelectItem value="both">{t.saleRent}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter
            className={`flex flex-row ${
              isRTL ? "flex-row-reverse" : "justify-between"
            }`}
          >
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={Object.keys(filters).length === 0 && !searchTerm}
            >
              {t.clearFilters}
            </Button>
            <DrawerClose asChild>
              <Button>{t.applyFilters}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t.confirmDelete}
        description={t.confirmDeleteMessage}
      />

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          propertyId={selectedProperty.id}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      {selectedProperty && (
        <PropertyEditForm
          propertyId={selectedProperty.id}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </motion.div>
  );
}
