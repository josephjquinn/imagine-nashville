import React, { useState } from "react";
import { GenderPieChart } from "../components/graphs/GenderPieChart";
import { EthnicityPieChart } from "../components/graphs/EthnicityPieChart";
import { AgeHistogramChart } from "../components/graphs/AgeHistogramChart";
import { PriorityPerformanceChart } from "../components/graphs/PriorityPerformanceChart";
import { PriorityQuadrantChart } from "../components/graphs/PriorityQuadrantChart";
import { BelongingBarChart } from "../components/graphs/BelongingPieChart";
import { InclusionRatingsChart } from "../components/graphs/InclusionRatingsChart";
import { NegativeImpactsChart } from "../components/graphs/NegativeImpactsChart";
import { GrowthPerceptionChart } from "../components/graphs/GrowthPerceptionChart";
import { GrowthProblemsChart } from "../components/graphs/GrowthProblemsChart";
import { GrowthBenefitsChart } from "../components/graphs/GrowthBenefitsChart";
import QualityOfLifeLadderChart from "../components/graphs/QualityOfLifeLadderChart";
import { EquitableQualityOfLifeChart } from "../components/graphs/EquitableQualityOfLifeChart";
import { InclusiveServicesChart } from "../components/graphs/InclusiveServicesChart";
import { NashvillePositivesPieChart } from "../components/graphs/NashvillePositivesPieChart";
import CommunityPerceptionChart from "../components/graphs/CommunityPerceptionChart";
import TourismPerceptionChart from "../components/graphs/TourismPerceptionChart";
import { useSurveyData, SurveyType } from "../hooks/useSurveyData";
import { TransportationPriorityChart } from "@/components/graphs/TransportationPriorityChart";
import { TransportationGoalsChart } from "../components/graphs/TransportationGoalsChart";
import { TransportationPrioritiesChart } from "../components/graphs/TransportationPrioritiesChart";
import { HousingGoalsChart } from "../components/graphs/HousingGoalsChart";
import { HousingPrioritiesChart } from "../components/graphs/HousingPrioritiesChart";
import { HousingSupportComboChart } from "../components/graphs/HousingSupportComboChart";
import { EducationGoalsChart } from "../components/graphs/EducationGoalsChart";
import { EducationPrioritiesChart } from "../components/graphs/EducationPrioritiesChart";
import { EducationPriorityPieChart } from "../components/graphs/EducationPriorityPieChart";
import { BigIdeasChart } from "../components/graphs/BigIdeasChart";
import { IdealNeighborhoodAssetsChart } from "../components/graphs/IdealNeighborhoodAssetsChart";
import { NeighborhoodSatisfactionGraph } from "../components/graphs/NeighborhoodSatisfactionGraph";
import { NashvilleTenureChart } from "../components/graphs/NashvilleTenureChart";
import { LivingAreaChart } from "../components/graphs/LivingAreaChart";
import { HousingStatusChart } from "../components/graphs/HousingStatusChart";
import { PublicTransportationChart } from "../components/graphs/PublicTransportationChart";
import { ChildrenInHouseholdChart } from "../components/graphs/ChildrenInHouseholdChart";
import { MaritalStatusChart } from "../components/graphs/MaritalStatusChart";
import { EducationLevelChart } from "../components/graphs/EducationLevelChart";
import { EmploymentStatusChart } from "../components/graphs/EmploymentStatusChart";
import { HouseholdIncomeChart } from "../components/graphs/HouseholdIncomeChart";
import { PoliticalAffiliationChart } from "../components/graphs/PoliticalAffiliationChart";
import { PoliticalIdeologyChart } from "../components/graphs/PoliticalIdeologyChart";
import { SexualOrientationChart } from "../components/graphs/SexualOrientationChart";
import { ReligiousAffiliationChart } from "../components/graphs/ReligiousAffiliationChart";
import {
  DemographicFilters,
  DemographicFiltersState,
} from "../components/filters/DemographicFilters";

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
  const [surveyType, setSurveyType] = useState<SurveyType>("merged");
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
              <NashvillePositivesPieChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <BelongingBarChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <GrowthPerceptionChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <GrowthProblemsChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <GrowthBenefitsChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <CommunityPerceptionChart
                data={surveyData}
                title="Community Perception"
                subtitle="Residents' views on economic divides and leadership priorities"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TourismPerceptionChart
                data={surveyData}
                title="Tourism Impact"
                subtitle="How residents perceive tourism's impact on Nashville"
              />
            </div>
          </div>
        );
      case "quality":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <QualityOfLifeLadderChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EquitableQualityOfLifeChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <InclusiveServicesChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <NeighborhoodSatisfactionGraph data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <NegativeImpactsChart
                data={surveyData}
                title="Most Significant Negative Impacts on Quality of Life"
                subtitle="What residents dislike most about living and working in Nashville"
              />
            </div>
          </div>
        );
      case "priorities":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TransportationGoalsChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TransportationPrioritiesChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <HousingGoalsChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <HousingPrioritiesChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <HousingSupportComboChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EducationGoalsChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EducationPrioritiesChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <EducationPriorityPieChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <BigIdeasChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <IdealNeighborhoodAssetsChart data={surveyData} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <PriorityQuadrantChart
                data={surveyData}
                title="Top Learnings...And Biggest Issues Going Unaddressed"
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <PriorityPerformanceChart
                data={surveyData}
                title="Nashville Priority Performance Ratings (1-10 Scale)"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <TransportationPriorityChart data={surveyData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <InclusionRatingsChart
                data={surveyData}
                title="Who is Outside Looking In?"
              />
            </div>
          </div>
        );
      case "demographics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AgeHistogramChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <GenderPieChart data={surveyData} />
              </div>
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EthnicityPieChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <NashvilleTenureChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <LivingAreaChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <HousingStatusChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <PublicTransportationChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ChildrenInHouseholdChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <MaritalStatusChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EducationLevelChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <EmploymentStatusChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <HouseholdIncomeChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <PoliticalAffiliationChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <PoliticalIdeologyChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <SexualOrientationChart data={surveyData} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ReligiousAffiliationChart data={surveyData} />
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
            <div className="flex items-center gap-4">
              <select
                id="surveyType"
                value={surveyType}
                onChange={(e) => setSurveyType(e.target.value as SurveyType)}
                className="block px-3 py-2 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="formal">Formal Survey</option>
                <option value="public">Public Survey</option>
                <option value="merged">Merged Survey</option>
              </select>
            </div>
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
            />
          </div>

          <div className="mb-8">{renderSection(activeSection)}</div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDashboard;
