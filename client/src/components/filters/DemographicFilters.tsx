import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DemographicFiltersProps {
  onFilterChange: (filters: DemographicFiltersState) => void;
  totalResponses: number;
}

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
}

export const DemographicFilters: React.FC<DemographicFiltersProps> = ({
  onFilterChange,
  totalResponses,
}) => {
  const [pendingFilters, setPendingFilters] =
    React.useState<DemographicFiltersState>({});
  const [activeFilters, setActiveFilters] =
    React.useState<DemographicFiltersState>({});
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleFilterChange = (
    key: keyof DemographicFiltersState,
    value: string
  ) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setActiveFilters(pendingFilters);
    onFilterChange(pendingFilters);
  };

  const clearFilters = () => {
    const emptyFilters: DemographicFiltersState = {
      ageMin: undefined,
      ageMax: undefined,
      income: undefined,
      gender: undefined,
      ethnicity: undefined,
      education: undefined,
      employment: undefined,
      housing: undefined,
      maritalStatus: undefined,
      children: undefined,
      politicalAffiliation: undefined,
      religiousAffiliation: undefined,
      sexualOrientation: undefined,
    };
    setPendingFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Demographic Filters</h3>
          <p className="text-sm text-gray-500">
            {hasActiveFilters ? (
              <span className="text-blue-600 font-medium">
                {totalResponses} matching responses
              </span>
            ) : (
              <span>{totalResponses} total responses</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Age Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="120"
              placeholder="Min"
              className="w-20 px-2 py-1 border rounded"
              value={pendingFilters.ageMin || ""}
              onChange={(e) => handleFilterChange("ageMin", e.target.value)}
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              max="120"
              placeholder="Max"
              className="w-20 px-2 py-1 border rounded"
              value={pendingFilters.ageMax || ""}
              onChange={(e) => handleFilterChange("ageMax", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Gender</label>
          <Select
            value={pendingFilters.gender || ""}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Education Level</label>
          <Select
            value={pendingFilters.education || ""}
            onValueChange={(value) => handleFilterChange("education", value)}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Income Range</label>
          <Select
            value={pendingFilters.income || ""}
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
              <SelectItem value="prefer-not">Prefer Not to Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Employment Status</label>
          <Select
            value={pendingFilters.employment || ""}
            onValueChange={(value) => handleFilterChange("employment", value)}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Housing Status</label>
          <Select
            value={pendingFilters.housing || ""}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Marital Status</label>
          <Select
            value={pendingFilters.maritalStatus || ""}
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
              <SelectItem value="living-together">Living Together</SelectItem>
              <SelectItem value="prefer-not">Prefer Not to Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Children in Household</label>
          <Select
            value={pendingFilters.children || ""}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Political Affiliation</label>
          <Select
            value={pendingFilters.politicalAffiliation || ""}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Religious Affiliation</label>
          <Select
            value={pendingFilters.religiousAffiliation || ""}
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

        <div className="grid gap-2">
          <label className="text-sm font-medium">Sexual Orientation</label>
          <Select
            value={pendingFilters.sexualOrientation || ""}
            onValueChange={(value) =>
              handleFilterChange("sexualOrientation", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sexual orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="straight">Straight/Heterosexual</SelectItem>
              <SelectItem value="gay">Gay/Lesbian</SelectItem>
              <SelectItem value="bisexual">Bisexual</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
