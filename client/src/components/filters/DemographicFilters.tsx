import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  X,
  Filter,
  ChevronDown,
  ChevronUp,
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

interface DemographicFiltersProps {
  onFilterChange: (filters: DemographicFiltersState) => void;
  totalResponses: number;
  surveyType: SurveyType;
  onSurveyTypeChange: (type: SurveyType) => void;
}

export type SurveyType = "formal" | "public" | "merged";

export interface DemographicFiltersState {
  ageMin?: number;
  ageMax?: number;
  Q100?: {
    gte: number;
    lte: number;
  };
  income?: string;
  gender?: string;
  ethnicity?: string;
  education?: string;
  employment?: string;
  housing?: string;
  maritalStatus?: string;
  children?: string;
  politicalAffiliation?: string;
  religiousAffiliation?: string;
  sexualOrientation?: string;
  district?: string;
  region?: string;
  area?: string;
  neighborhood?: string;
  districts?: string[];
}

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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    location: false,
    demographics: false,
    household: false,
    beliefs: false,
  });
  const [selectedLocationType, setSelectedLocationType] = useState<
    "district" | "region" | "area" | "neighborhood"
  >("district");
  const [pendingSurveyType, setPendingSurveyType] =
    useState<SurveyType>(surveyType);

  // Function to get the disabled state for a filter
  const getFilterDisabledState = (
    filterKey: keyof DemographicFiltersState
  ): boolean => {
    switch (surveyType) {
      case "formal":
        return false;
      case "public":
        return ![
          "ageMin",
          "ageMax",
          "gender",
          "ethnicity",
          "education",
          "district",
          "region",
          "area",
          "neighborhood",
          "housing",
          "children",
          "maritalStatus",
          "politicalAffiliation",
          "religiousAffiliation",
          "sexualOrientation",
        ].includes(filterKey);
      case "merged":
        return ![
          "ageMin",
          "ageMax",
          "gender",
          "ethnicity",
          "education",
          "district",
          "region",
          "area",
          "neighborhood",
          "housing",
          "children",
          "maritalStatus",
          "politicalAffiliation",
          "religiousAffiliation",
          "sexualOrientation",
        ].includes(filterKey);
      default:
        return true;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (
    key: keyof DemographicFiltersState,
    value: string | number
  ) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDistrictSelect = (district: string) => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      // Clear all other location filters first
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

  const handleLocationChange = (
    type: "district" | "region" | "area" | "neighborhood",
    value: string
  ) => {
    if (type === "district") {
      handleDistrictSelect(value);
      return;
    }

    // Clear all location filters and set only the selected one
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      // Clear all location-related filters
      delete newFilters.district;
      delete newFilters.region;
      delete newFilters.area;
      delete newFilters.neighborhood;
      delete newFilters.districts;
      // Set the new location filter
      newFilters[type] = value;
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

  const applyFilters = () => {
    // Create a new filters object for the API
    const apiFilters: Record<string, any> = {};

    // Handle age range filter
    if (
      pendingFilters.ageMin !== undefined ||
      pendingFilters.ageMax !== undefined
    ) {
      apiFilters.Q100 = {
        gte: Number(pendingFilters.ageMin) || 0,
        lte: Number(pendingFilters.ageMax) || 90,
      };
    }

    // Copy other filters
    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (key !== "ageMin" && key !== "ageMax" && value !== undefined) {
        apiFilters[key] = value;
      }
    });

    // Log the filters being sent to the API
    console.log("Applying filters:", apiFilters);

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

    // Create a new filters object for the API
    const apiFilters: Record<string, any> = {};

    // Handle age range filter
    if (newFilters.ageMin !== undefined || newFilters.ageMax !== undefined) {
      apiFilters.Q100 = {
        gte: Number(newFilters.ageMin) || 0,
        lte: Number(newFilters.ageMax) || 90,
      };
    }

    // Copy other filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key !== "ageMin" && key !== "ageMax" && value !== undefined) {
        apiFilters[key] = value;
      }
    });

    // Log the filters being sent to the API
    console.log("Removing filter, new filters:", apiFilters);

    onFilterChange(apiFilters);
  };

  const getFilterLabel = (
    key: keyof DemographicFiltersState,
    value: string | string[] | number
  ) => {
    // Don't show age filter if it's at default values
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
    };

    let displayValue = value;
    if (Array.isArray(value)) {
      displayValue = value.join(", ");
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

    return `${labels[key]}: ${displayValue}`;
  };

  const activeFiltersCount = Object.keys(activeFilters).filter((key) => {
    // Don't count age filters if they're at default values
    if (key === "ageMin" && activeFilters[key] === 0) return false;
    if (key === "ageMax" && activeFilters[key] === 90) return false;

    // Only count one location filter at a time
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

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    section: string,
    content: React.ReactNode
  ) => (
    <div className="space-y-2">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="pl-6 space-y-4">{content}</div>
      )}
    </div>
  );

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
        <DialogContent className="!w-[95vw] sm:!w-[65vw] !h-[80vh] !max-w-[95vw] sm:!max-w-[65vw] !max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-none bg-background border-b pb-4">
            <DialogTitle>Filter Responses</DialogTitle>
            <DialogDescription>
              Filter survey responses by demographic information and location.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6 py-4">
              {/* Survey Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Survey Type</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative group flex-1">
                    <Button
                      variant={
                        pendingSurveyType === "formal" ? "default" : "outline"
                      }
                      className={`w-full gap-2 ${
                        pendingSurveyType === "formal"
                          ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                          : ""
                      }`}
                      onClick={() => setPendingSurveyType("formal")}
                    >
                      <ClipboardList className="h-4 w-4" />
                      Formal
                    </Button>
                    <div className="absolute hidden group-hover:block z-50 w-64 p-3 mt-1 bg-background text-foreground rounded-md shadow-md border border-border">
                      <p className="font-medium text-blue-500">Formal Survey</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        In-depth survey with detailed questions, but limited to
                        targeted outreach. Captures more demographic and
                        detailed responses, but from fewer participants.
                      </p>
                    </div>
                  </div>
                  <div className="relative group flex-1">
                    <Button
                      variant={
                        pendingSurveyType === "public" ? "default" : "outline"
                      }
                      className={`w-full gap-2 ${
                        pendingSurveyType === "public"
                          ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                          : ""
                      }`}
                      onClick={() => setPendingSurveyType("public")}
                    >
                      <Globe className="h-4 w-4" />
                      Public
                    </Button>
                    <div className="absolute hidden group-hover:block z-50 w-64 p-3 mt-1 bg-background text-foreground rounded-md shadow-md border border-border">
                      <p className="font-medium text-blue-500">Public Survey</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Open survey with basic questions, available to all
                        community members. Captures fewer data points but from a
                        much larger and more diverse group of participants.
                      </p>
                    </div>
                  </div>
                  <div className="relative group flex-1">
                    <Button
                      variant={
                        pendingSurveyType === "merged" ? "default" : "outline"
                      }
                      className={`w-full gap-2 ${
                        pendingSurveyType === "merged"
                          ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                          : ""
                      }`}
                      onClick={() => setPendingSurveyType("merged")}
                    >
                      <Merge className="h-4 w-4" />
                      Merged
                    </Button>
                    <div className="absolute hidden group-hover:block z-50 w-64 p-3 mt-1 bg-background text-foreground rounded-md shadow-md border border-border">
                      <p className="font-medium text-blue-500">Merged Survey</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Combines both survey types, using only questions common
                        to both. Provides the largest dataset but excludes
                        detailed questions unique to the formal survey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Range Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Age Range</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
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
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Min age"
                    />
                  </div>
                  <div className="flex-1">
                    <input
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
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Max age"
                    />
                  </div>
                </div>
                <Slider
                  min={0}
                  max={90}
                  value={[
                    pendingFilters.ageMin ?? 0,
                    pendingFilters.ageMax ?? 90,
                  ]}
                  onValueChange={handleAgeRangeChange}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-[var(--brand-blue)] [&_[role=slider]]:border-[var(--brand-blue)]"
                  disabled={getFilterDisabledState("ageMin")}
                />
              </div>

              {/* Location Section */}
              {renderSection(
                "Location",
                <MapPin className="h-5 w-5 text-gray-600" />,
                "location",
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setSelectedLocationType("district")}
                      disabled={getFilterDisabledState("district")}
                      className={`flex-1 w-full sm:w-auto py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "district"
                          ? "bg-[var(--brand-blue)] text-white shadow-sm"
                          : "hover:bg-background/50"
                      } ${
                        getFilterDisabledState("district")
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      District
                    </button>
                    <button
                      onClick={() => setSelectedLocationType("region")}
                      disabled={getFilterDisabledState("region")}
                      className={`flex-1 w-full sm:w-auto py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "region"
                          ? "bg-[var(--brand-blue)] text-white shadow-sm"
                          : "hover:bg-background/50"
                      } ${
                        getFilterDisabledState("region")
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Region
                    </button>
                    <button
                      onClick={() => setSelectedLocationType("area")}
                      disabled={getFilterDisabledState("area")}
                      className={`flex-1 w-full sm:w-auto py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "area"
                          ? "bg-[var(--brand-blue)] text-white shadow-sm"
                          : "hover:bg-background/50"
                      } ${
                        getFilterDisabledState("area")
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setSelectedLocationType("neighborhood")}
                      disabled={getFilterDisabledState("neighborhood")}
                      className={`flex-1 w-full sm:w-auto py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "neighborhood"
                          ? "bg-[var(--brand-blue)] text-white shadow-sm"
                          : "hover:bg-background/50"
                      } ${
                        getFilterDisabledState("neighborhood")
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Neighborhood
                    </button>
                  </div>

                  <div className="mt-4">
                    {selectedLocationType === "district" && (
                      <>
                        <DistrictMap
                          selectedDistricts={pendingFilters.districts || []}
                          onDistrictSelect={handleDistrictSelect}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                          {Object.keys(DISTRICT_DATA).map((district) => (
                            <button
                              key={district}
                              onClick={() => handleDistrictSelect(district)}
                              disabled={getFilterDisabledState("district")}
                              className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                                pendingFilters.districts?.includes(district)
                                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                                  : "border-muted hover:border-[var(--brand-blue)]/50"
                              } ${
                                getFilterDisabledState("district")
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {district}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {selectedLocationType === "region" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {REGION_DATA.map((region) => (
                          <button
                            key={region.id}
                            onClick={() =>
                              handleLocationChange("region", region.value)
                            }
                            disabled={getFilterDisabledState("region")}
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.region === region.value
                                ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                                : "border-muted hover:border-[var(--brand-blue)]/50"
                            } ${
                              getFilterDisabledState("region")
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {region.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedLocationType === "area" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {AREA_DATA.map((area) => (
                          <button
                            key={area.id}
                            onClick={() =>
                              handleLocationChange("area", area.value)
                            }
                            disabled={getFilterDisabledState("area")}
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.area === area.value
                                ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                                : "border-muted hover:border-[var(--brand-blue)]/50"
                            } ${
                              getFilterDisabledState("area")
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {area.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedLocationType === "neighborhood" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {NEIGHBORHOOD_DATA.map((neighborhood) => (
                          <button
                            key={neighborhood.id}
                            onClick={() =>
                              handleLocationChange(
                                "neighborhood",
                                neighborhood.value
                              )
                            }
                            disabled={getFilterDisabledState("neighborhood")}
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.neighborhood === neighborhood.value
                                ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                                : "border-muted hover:border-[var(--brand-blue)]/50"
                            } ${
                              getFilterDisabledState("neighborhood")
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {neighborhood.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Demographics Section */}
              {renderSection(
                "Demographics",
                <Users className="h-5 w-5 text-gray-600" />,
                "demographics",
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Gender</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Button
                        variant={
                          pendingFilters.gender === "male"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.gender === "male"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("gender", "male")}
                        disabled={getFilterDisabledState("gender")}
                      >
                        Male
                      </Button>
                      <Button
                        variant={
                          pendingFilters.gender === "female"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.gender === "female"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("gender", "female")}
                        disabled={getFilterDisabledState("gender")}
                      >
                        Female
                      </Button>
                      <Button
                        variant={
                          pendingFilters.gender === "other"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.gender === "other"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("gender", "other")}
                        disabled={getFilterDisabledState("gender")}
                      >
                        Other
                      </Button>
                      <Button
                        variant={
                          pendingFilters.gender === "prefer-not"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.gender === "prefer-not"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("gender", "prefer-not")
                        }
                        disabled={getFilterDisabledState("gender")}
                      >
                        Prefer not to say
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Race/Ethnicity
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Button
                        variant={
                          pendingFilters.ethnicity === "3"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.ethnicity === "3"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("ethnicity", "3")}
                        disabled={getFilterDisabledState("ethnicity")}
                      >
                        White
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "4"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.ethnicity === "4"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("ethnicity", "4")}
                        disabled={getFilterDisabledState("ethnicity")}
                      >
                        Black
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "5"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.ethnicity === "5"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("ethnicity", "5")}
                        disabled={getFilterDisabledState("ethnicity")}
                      >
                        Asian/Pacific
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "1"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.ethnicity === "1"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("ethnicity", "1")}
                        disabled={getFilterDisabledState("ethnicity")}
                      >
                        Hispanic
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "2"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.ethnicity === "2"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("ethnicity", "2")}
                        disabled={getFilterDisabledState("ethnicity")}
                      >
                        Kurdish
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "6"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.ethnicity === "6"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("ethnicity", "6")}
                        disabled={getFilterDisabledState("ethnicity")}
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Education Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="high-school"
                          name="education"
                          checked={pendingFilters.education === "high-school"}
                          onChange={() =>
                            handleFilterChange("education", "high-school")
                          }
                          disabled={getFilterDisabledState("education")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="high-school">High School/GED</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="some-college"
                          name="education"
                          checked={pendingFilters.education === "some-college"}
                          onChange={() =>
                            handleFilterChange("education", "some-college")
                          }
                          disabled={getFilterDisabledState("education")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="some-college">Some College</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="bachelors"
                          name="education"
                          checked={pendingFilters.education === "bachelors"}
                          onChange={() =>
                            handleFilterChange("education", "bachelors")
                          }
                          disabled={getFilterDisabledState("education")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="bachelors">Bachelor's Degree</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="masters"
                          name="education"
                          checked={pendingFilters.education === "masters"}
                          onChange={() =>
                            handleFilterChange("education", "masters")
                          }
                          disabled={getFilterDisabledState("education")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="masters">Master's Degree</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="doctorate"
                          name="education"
                          checked={pendingFilters.education === "doctorate"}
                          onChange={() =>
                            handleFilterChange("education", "doctorate")
                          }
                          disabled={getFilterDisabledState("education")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="doctorate">Doctorate</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Income Range</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="under-15k"
                          name="income"
                          checked={pendingFilters.income === "under-15k"}
                          onChange={() =>
                            handleFilterChange("income", "under-15k")
                          }
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="under-15k">Under $15,000</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="15k-25k"
                          name="income"
                          checked={pendingFilters.income === "15k-25k"}
                          onChange={() =>
                            handleFilterChange("income", "15k-25k")
                          }
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="15k-25k">$15,000-$24,999</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="25k-50k"
                          name="income"
                          checked={pendingFilters.income === "25k-50k"}
                          onChange={() =>
                            handleFilterChange("income", "25k-50k")
                          }
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="25k-50k">$25,000-$49,999</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="50k-100k"
                          name="income"
                          checked={pendingFilters.income === "50k-100k"}
                          onChange={() =>
                            handleFilterChange("income", "50k-100k")
                          }
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="50k-100k">$50,000-$99,999</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="100k-150k"
                          name="income"
                          checked={pendingFilters.income === "100k-150k"}
                          onChange={() =>
                            handleFilterChange("income", "100k-150k")
                          }
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="100k-150k">$100,000-$149,999</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="150k-200k"
                          name="income"
                          checked={pendingFilters.income === "150k-200k"}
                          onChange={() =>
                            handleFilterChange("income", "150k-200k")
                          }
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="150k-200k">$150,000-$199,999</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="200k+"
                          name="income"
                          checked={pendingFilters.income === "200k+"}
                          onChange={() => handleFilterChange("income", "200k+")}
                          disabled={getFilterDisabledState("income")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="200k+">$200,000+</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Household Section */}
              {renderSection(
                "Household",
                <Home className="h-5 w-5 text-gray-600" />,
                "household",
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Housing Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.housing === "own"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.housing === "own"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("housing", "own")}
                        disabled={getFilterDisabledState("housing")}
                      >
                        Own
                      </Button>
                      <Button
                        variant={
                          pendingFilters.housing === "rent"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.housing === "rent"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("housing", "rent")}
                        disabled={getFilterDisabledState("housing")}
                      >
                        Rent
                      </Button>
                      <Button
                        variant={
                          pendingFilters.housing === "other"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.housing === "other"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("housing", "other")}
                        disabled={getFilterDisabledState("housing")}
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Children in Household
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.children === "yes"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.children === "yes"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("children", "yes")}
                        disabled={getFilterDisabledState("children")}
                      >
                        Has Children
                      </Button>
                      <Button
                        variant={
                          pendingFilters.children === "no"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.children === "no"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() => handleFilterChange("children", "no")}
                        disabled={getFilterDisabledState("children")}
                      >
                        No Children
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Marital Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "married"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.maritalStatus === "married"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("maritalStatus", "married")
                        }
                        disabled={getFilterDisabledState("maritalStatus")}
                      >
                        Married
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "single"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.maritalStatus === "single"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("maritalStatus", "single")
                        }
                        disabled={getFilterDisabledState("maritalStatus")}
                      >
                        Single
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "divorced"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.maritalStatus === "divorced"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("maritalStatus", "divorced")
                        }
                        disabled={getFilterDisabledState("maritalStatus")}
                      >
                        Divorced
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "widowed"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.maritalStatus === "widowed"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("maritalStatus", "widowed")
                        }
                        disabled={getFilterDisabledState("maritalStatus")}
                      >
                        Widowed
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "separated"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.maritalStatus === "separated"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("maritalStatus", "separated")
                        }
                        disabled={getFilterDisabledState("maritalStatus")}
                      >
                        Separated
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Beliefs Section */}
              {renderSection(
                "Beliefs & Identity",
                <Heart className="h-5 w-5 text-gray-600" />,
                "beliefs",
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Political Affiliation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "democrat"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.politicalAffiliation === "democrat"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("politicalAffiliation", "democrat")
                        }
                        disabled={getFilterDisabledState(
                          "politicalAffiliation"
                        )}
                      >
                        Democrat
                      </Button>
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "republican"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.politicalAffiliation === "republican"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange(
                            "politicalAffiliation",
                            "republican"
                          )
                        }
                        disabled={getFilterDisabledState(
                          "politicalAffiliation"
                        )}
                      >
                        Republican
                      </Button>
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "independent"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.politicalAffiliation === "independent"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange(
                            "politicalAffiliation",
                            "independent"
                          )
                        }
                        disabled={getFilterDisabledState(
                          "politicalAffiliation"
                        )}
                      >
                        Independent
                      </Button>
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "other"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.politicalAffiliation === "other"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("politicalAffiliation", "other")
                        }
                        disabled={getFilterDisabledState(
                          "politicalAffiliation"
                        )}
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Religious Affiliation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "protestant"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.religiousAffiliation === "protestant"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange(
                            "religiousAffiliation",
                            "protestant"
                          )
                        }
                        disabled={getFilterDisabledState(
                          "religiousAffiliation"
                        )}
                      >
                        Protestant
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "catholic"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.religiousAffiliation === "catholic"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "catholic")
                        }
                        disabled={getFilterDisabledState(
                          "religiousAffiliation"
                        )}
                      >
                        Catholic
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "jewish"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.religiousAffiliation === "jewish"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "jewish")
                        }
                        disabled={getFilterDisabledState(
                          "religiousAffiliation"
                        )}
                      >
                        Jewish
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "muslim"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.religiousAffiliation === "muslim"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "muslim")
                        }
                        disabled={getFilterDisabledState(
                          "religiousAffiliation"
                        )}
                      >
                        Muslim
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "other"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.religiousAffiliation === "other"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "other")
                        }
                        disabled={getFilterDisabledState(
                          "religiousAffiliation"
                        )}
                      >
                        Other
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "none"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.religiousAffiliation === "none"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "none")
                        }
                        disabled={getFilterDisabledState(
                          "religiousAffiliation"
                        )}
                      >
                        None
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Sexual Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "straight"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.sexualOrientation === "straight"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "straight")
                        }
                        disabled={getFilterDisabledState("sexualOrientation")}
                      >
                        Straight/Heterosexual
                      </Button>
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "gay"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.sexualOrientation === "gay"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "gay")
                        }
                        disabled={getFilterDisabledState("sexualOrientation")}
                      >
                        Gay/Lesbian
                      </Button>
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "bisexual"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.sexualOrientation === "bisexual"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "bisexual")
                        }
                        disabled={getFilterDisabledState("sexualOrientation")}
                      >
                        Bisexual
                      </Button>
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "other"
                            ? "default"
                            : "outline"
                        }
                        className={`w-full ${
                          pendingFilters.sexualOrientation === "other"
                            ? "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "other")
                        }
                        disabled={getFilterDisabledState("sexualOrientation")}
                      >
                        Other
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-none bg-background border-t pt-4 px-4 sm:px-6 pb-6">
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
