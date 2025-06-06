import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  X,
  Filter,
  MapPin,
  Users,
  Home,
  Heart,
  ClipboardList,
  Globe,
  Merge,
} from "lucide-react";
import { DISTRICT_DATA } from "@/data/districtData";
import { REGION_DATA, AREA_DATA, NEIGHBORHOOD_DATA } from "@/data/locationData";
import { DistrictMap } from "./DistrictMap";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DemographicFiltersProps {
  onFilterChange: (filters: DemographicFiltersState) => void;
  totalResponses: number;
  surveyType: SurveyType;
  onSurveyTypeChange: (type: SurveyType) => void;
}

export type SurveyType = "formal" | "public" | "merged";

interface ZipToDistrict {
  [zipCode: string]: string;
}

const ZIP_TO_DISTRICT: ZipToDistrict = Object.entries(DISTRICT_DATA).reduce(
  (acc, [district, zipCodes]) => {
    zipCodes.forEach((zipCode) => {
      acc[zipCode] = district;
    });
    return acc;
  },
  {} as ZipToDistrict
);

export interface DemographicFiltersState {
  ageMin?: number;
  ageMax?: number;
  Q100?: {
    gte: number;
    lte: number;
  };
  income?: string[];
  gender?: string[];
  ethnicity?: string[];
  education?: string[];
  employment?: string[];
  housing?: string[];
  maritalStatus?: string[];
  children?: string[];
  politicalAffiliation?: string[];
  religiousAffiliation?: string[];
  sexualOrientation?: string[];
  district?: string;
  region?: string[];
  area?: string[];
  neighborhood?: string[];
  districts?: string[];
  address?: string;
  zipCode?: string;
}

const FILTER_SECTIONS = [
  {
    id: "survey-type",
    title: "Survey Type",
    icon: ClipboardList,
    description: "Choose the type of survey data to view",
  },
  {
    id: "location",
    title: "Location",
    icon: MapPin,
    description: "Filter by geographic location",
  },
  {
    id: "demographics",
    title: "Demographics",
    icon: Users,
    description: "Filter by personal characteristics",
  },
  {
    id: "household",
    title: "Household",
    icon: Home,
    description: "Filter by household information",
  },
  {
    id: "beliefs",
    title: "Beliefs & Identity",
    icon: Heart,
    description: "Filter by personal beliefs and identity",
  },
];

