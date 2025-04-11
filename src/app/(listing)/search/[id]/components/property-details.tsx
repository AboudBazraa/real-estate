import { Property } from "@/shared/types/property";
import { formatCurrency } from "@/shared/utils/property-utils";
import {
  Calendar,
  Bed,
  Bath,
  Home,
  Info,
  CheckCircle2,
  Square,
} from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with title, address and price */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {property.title}
            </h1>
            <p className="text-gray-600 mt-1">{property.address}</p>

            <div className="flex items-center mt-3 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === "FOR_SALE"
                    ? "bg-blue-100 text-blue-800"
                    : property.status === "FOR_RENT"
                    ? "bg-green-100 text-green-800"
                    : property.status === "SOLD"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {property.status.replace("_", " ")}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-gray-600">{property.property_type}</span>
              {property.featured && (
                <>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-primary font-medium flex items-center">
                    <CheckCircle2 size={14} className="mr-1" />
                    Featured
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {formatCurrency(property.price)}
            {property.listing_type === "RENT" && (
              <span className="text-base text-gray-600 font-normal">
                /month
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Property features */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-100 bg-slate-200/50">
        <div className="p-4 border-r border-b md:border-b-0 border-gray-100 flex flex-col items-center justify-center text-center">
          <Bed size={22} className="text-gray-500 mb-1 " />
          <div className="text-lg font-semibold ">{property.bedrooms}</div>
          <div className="text-xs text-gray-500 ">Bedrooms</div>
        </div>
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center text-center">
          <Bath size={22} className="text-gray-500 mb-1" />
          <div className="text-lg font-semibold">{property.bathrooms}</div>
          <div className="text-xs text-gray-500">Bathrooms</div>
        </div>
        <div className="p-4 border-r border-gray-100 flex flex-col items-center justify-center text-center">
          <Square size={22} className="text-gray-500 mb-1" />
          <div className="text-lg font-semibold">{property.area}</div>
          <div className="text-xs text-gray-500">Sq Ft</div>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Calendar size={22} className="text-gray-500 mb-1" />
          <div className="text-lg font-semibold">
            {property.year_built || "N/A"}
          </div>
          <div className="text-xs text-gray-500">Year Built</div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <Info size={18} className="mr-2 text-gray-500" />
          Description
        </h2>
        <div className="bg-slate-200/50 rounded-lg p-3 ">
          <p className="text-gray-600 whitespace-pre-line">
            {property.description}
          </p>
        </div>
      </div>

      {/* Features */}
      {/* <div className="p-6 border-t border-gray-100">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <Home size={18} className="mr-2 text-gray-500" />
          Features
        </h2>
        {property.features && property.features.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            {property.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle2
                  size={16}
                  className="text-primary mr-2 flex-shrink-0"
                />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No features listed</p>
        )}
      </div> */}
    </div>
  );
}
