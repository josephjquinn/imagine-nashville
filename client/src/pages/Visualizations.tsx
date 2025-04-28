import React, { useState } from "react";
import { GenderPieChart } from "../components/graphs/demographics/GenderPieChart";
import { EthnicityPieChart } from "../components/graphs/demographics/EthnicityPieChart";
import { AgeHistogramChart } from "../components/graphs/demographics/AgeHistogramChart";
import { PriorityPerformanceChart } from "../components/graphs/priorities/PriorityPerformanceChart";
// import { PriorityQuadrantChart } from "../components/graphs/priorities/PriorityQuadrantChart";
import { BelongingBarChart } from "../components/graphs/overview/BelongingPieChart";
import { InclusionRatingsChart } from "../components/graphs/priorities/InclusionRatingsChart";
import { NegativeImpactsChart } from "../components/graphs/quality/NegativeImpactsChart";
import { GrowthPerceptionChart } from "../components/graphs/overview/GrowthPerceptionChart";
import { GrowthProblemsChart } from "../components/graphs/overview/GrowthProblemsChart";
import { GrowthBenefitsChart } from "../components/graphs/overview/GrowthBenefitsChart";
import QualityOfLifeLadderChart from "../components/graphs/quality/QualityOfLifeLadderChart";
import { EquitableQualityOfLifeChart } from "../components/graphs/quality/EquitableQualityOfLifeChart";
import { InclusiveServicesChart } from "../components/graphs/quality/InclusiveServicesChart";
import { NashvillePositivesPieChart } from "../components/graphs/overview/NashvillePositivesPieChart";
import CommunityPerceptionChart from "../components/graphs/overview/CommunityPerceptionChart";
import TourismPerceptionChart from "../components/graphs/overview/TourismPerceptionChart";
import { useSurveyData, SurveyType } from "../hooks/useSurveyData";
import { TransportationPriorityChart } from "@/components/graphs/priorities/TransportationPriorityChart";
import { TransportationGoalsChart } from "../components/graphs/priorities/TransportationGoalsChart";
import { TransportationPrioritiesChart } from "../components/graphs/priorities/TransportationPrioritiesChart";
import { HousingGoalsChart } from "../components/graphs/priorities/HousingGoalsChart";
import { HousingPrioritiesChart } from "../components/graphs/priorities/HousingPrioritiesChart";
import { EducationGoalsChart } from "../components/graphs/priorities/EducationGoalsChart";
import { EducationPrioritiesChart } from "../components/graphs/priorities/EducationPrioritiesChart";
import { EducationPriorityPieChart } from "../components/graphs/priorities/EducationPriorityPieChart";
import { BigIdeasChart } from "../components/graphs/priorities/BigIdeasChart";
import { IdealNeighborhoodAssetsChart } from "../components/graphs/priorities/IdealNeighborhoodAssetsChart";
import { NeighborhoodSatisfactionGraph } from "../components/graphs/quality/NeighborhoodSatisfactionGraph";
import { NashvilleTenureChart } from "../components/graphs/demographics/NashvilleTenureChart";
import { LivingAreaChart } from "../components/graphs/demographics/LivingAreaChart";
import { HousingStatusChart } from "../components/graphs/demographics/HousingStatusChart";
import { PublicTransportationChart } from "../components/graphs/demographics/PublicTransportationChart";
import { ChildrenInHouseholdChart } from "../components/graphs/demographics/ChildrenInHouseholdChart";
import { MaritalStatusChart } from "../components/graphs/demographics/MaritalStatusChart";
import { EducationLevelChart } from "../components/graphs/demographics/EducationLevelChart";
import { EmploymentStatusChart } from "../components/graphs/demographics/EmploymentStatusChart";
import { HouseholdIncomeChart } from "../components/graphs/demographics/HouseholdIncomeChart";
import { PoliticalAffiliationChart } from "../components/graphs/demographics/PoliticalAffiliationChart";
import { PoliticalIdeologyChart } from "../components/graphs/demographics/PoliticalIdeologyChart";
import { SexualOrientationChart } from "../components/graphs/demographics/SexualOrientationChart";
import { ReligiousAffiliationChart } from "../components/graphs/demographics/ReligiousAffiliationChart";
import {
  DemographicFilters,
  DemographicFiltersState,
} from "../components/filters/DemographicFilters";
import { HousingSupportComboChart } from "../components/graphs/priorities/HousingSupportComboChart";

interface Section {
  id: string;
  title: string;
  description: string;
}

const sections: Section[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Key metrics and overall survey results",
  },
  {
    id: "quality",
    title: "Quality of Life",
    description:
      "Insights into Nashville residents' quality of life and equity",
  },
  {
    id: "priorities",
    title: "City Priorities",
    description: "Analysis of city priorities and performance ratings",
  },
  {
    id: "demographics",
    title: "Demographics",
    description: "Demographic breakdown of survey respondents",
  },
];

const SurveyDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [surveyType, setSurveyType] = useState<SurveyType>("formal");
  const [filters, setFilters] = useState<DemographicFiltersState>({});
  const { data: surveyData, isLoading } = useSurveyData(surveyType, filters);

  const handleFilterChange = (newFilters: DemographicFiltersState) => {
    setFilters(newFilters);
  };

  const renderSection = (sectionId: string) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading...</div>;
    }

    switch (sectionId) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <NashvillePositivesPieChart
                data={surveyData}
                graphId="nashville-positives"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <GrowthPerceptionChart
                data={surveyData}
                graphId="growth-perception"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <GrowthProblemsChart
                data={surveyData}
                graphId="growth-problems"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <GrowthBenefitsChart
                data={surveyData}
                graphId="growth-benefits"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <CommunityPerceptionChart
                data={surveyData}
                graphId="community-perception"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TourismPerceptionChart
                data={surveyData}
                graphId="tourism-perception"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <BelongingBarChart data={surveyData} graphId="belonging" />
            </div>
          </div>
        );
      case "quality":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <QualityOfLifeLadderChart
                data={surveyData}
                graphId="quality-of-life-ladder"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EquitableQualityOfLifeChart
                data={surveyData}
                graphId="equitable-quality-of-life"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <InclusiveServicesChart
                data={surveyData}
                graphId="inclusive-services"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <NeighborhoodSatisfactionGraph
                data={surveyData}
                graphId="neighborhood-satisfaction"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <NegativeImpactsChart
                data={surveyData}
                title="Most Significant Negative Impacts on Quality of Life"
                subtitle="What residents dislike most about living and working in Nashville"
                graphId="negative-impacts"
              />
            </div>
          </div>
        );
      case "priorities":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TransportationGoalsChart
                data={surveyData}
                graphId="transportation-goals"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TransportationPrioritiesChart
                data={surveyData}
                graphId="transportation-priorities"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <HousingGoalsChart data={surveyData} graphId="housing-goals" />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <HousingPrioritiesChart
                data={surveyData}
                graphId="housing-priorities"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EducationGoalsChart
                data={surveyData}
                graphId="education-goals"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EducationPrioritiesChart
                data={surveyData}
                graphId="education-priorities"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <HousingSupportComboChart
                data={surveyData}
                graphId="housing-support"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <BigIdeasChart data={surveyData} graphId="big-ideas" />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <IdealNeighborhoodAssetsChart
                data={surveyData}
                graphId="ideal-neighborhood-assets"
              />
            </div>
            {/* <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <PriorityQuadrantChart
                data={surveyData}
                graphId="priority-quadrant"
              />
            </div> */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <PriorityPerformanceChart
                data={surveyData}
                graphId="priority-performance"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TransportationPriorityChart
                data={surveyData}
                graphId="transportation-priority"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EducationPriorityPieChart
                data={surveyData}
                graphId="education-priority-pie"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <InclusionRatingsChart
                data={surveyData}
                title="Who is Outside Looking In?"
                graphId="inclusion-ratings"
              />
            </div>
          </div>
        );
      case "demographics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AgeHistogramChart data={surveyData} graphId="age-histogram" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <GenderPieChart data={surveyData} graphId="gender-pie" />
              </div>
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EthnicityPieChart data={surveyData} graphId="ethnicity-pie" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <NashvilleTenureChart
                  data={surveyData}
                  graphId="nashville-tenure"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <LivingAreaChart data={surveyData} graphId="living-area" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <HousingStatusChart
                  data={surveyData}
                  graphId="housing-status"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <PublicTransportationChart
                  data={surveyData}
                  graphId="public-transportation"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ChildrenInHouseholdChart
                  data={surveyData}
                  graphId="children-in-household"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <MaritalStatusChart
                  data={surveyData}
                  graphId="marital-status"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EducationLevelChart
                  data={surveyData}
                  graphId="education-level"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EmploymentStatusChart
                  data={surveyData}
                  graphId="employment-status"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <HouseholdIncomeChart
                  data={surveyData}
                  graphId="household-income"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <PoliticalAffiliationChart
                  data={surveyData}
                  graphId="political-affiliation"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <PoliticalIdeologyChart
                  data={surveyData}
                  graphId="political-ideology"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <SexualOrientationChart
                  data={surveyData}
                  graphId="sexual-orientation"
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ReligiousAffiliationChart
                  data={surveyData}
                  graphId="religious-affiliation"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Nashville Survey Analytics
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  activeSection === section.id
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                } border`}
              >
                <h3
                  className={`font-medium mb-1 ${
                    activeSection === section.id
                      ? "text-blue-700"
                      : "text-gray-900"
                  }`}
                >
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <DemographicFilters
              onFilterChange={handleFilterChange}
              totalResponses={surveyData.length}
              surveyType={surveyType}
              onSurveyTypeChange={setSurveyType}
            />
          </div>

          <div className="mb-8">{renderSection(activeSection)}</div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDashboard;
