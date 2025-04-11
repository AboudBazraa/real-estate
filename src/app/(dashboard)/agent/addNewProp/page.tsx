"use client";

import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/shared/providers/UserProvider";
import { useProperties } from "@/shared/hooks/useProperties";
import { PropertyFormData } from "@/shared/types/property";
import "./styles.css";

interface FormData {
  title: string;
  description: string;
  price: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  location: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lot_size: number;
  year_built: number;
  listing_type: string;
  status: string;
  featured: boolean;
}

export default function AddNewProp() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { createProperty } = useProperties();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    property_type: "house",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
    location: "",
    latitude: 0,
    longitude: 0,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    lot_size: 0,
    year_built: 0,
    listing_type: "sale",
    status: "available",
    featured: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and add to existing images
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    // Validate current step
    if (
      currentStep === 1 &&
      (!formData.title || !formData.description || !formData.price)
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields in Basic Information",
        variant: "destructive",
      });
      return;
    }

    if (
      currentStep === 2 &&
      (!formData.bedrooms || !formData.bathrooms || !formData.area)
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields in Property Details",
        variant: "destructive",
      });
      return;
    }

    if (
      currentStep === 3 &&
      (!formData.address || !formData.city || !formData.state)
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields in Location",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting || userLoading || !user) {
      toast({
        title: "Please wait",
        description: "Your request is being processed or you need to log in",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert form data to PropertyFormData
      const propertyData: PropertyFormData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        property_type: formData.property_type,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        location: `${formData.city}, ${formData.state}`,
        latitude: 0,
        longitude: 0,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        lot_size: formData.lot_size,
        year_built: formData.year_built.toString(),
        listing_type: formData.listing_type,
        status: formData.status,
        featured: formData.featured,
      };

      // Use our hook to create property
      const result = await createProperty(propertyData, images);

      if (result) {
        toast({
          title: "Success",
          description: "Property created successfully!",
        });
        router.push("/agent");
      }
    } catch (error: any) {
      console.error("Error submitting property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoForm();
      case 2:
        return renderDetailsForm();
      case 3:
        return renderLocationForm();
      case 4:
        return renderMediaForm();
      default:
        return renderBasicInfoForm();
    }
  };

  // Step 1: Basic Information
  const renderBasicInfoForm = () => (
    <div className="form-section">
      <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="title">Property Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Modern Family Home in Downtown"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Provide a detailed description of the property"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="e.g., 250000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="property_type">Property Type *</label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              required
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condominium</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Property Details
  const renderDetailsForm = () => (
    <div className="form-section">
      <h2 className="text-2xl font-semibold mb-6">Property Details</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms *</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms *</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min="0"
              step="0.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">Area (sq ft) *</label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="lot_size">Lot Size (sq ft)</label>
            <input
              type="number"
              id="lot_size"
              name="lot_size"
              value={formData.lot_size}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="year_built">Year Built</label>
            <input
              type="text"
              id="year_built"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              placeholder="e.g., 2010"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="listing_type">Listing Type *</label>
            <select
              id="listing_type"
              name="listing_type"
              value={formData.listing_type}
              onChange={handleChange}
              required
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="both">Sale/Rent</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="off_market">Off Market</option>
            </select>
          </div>

          <div className="form-group flex items-center">
            <label
              htmlFor="featured"
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span>Featured Property</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Location
  const renderLocationForm = () => (
    <div className="form-section">
      <h2 className="text-2xl font-semibold mb-6">Location</h2>
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="address">Street Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="e.g., 123 Main St"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="e.g., New York"
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State/Province *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="e.g., NY"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="zip_code">ZIP/Postal Code</label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              placeholder="e.g., 10001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., United States"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Media & Documents
  const renderMediaForm = () => (
    <div className="form-section">
      <h2 className="text-2xl font-semibold mb-6">Media & Documents</h2>
      <div className="space-y-6">
        <div className="form-group">
          <label htmlFor="images">Property Images</label>
          <div className="mt-2 p-4 border-2 border-dashed rounded-md">
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Selected Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="relative group border rounded-md overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property Image ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                  <div className="text-xs truncate p-2">{image.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Show loading state if we're checking user authentication
  if (userLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // User must be logged in
  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You must be logged in to add a property.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

      <div className="steps-container mb-8">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-text">Basic Info</div>
        </div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-text">Details</div>
        </div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-text">Location</div>
        </div>
        <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
          <div className="step-number">4</div>
          <div className="step-text">Media</div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        {renderStep()}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
            >
              Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Property"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