export function DemographicFilters({
  onFilterChange,
  totalResponses,
  surveyType,
  onSurveyTypeChange,
}: DemographicFiltersProps) {
  const [pendingFilters, setPendingFilters] = useState<DemographicFiltersState>(
    {}
  );
  const [activeFilters, setActiveFilters] = useState<DemographicFiltersState>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("survey-type");
  const [pendingSurveyType, setPendingSurveyType] =
    useState<SurveyType>(surveyType);
  const [activeLocationTab, setActiveLocationTab] = useState<
    "district" | "region" | "area" | "neighborhood" | "search"
  >("district");
  const [searchQuery, setSearchQuery] = useState("");

  const getFilterDisabledState = (
    filterKey: keyof DemographicFiltersState
  ): boolean => {
    switch (pendingSurveyType) {
      case "formal":
        return false;
      case "public":
      case "merged":
        return ![
          "ageMin",
          "ageMax",
          "gender",
          "ethnicity",
          "district",
          "region",
          "area",
          "neighborhood",
          "housing",
          "children",
        ].includes(filterKey);
      default:
        return true;
    }
  };

  const clearInvalidFilters = () => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach((key) => {
        const filterKey = key as keyof DemographicFiltersState;
        if (getFilterDisabledState(filterKey)) {
          delete newFilters[filterKey];
        }
      });
      return newFilters;
    });
  };

  const handleFilterChange = (
    key: keyof DemographicFiltersState,
    value: string | number
  ) => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };

      if (key === "ageMin" || key === "ageMax") {
        newFilters[key] = value as number;
        return newFilters;
      }

      if (key === "Q100") {
        return newFilters; // Skip array handling for Q100
      }

      if (key === "district" || key === "address" || key === "zipCode") {
        newFilters[key] = value as string;
        return newFilters;
      }

      const currentValues = Array.isArray(prev[key])
        ? (prev[key] as string[])
        : [];

      if (currentValues.includes(value as string)) {
        const filteredValues = currentValues.filter((v) => v !== value);
        if (filteredValues.length === 0) {
          delete newFilters[key];
        } else {
          newFilters[key] = filteredValues;
        }
      } else {
        newFilters[key] = [...currentValues, value as string];
      }

      return newFilters;
    });
  };

  const handleDistrictSelect = (district: string) => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.region;
      delete newFilters.area;
      delete newFilters.neighborhood;

      const currentDistricts = prev.districts || [];
      const newDistricts = currentDistricts.includes(district)
        ? currentDistricts.filter((d) => d !== district)
        : [...currentDistricts, district];

      newFilters.districts = newDistricts.length > 0 ? newDistricts : undefined;
      return newFilters;
    });
  };

  const handleLocationTabChange = (
    tab: "district" | "region" | "area" | "neighborhood" | "search"
  ) => {
    setActiveLocationTab(tab);
    // Clear other location filters when switching tabs
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.region;
      delete newFilters.area;
      delete newFilters.neighborhood;
      delete newFilters.districts;
      delete newFilters.district;
      return newFilters;
    });
  };

  const handleLocationChange = (
    type: "region" | "area" | "neighborhood",
    value: string
  ) => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      const currentValues = Array.isArray(prev[type])
        ? (prev[type] as string[])
        : [];

      if (currentValues.includes(value)) {
        const filteredValues = currentValues.filter((v) => v !== value);
        if (filteredValues.length === 0) {
          delete newFilters[type];
        } else {
          newFilters[type] = filteredValues;
        }
      } else {
        newFilters[type] = [...currentValues, value];
      }

      return newFilters;
    });
  };

  const handleAgeRangeChange = (values: [number, number]) => {
    const [min, max] = values;
    setPendingFilters((prev) => ({
      ...prev,
      ageMin: min,
      ageMax: max,
    }));
  };

  const handleAddressSelect = (address: string, zipCode: string) => {
    const district = ZIP_TO_DISTRICT[zipCode];
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.region;
      delete newFilters.area;
      delete newFilters.neighborhood;
      delete newFilters.districts;
      delete newFilters.district;

      return {
        ...newFilters,
        address: address.split(",")[0],
        zipCode,
        district,
      };
    });
  };

  const applyFilters = () => {
    const apiFilters: Record<string, any> = {};

    if (
      pendingFilters.ageMin !== undefined ||
      pendingFilters.ageMax !== undefined
    ) {
      apiFilters.Q100 = {
        gte: Number(pendingFilters.ageMin) || 0,
        lte: Number(pendingFilters.ageMax) || 90,
      };
    }

    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (key !== "ageMin" && key !== "ageMax" && value !== undefined) {
        apiFilters[key] = value;
      }
    });

    setActiveFilters(pendingFilters);
    onFilterChange(apiFilters);
    onSurveyTypeChange(pendingSurveyType);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPendingFilters({});
    setActiveFilters({});
    setPendingSurveyType(surveyType);
    onFilterChange({});
  };

  const removeFilter = (key: keyof DemographicFiltersState) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    setPendingFilters(newFilters);

    const apiFilters: Record<string, any> = {};

    if (newFilters.ageMin !== undefined || newFilters.ageMax !== undefined) {
      apiFilters.Q100 = {
        gte: Number(newFilters.ageMin) || 0,
        lte: Number(newFilters.ageMax) || 90,
      };
    }

    Object.entries(newFilters).forEach(([key, value]) => {
      if (key !== "ageMin" && key !== "ageMax" && value !== undefined) {
        apiFilters[key] = value;
      }
    });

    onFilterChange(apiFilters);
  };

  const getFilterLabel = (
    key: keyof DemographicFiltersState,
    value: string | string[] | number
  ) => {
    if (key === "ageMin" && value === 0) return null;
    if (key === "ageMax" && value === 90) return null;

    const labels: Record<string, string> = {
      ageMin: "Age Min",
      ageMax: "Age Max",
      Q100: "Age Range",
      income: "Income",
      gender: "Gender",
      ethnicity: "Ethnicity",
      education: "Education",
      employment: "Employment",
      housing: "Housing",
      maritalStatus: "Marital Status",
      children: "Children",
      politicalAffiliation: "Political Affiliation",
      religiousAffiliation: "Religious Affiliation",
      sexualOrientation: "Sexual Orientation",
      district: "District",
      region: "Region",
      area: "Area",
      neighborhood: "Neighborhood",
      districts: "Districts",
      address: "Address",
      zipCode: "Zip Code",
    };

    let displayValue = value;
    if (Array.isArray(value)) {
      if (key === "region") {
        displayValue = value
          .map((v) => REGION_DATA.find((r) => r.value === v)?.label || v)
          .join(", ");
      } else if (key === "area") {
        displayValue = value
          .map((v) => AREA_DATA.find((a) => a.value === v)?.label || v)
          .join(", ");
      } else if (key === "neighborhood") {
        displayValue = value
          .map((v) => NEIGHBORHOOD_DATA.find((n) => n.value === v)?.label || v)
          .join(", ");
      } else {
        displayValue = value.join(", ");
      }
    } else if (key === "region") {
      const region = REGION_DATA.find((r) => r.value === value);
      if (region) displayValue = region.label;
    } else if (key === "area") {
      const area = AREA_DATA.find((a) => a.value === value);
      if (area) displayValue = area.label;
    } else if (key === "neighborhood") {
      const neighborhood = NEIGHBORHOOD_DATA.find((n) => n.value === value);
      if (neighborhood) displayValue = neighborhood.label;
    } else if (key === "Q100" && typeof value === "object") {
      const ageRange = value as { gte: number; lte: number };
      displayValue = `${ageRange.gte}-${ageRange.lte} years`;
    }

    if (displayValue === undefined) return null;

    return `${labels[key]}: ${displayValue}`;
  };

  const activeFiltersCount = Object.keys(activeFilters).filter((key) => {
    if (key === "ageMin" && activeFilters[key] === 0) return false;
    if (key === "ageMax" && activeFilters[key] === 90) return false;
    if (["district", "region", "area", "neighborhood"].includes(key)) {
      return (
        key ===
        Object.keys(activeFilters).find((k) =>
          ["district", "region", "area", "neighborhood"].includes(k)
        )
      );
    }
    return true;
  }).length;

  const isFilterSelected = (
    key: keyof DemographicFiltersState,
    value: string
  ): boolean => {
    const currentValues = pendingFilters[key];
    if (!currentValues) return false;
    return Array.isArray(currentValues) ? currentValues.includes(value) : false;
  };

  const renderSurveyTypeSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            setPendingSurveyType("formal");
            clearInvalidFilters();
          }}
          className={cn(
            "p-4 rounded-lg border-2 transition-all hover:border-[var(--brand-blue)]/50",
            pendingSurveyType === "formal"
              ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5"
              : "border-muted"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-5 w-5" />
            <span className="font-medium">Formal Survey</span>
          </div>
          <p className="text-sm text-muted-foreground">
            In-depth survey with detailed questions, but limited to targeted
            outreach.
          </p>
        </button>

        <button
          onClick={() => {
            setPendingSurveyType("public");
            clearInvalidFilters();
          }}
          className={cn(
            "p-4 rounded-lg border-2 transition-all hover:border-[var(--brand-blue)]/50",
            pendingSurveyType === "public"
              ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5"
              : "border-muted"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5" />
            <span className="font-medium">Public Survey</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Open survey with basic questions, available to all community
            members.
          </p>
        </button>

        <button
          onClick={() => {
            setPendingSurveyType("merged");
            clearInvalidFilters();
          }}
          className={cn(
            "p-4 rounded-lg border-2 transition-all hover:border-[var(--brand-blue)]/50",
            pendingSurveyType === "merged"
              ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5"
              : "border-muted"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Merge className="h-5 w-5" />
            <span className="font-medium">Merged Survey</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Combines both survey types, using only questions common to both.
          </p>
        </button>
      </div>
    </div>
  );

  const renderLocationSection = () => (
    <div className="space-y-6">
      <div className="flex gap-2 border-b overflow-x-auto">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
        </div>
        <button
          onClick={() => handleLocationTabChange("district")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
            activeLocationTab === "district"
              ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Districts
        </button>
        <button
          onClick={() => handleLocationTabChange("region")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
            activeLocationTab === "region"
              ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Regions
        </button>
        <button
          onClick={() => handleLocationTabChange("area")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
            activeLocationTab === "area"
              ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Areas
        </button>
        <button
          onClick={() => handleLocationTabChange("neighborhood")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
            activeLocationTab === "neighborhood"
              ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Neighborhoods
        </button>
        <button
          onClick={() => handleLocationTabChange("search")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
            activeLocationTab === "search"
              ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Search
        </button>
      </div>

      <div
        className={cn(
          "grid gap-6",
          activeLocationTab === "district"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        )}
      >
        <div className="space-y-4">
          <ScrollArea className="h-[300px] pr-4">
            {activeLocationTab === "district" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(DISTRICT_DATA)
                  .filter((district) =>
                    district.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictSelect(district)}
                      disabled={getFilterDisabledState("district")}
                      className={cn(
                        "p-2 text-sm rounded-lg border-2 transition-colors",
                        pendingFilters.districts?.includes(district)
                          ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                          : "border-muted hover:border-[var(--brand-blue)]/50",
                        getFilterDisabledState("district") &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {district}
                    </button>
                  ))}
              </div>
            )}

            {activeLocationTab === "region" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {REGION_DATA.filter((region) =>
                  region.label.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((region) => (
                  <button
                    key={region.value}
                    onClick={() => handleLocationChange("region", region.value)}
                    disabled={getFilterDisabledState("region")}
                    className={cn(
                      "p-2 text-sm rounded-lg border-2 transition-colors",
                      isFilterSelected("region", region.value)
                        ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                        : "border-muted hover:border-[var(--brand-blue)]/50",
                      getFilterDisabledState("region") &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            )}

            {activeLocationTab === "area" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {AREA_DATA.filter((area) =>
                  area.label.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((area) => (
                  <button
                    key={area.value}
                    onClick={() => handleLocationChange("area", area.value)}
                    disabled={getFilterDisabledState("area")}
                    className={cn(
                      "p-2 text-sm rounded-lg border-2 transition-colors",
                      isFilterSelected("area", area.value)
                        ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                        : "border-muted hover:border-[var(--brand-blue)]/50",
                      getFilterDisabledState("area") &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            )}

            {activeLocationTab === "neighborhood" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {NEIGHBORHOOD_DATA.filter((neighborhood) =>
                  neighborhood.label
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                ).map((neighborhood) => (
                  <button
                    key={neighborhood.value}
                    onClick={() =>
                      handleLocationChange("neighborhood", neighborhood.value)
                    }
                    disabled={getFilterDisabledState("neighborhood")}
                    className={cn(
                      "p-2 text-sm rounded-lg border-2 transition-colors",
                      isFilterSelected("neighborhood", neighborhood.value)
                        ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                        : "border-muted hover:border-[var(--brand-blue)]/50",
                      getFilterDisabledState("neighborhood") &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {neighborhood.label}
                  </button>
                ))}
              </div>
            )}

            {activeLocationTab === "search" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Search by Address</h3>
                  <div className="px-2 sm:px-4">
                    <AddressAutocomplete
                      onAddressSelect={handleAddressSelect}
                      value={pendingFilters.address}
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {activeLocationTab === "district" && (
          <div className="space-y-4">
            <h3 className="font-medium">Map View</h3>
            <div className="border rounded-lg overflow-hidden">
              <DistrictMap
                selectedDistricts={pendingFilters.districts || []}
                onDistrictSelect={handleDistrictSelect}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDemographicsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Age Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Minimum Age</label>
            <Input
              type="number"
              min="0"
              max="90"
              value={pendingFilters.ageMin ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  handleFilterChange("ageMin", value);
                }
              }}
              disabled={getFilterDisabledState("ageMin")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Maximum Age</label>
            <Input
              type="number"
              min="0"
              max="90"
              value={pendingFilters.ageMax ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  handleFilterChange("ageMax", value);
                }
              }}
              disabled={getFilterDisabledState("ageMax")}
            />
          </div>
        </div>
        <Slider
          min={0}
          max={90}
          value={[pendingFilters.ageMin ?? 0, pendingFilters.ageMax ?? 90]}
          onValueChange={handleAgeRangeChange}
          step={1}
          className="w-full [&_[role=slider]]:bg-[var(--brand-blue)] [&_[role=slider]]:border-[var(--brand-blue)]"
          disabled={getFilterDisabledState("ageMin")}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Gender</h3>
        <div className="grid grid-cols-4 gap-2">
          {["male", "female", "other", "prefer-not"].map((gender) => (
            <button
              key={gender}
              onClick={() => handleFilterChange("gender", gender)}
              disabled={getFilterDisabledState("gender")}
              className={cn(
                "p-2 rounded-lg border-2 transition-colors",
                isFilterSelected("gender", gender)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("gender") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {gender.charAt(0).toUpperCase() +
                gender.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Race/Ethnicity</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "3", label: "White" },
            { value: "4", label: "Black" },
            { value: "5", label: "Asian/Pacific" },
            { value: "1", label: "Hispanic" },
            { value: "2", label: "Kurdish" },
            { value: "6", label: "Other" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("ethnicity", value)}
              disabled={getFilterDisabledState("ethnicity")}
              className={cn(
                "p-2 rounded-lg border-2 transition-colors",
                isFilterSelected("ethnicity", value)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("ethnicity") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Education Level</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "high-school", label: "High School/GED" },
            { value: "some-college", label: "Some College" },
            { value: "bachelors", label: "Bachelor's Degree" },
            { value: "masters", label: "Master's Degree" },
            { value: "doctorate", label: "Doctorate" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("education", value)}
              disabled={getFilterDisabledState("education")}
              className={cn(
                "p-2 rounded-lg border-2 transition-colors",
                isFilterSelected("education", value)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("education") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Income Range</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { value: "under-15k", label: "Under $15,000" },
            { value: "15k-25k", label: "$15,000-$24,999" },
            { value: "25k-50k", label: "$25,000-$49,999" },
            { value: "50k-100k", label: "$50,000-$99,999" },
            { value: "100k-150k", label: "$100,000-$149,999" },
            { value: "150k-200k", label: "$150,000-$199,999" },
            { value: "200k+", label: "$200,000+" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("income", value)}
              disabled={getFilterDisabledState("income")}
              className={cn(
                "p-2 text-sm rounded-lg border-2 transition-colors",
                isFilterSelected("income", value)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("income") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHouseholdSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Housing Status</h3>
        <div className="grid grid-cols-3 gap-2">
          {["own", "rent", "other"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange("housing", status)}
              disabled={getFilterDisabledState("housing")}
              className={cn(
                "p-2 rounded-lg border-2 transition-colors",
                isFilterSelected("housing", status)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("housing") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Children in Household</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "yes", label: "Has Children" },
            { value: "no", label: "No Children" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("children", value)}
              disabled={getFilterDisabledState("children")}
              className={cn(
                "p-2 rounded-lg border-2 transition-colors",
                isFilterSelected("children", value)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("children") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Marital Status</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "married", label: "Married" },
            { value: "single", label: "Single" },
            { value: "divorced", label: "Divorced" },
            { value: "widowed", label: "Widowed" },
            { value: "separated", label: "Separated" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("maritalStatus", value)}
              disabled={getFilterDisabledState("maritalStatus")}
              className={cn(
                "p-2 rounded-lg border-2 transition-colors",
                isFilterSelected("maritalStatus", value)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("maritalStatus") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBeliefsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Political Affiliation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {["democrat", "republican", "independent", "other"].map(
            (affiliation) => (
              <button
                key={affiliation}
                onClick={() =>
                  handleFilterChange("politicalAffiliation", affiliation)
                }
                disabled={getFilterDisabledState("politicalAffiliation")}
                className={cn(
                  "p-2 text-sm rounded-lg border-2 transition-colors",
                  isFilterSelected("politicalAffiliation", affiliation)
                    ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                    : "border-muted hover:border-[var(--brand-blue)]/50",
                  getFilterDisabledState("politicalAffiliation") &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                {affiliation.charAt(0).toUpperCase() + affiliation.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Religious Affiliation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {["protestant", "catholic", "jewish", "muslim", "other", "none"].map(
            (affiliation) => (
              <button
                key={affiliation}
                onClick={() =>
                  handleFilterChange("religiousAffiliation", affiliation)
                }
                disabled={getFilterDisabledState("religiousAffiliation")}
                className={cn(
                  "p-2 text-sm rounded-lg border-2 transition-colors",
                  isFilterSelected("religiousAffiliation", affiliation)
                    ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                    : "border-muted hover:border-[var(--brand-blue)]/50",
                  getFilterDisabledState("religiousAffiliation") &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                {affiliation.charAt(0).toUpperCase() + affiliation.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Sexual Orientation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { value: "straight", label: "Straight/Heterosexual" },
            { value: "gay", label: "Gay/Lesbian" },
            { value: "bisexual", label: "Bisexual" },
            { value: "other", label: "Other" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange("sexualOrientation", value)}
              disabled={getFilterDisabledState("sexualOrientation")}
              className={cn(
                "p-2 text-sm rounded-lg border-2 transition-colors",
                isFilterSelected("sexualOrientation", value)
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                  : "border-muted hover:border-[var(--brand-blue)]/50",
                getFilterDisabledState("sexualOrientation") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "survey-type":
        return renderSurveyTypeSection();
      case "location":
        return renderLocationSection();
      case "demographics":
        return renderDemographicsSection();
      case "household":
        return renderHouseholdSection();
      case "beliefs":
        return renderBeliefsSection();
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <Button
              variant="outline"
              size="default"
              className="gap-2 px-4 py-2 h-auto"
            >
              <Filter className="h-5 w-5" />
              <span className="text-base">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <span className="absolute -bottom-3.5 left-0 text-[10px] text-blue-500 whitespace-nowrap">
              {totalResponses} total responses
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="!w-[95vw] sm:!w-[80vw] !h-[90vh] !max-w-[95vw] sm:!max-w-[80vw] !max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="flex-none bg-background border-b p-4">
            <DialogTitle>Filter Responses</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r p-4 space-y-2 overflow-y-auto">
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible justify-center sm:justify-start">
                {FILTER_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex-none sm:flex-1 p-3 rounded-lg text-left transition-colors",
                      activeSection === section.id
                        ? "bg-[var(--brand-blue)] text-white"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5" />
                      <span className="font-medium hidden sm:inline">
                        {section.title}
                      </span>
                    </div>
                    <p className="text-sm mt-1 opacity-80 hidden sm:block">
                      {section.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {renderActiveSection()}
            </div>
          </div>

          <div className="flex-none bg-background border-t p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
                className="w-full sm:w-auto"
              >
                Clear All
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={applyFilters}
                className="w-full sm:w-auto"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const label = getFilterLabel(
              key as keyof DemographicFiltersState,
              value
            );
            return (
              label && (
                <Badge key={key} variant="secondary" className="gap-1">
                  {label}
                  <button
                    onClick={() =>
                      removeFilter(key as keyof DemographicFiltersState)
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            );
          })}
        </div>
      )}
    </div>
  );
}
