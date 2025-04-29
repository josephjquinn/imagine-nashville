import React, { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DISTRICT_DATA } from "@/data/districtData";
import { REGION_DATA, AREA_DATA, NEIGHBORHOOD_DATA } from "@/data/locationData";

interface DemographicFiltersProps {
  onFilterChange: (filters: DemographicFiltersState) => void;
  totalResponses: number;
  surveyType: SurveyType;
  onSurveyTypeChange: (type: SurveyType) => void;
}

export type SurveyType = "formal" | "public" | "merged";

export interface DemographicFiltersState {
  ageMin?: string;
  ageMax?: string;
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
}

export function DemographicFilters({
  onFilterChange,
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (
    key: keyof DemographicFiltersState,
    value: string
  ) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (
    type: "district" | "region" | "area" | "neighborhood",
    value: string
  ) => {
    // Clear other location types when selecting a new one
    const newFilters = {
      ...pendingFilters,
      district: type === "district" ? value : undefined,
      region: type === "region" ? value : undefined,
      area: type === "area" ? value : undefined,
      neighborhood: type === "neighborhood" ? value : undefined,
    };
    setPendingFilters(newFilters);
  };

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    onFilterChange(pendingFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPendingFilters({});
    setActiveFilters({});
    onFilterChange({});
  };

  const removeFilter = (key: keyof DemographicFiltersState) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    setPendingFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getFilterLabel = (
    key: keyof DemographicFiltersState,
    value: string
  ) => {
    const labels: Record<string, string> = {
      ageMin: "Age Min",
      ageMax: "Age Max",
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
    };

    let displayValue = value;
    if (key === "region") {
      const region = REGION_DATA.find((r) => r.value === value);
      if (region) displayValue = region.label;
    } else if (key === "area") {
      const area = AREA_DATA.find((a) => a.value === value);
      if (area) displayValue = area.label;
    } else if (key === "neighborhood") {
      const neighborhood = NEIGHBORHOOD_DATA.find((n) => n.value === value);
      if (neighborhood) displayValue = neighborhood.label;
    }

    return `${labels[key]}: ${displayValue}`;
  };

  const activeFiltersCount = Object.keys(activeFilters).filter((key) => {
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
        </DialogTrigger>
        <DialogContent className="!w-[65vw] !h-[80vh] !max-w-[65vw] !max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-none bg-background border-b pb-4">
            <DialogTitle>Filter Responses</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 py-4">
              {/* Survey Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Survey Type</label>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            surveyType === "formal" ? "default" : "outline"
                          }
                          className="flex-1 gap-2"
                          onClick={() => onSurveyTypeChange("formal")}
                        >
                          <ClipboardList className="h-4 w-4" />
                          Formal
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Formal survey responses</p>
                        <p className="text-xs text-muted-foreground">
                          Structured, in-depth responses from targeted outreach
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            surveyType === "public" ? "default" : "outline"
                          }
                          className="flex-1 gap-2"
                          onClick={() => onSurveyTypeChange("public")}
                        >
                          <Globe className="h-4 w-4" />
                          Public
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Public survey responses</p>
                        <p className="text-xs text-muted-foreground">
                          Open responses from community members
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            surveyType === "merged" ? "default" : "outline"
                          }
                          className="flex-1 gap-2"
                          onClick={() => onSurveyTypeChange("merged")}
                        >
                          <Merge className="h-4 w-4" />
                          Merged
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Combined survey responses</p>
                        <p className="text-xs text-muted-foreground">
                          All responses from both formal and public surveys
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Location Section */}
              {renderSection(
                "Location",
                <MapPin className="h-5 w-5 text-gray-600" />,
                "location",
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setSelectedLocationType("district")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "district"
                          ? "bg-background shadow-sm"
                          : "hover:bg-background/50"
                      }`}
                    >
                      District
                    </button>
                    <button
                      onClick={() => setSelectedLocationType("region")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "region"
                          ? "bg-background shadow-sm"
                          : "hover:bg-background/50"
                      }`}
                    >
                      Region
                    </button>
                    <button
                      onClick={() => setSelectedLocationType("area")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "area"
                          ? "bg-background shadow-sm"
                          : "hover:bg-background/50"
                      }`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setSelectedLocationType("neighborhood")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        selectedLocationType === "neighborhood"
                          ? "bg-background shadow-sm"
                          : "hover:bg-background/50"
                      }`}
                    >
                      Neighborhood
                    </button>
                  </div>

                  <div className="mt-4">
                    {selectedLocationType === "district" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {Object.keys(DISTRICT_DATA).map((district) => (
                          <button
                            key={district}
                            onClick={() =>
                              handleLocationChange("district", district)
                            }
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.district === district
                                ? "bg-black text-white border-black"
                                : "border-muted hover:border-black/50"
                            }`}
                          >
                            {district}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedLocationType === "region" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {REGION_DATA.map((region) => (
                          <button
                            key={region.id}
                            onClick={() =>
                              handleLocationChange("region", region.value)
                            }
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.region === region.value
                                ? "bg-black text-white border-black"
                                : "border-muted hover:border-black/50"
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
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.area === area.value
                                ? "bg-black text-white border-black"
                                : "border-muted hover:border-black/50"
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
                            className={`p-2 text-sm rounded-lg border transition-colors whitespace-normal break-words ${
                              pendingFilters.neighborhood === neighborhood.value
                                ? "bg-black text-white border-black"
                                : "border-muted hover:border-black/50"
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
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.gender === "male"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("gender", "male")}
                      >
                        Male
                      </Button>
                      <Button
                        variant={
                          pendingFilters.gender === "female"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("gender", "female")}
                      >
                        Female
                      </Button>
                      <Button
                        variant={
                          pendingFilters.gender === "other"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("gender", "other")}
                      >
                        Other
                      </Button>
                      <Button
                        variant={
                          pendingFilters.gender === "prefer-not"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("gender", "prefer-not")
                        }
                      >
                        Prefer not to say
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Race/Ethnicity
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          pendingFilters.ethnicity === "white"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("ethnicity", "white")}
                      >
                        White
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "black"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("ethnicity", "black")}
                      >
                        Black
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "asian"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("ethnicity", "asian")}
                      >
                        Asian
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "hispanic"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("ethnicity", "hispanic")
                        }
                      >
                        Hispanic
                      </Button>
                      <Button
                        variant={
                          pendingFilters.ethnicity === "other"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("ethnicity", "other")}
                      >
                        Other
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      Education Level
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="high-school"
                          name="education"
                          checked={pendingFilters.education === "high-school"}
                          onChange={() =>
                            handleFilterChange("education", "high-school")
                          }
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
                          className="h-4 w-4"
                        />
                        <label htmlFor="doctorate">Doctorate</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Income Range</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="under-15k"
                          name="income"
                          checked={pendingFilters.income === "under-15k"}
                          onChange={() =>
                            handleFilterChange("income", "under-15k")
                          }
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
                        className="w-full"
                        onClick={() => handleFilterChange("housing", "own")}
                      >
                        Own
                      </Button>
                      <Button
                        variant={
                          pendingFilters.housing === "rent"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("housing", "rent")}
                      >
                        Rent
                      </Button>
                      <Button
                        variant={
                          pendingFilters.housing === "other"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("housing", "other")}
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
                        className="w-full"
                        onClick={() => handleFilterChange("children", "yes")}
                      >
                        Has Children
                      </Button>
                      <Button
                        variant={
                          pendingFilters.children === "no"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() => handleFilterChange("children", "no")}
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
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("maritalStatus", "married")
                        }
                      >
                        Married
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "single"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("maritalStatus", "single")
                        }
                      >
                        Single
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "divorced"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("maritalStatus", "divorced")
                        }
                      >
                        Divorced
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "widowed"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("maritalStatus", "widowed")
                        }
                      >
                        Widowed
                      </Button>
                      <Button
                        variant={
                          pendingFilters.maritalStatus === "separated"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("maritalStatus", "separated")
                        }
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
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("politicalAffiliation", "democrat")
                        }
                      >
                        Democrat
                      </Button>
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "republican"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange(
                            "politicalAffiliation",
                            "republican"
                          )
                        }
                      >
                        Republican
                      </Button>
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "independent"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange(
                            "politicalAffiliation",
                            "independent"
                          )
                        }
                      >
                        Independent
                      </Button>
                      <Button
                        variant={
                          pendingFilters.politicalAffiliation === "other"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("politicalAffiliation", "other")
                        }
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
                        className="w-full"
                        onClick={() =>
                          handleFilterChange(
                            "religiousAffiliation",
                            "protestant"
                          )
                        }
                      >
                        Protestant
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "catholic"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "catholic")
                        }
                      >
                        Catholic
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "jewish"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "jewish")
                        }
                      >
                        Jewish
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "muslim"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "muslim")
                        }
                      >
                        Muslim
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "other"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "other")
                        }
                      >
                        Other
                      </Button>
                      <Button
                        variant={
                          pendingFilters.religiousAffiliation === "none"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("religiousAffiliation", "none")
                        }
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
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "straight")
                        }
                      >
                        Straight/Heterosexual
                      </Button>
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "gay"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "gay")
                        }
                      >
                        Gay/Lesbian
                      </Button>
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "bisexual"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "bisexual")
                        }
                      >
                        Bisexual
                      </Button>
                      <Button
                        variant={
                          pendingFilters.sexualOrientation === "other"
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                        onClick={() =>
                          handleFilterChange("sexualOrientation", "other")
                        }
                      >
                        Other
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Age Range Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Age Range</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={pendingFilters.ageMin || ""}
                      onChange={(e) =>
                        handleFilterChange("ageMin", e.target.value)
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Min age"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={pendingFilters.ageMax || ""}
                      onChange={(e) =>
                        handleFilterChange("ageMax", e.target.value)
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Max age"
                    />
                  </div>
                </div>
                <Slider
                  min={0}
                  max={120}
                  value={[
                    pendingFilters.ageMin ? Number(pendingFilters.ageMin) : 0,
                    pendingFilters.ageMax ? Number(pendingFilters.ageMax) : 120,
                  ]}
                  onValueChange={([min, max]: [number, number]) => {
                    handleFilterChange("ageMin", min.toString());
                    handleFilterChange("ageMax", max.toString());
                  }}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex-none bg-background border-t pt-4 px-6 pb-6">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                Clear All
              </Button>
              <Button variant="default" size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(activeFilters).map(
            ([key, value]) =>
              value && (
                <Badge key={key} variant="secondary" className="gap-1">
                  {getFilterLabel(key as keyof DemographicFiltersState, value)}
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
          )}
        </div>
      )}
    </div>
  );
}
