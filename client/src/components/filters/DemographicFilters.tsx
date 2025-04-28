import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Filter } from "lucide-react";
import { DISTRICT_DATA } from "@/data/districtData";

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
}

export function DemographicFilters({
  onFilterChange,
  surveyType,
  onSurveyTypeChange,
}: DemographicFiltersProps) {
  const [pendingFilters, setPendingFilters] =
    React.useState<DemographicFiltersState>({});
  const [activeFilters, setActiveFilters] =
    React.useState<DemographicFiltersState>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof DemographicFiltersState,
    value: string
  ) => {
    if (key === "district") {
      // When district changes, update the filter with the district value
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    } else {
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const applyFilters = () => {
    // Create a copy of the pending filters
    const finalFilters = { ...pendingFilters };

    // If there's a district filter, we'll handle it specially in the data processing
    // The actual filtering by ZIP code will happen in the data processing layer
    // using the Q113 column and the district-to-ZIP mapping

    setActiveFilters(finalFilters);
    onFilterChange(finalFilters);
  };

  const clearFilters = () => {
    const emptyFilters: DemographicFiltersState = {};
    setPendingFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    onFilterChange(emptyFilters);
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
    };
    return `${labels[key]}: ${value}`;
  };

  const activeFiltersCount = Object.keys(activeFilters).length;

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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filter Responses</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Survey Type
            </label>
            <Select
              value={surveyType}
              onValueChange={(value) => onSurveyTypeChange(value as SurveyType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select survey type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal Survey</SelectItem>
                <SelectItem value="public">Public Survey</SelectItem>
                <SelectItem value="merged">Merged Survey</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select
                value={pendingFilters.district}
                onValueChange={(value) => handleFilterChange("district", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(DISTRICT_DATA).map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select
                value={pendingFilters.gender}
                onValueChange={(value) => handleFilterChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Race</label>
              <Select
                value={pendingFilters.ethnicity}
                onValueChange={(value) =>
                  handleFilterChange("ethnicity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select race" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="hispanic">Hispanic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Education Level</label>
              <Select
                value={pendingFilters.education}
                onValueChange={(value) =>
                  handleFilterChange("education", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School/GED</SelectItem>
                  <SelectItem value="some-college">Some College</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Income Range</label>
              <Select
                value={pendingFilters.income}
                onValueChange={(value) => handleFilterChange("income", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-15k">Under $15,000</SelectItem>
                  <SelectItem value="15k-25k">$15,000-$24,999</SelectItem>
                  <SelectItem value="25k-50k">$25,000-$49,999</SelectItem>
                  <SelectItem value="50k-100k">$50,000-$99,999</SelectItem>
                  <SelectItem value="100k-150k">$100,000-$149,999</SelectItem>
                  <SelectItem value="150k-200k">$150,000-$199,999</SelectItem>
                  <SelectItem value="200k+">$200,000+</SelectItem>
                  <SelectItem value="prefer-not">
                    Prefer Not to Answer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Employment Status</label>
              <Select
                value={pendingFilters.employment}
                onValueChange={(value) =>
                  handleFilterChange("employment", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Housing Status</label>
              <Select
                value={pendingFilters.housing}
                onValueChange={(value) => handleFilterChange("housing", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select housing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Own</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Marital Status</label>
              <Select
                value={pendingFilters.maritalStatus}
                onValueChange={(value) =>
                  handleFilterChange("maritalStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="engaged">Engaged</SelectItem>
                  <SelectItem value="living-together">
                    Living Together
                  </SelectItem>
                  <SelectItem value="prefer-not">
                    Prefer Not to Answer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Children in Household
              </label>
              <Select
                value={pendingFilters.children}
                onValueChange={(value) => handleFilterChange("children", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select children status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Has Children</SelectItem>
                  <SelectItem value="no">No Children</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Political Affiliation
              </label>
              <Select
                value={pendingFilters.politicalAffiliation}
                onValueChange={(value) =>
                  handleFilterChange("politicalAffiliation", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select political affiliation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="democrat">Democrat</SelectItem>
                  <SelectItem value="republican">Republican</SelectItem>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Religious Affiliation
              </label>
              <Select
                value={pendingFilters.religiousAffiliation}
                onValueChange={(value) =>
                  handleFilterChange("religiousAffiliation", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religious affiliation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protestant">Protestant</SelectItem>
                  <SelectItem value="catholic">Catholic</SelectItem>
                  <SelectItem value="jewish">Jewish</SelectItem>
                  <SelectItem value="muslim">Muslim</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sexual Orientation</label>
              <Select
                value={pendingFilters.sexualOrientation}
                onValueChange={(value) =>
                  handleFilterChange("sexualOrientation", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sexual orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">
                    Straight/Heterosexual
                  </SelectItem>
                  <SelectItem value="gay">Gay/Lesbian</SelectItem>
                  <SelectItem value="bisexual">Bisexual</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-4">
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
          <div className="flex justify-between items-center mt-4">
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
