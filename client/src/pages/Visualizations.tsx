import React, { useEffect, useState } from "react";
import { surveyService } from "../api/survey";
import { ResponseTrendGraph } from "../components/graphs/ResponseTrendGraph";
import { DemographicDistributionGraph } from "../components/graphs/DemographicDistributionGraph";
import { SurveyResponse } from "../api/survey";

const SurveyDashboard: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataCount, setDataCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allData = await surveyService.getAllSurveyResponses();
        setSurveyData(allData);
        setDataCount(allData.length);
      } catch (err) {
        console.error("Error fetching survey data:", err);
        if (err instanceof Error) {
          if (err.message.includes("Authentication error")) {
            setError(
              "Authentication error. Please check your Supabase credentials and try again."
            );
          } else {
            setError(`Failed to fetch survey data: ${err.message}`);
          }
        } else {
          setError("An unexpected error occurred while fetching survey data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg mb-2">{error}</p>
          <p className="text-gray-600 text-sm">
            If this issue persists, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Survey Analytics Dashboard
      </h1>

      <div className="mb-6 text-center text-gray-600">
        Displaying data from {dataCount} survey responses
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ResponseTrendGraph data={surveyData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DemographicDistributionGraph
            data={surveyData}
            field="GENDER_GROUP"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DemographicDistributionGraph data={surveyData} field="ETHNICITY" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DemographicDistributionGraph data={surveyData} field="Region_NEW" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DemographicDistributionGraph data={surveyData} field="Q100" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DemographicDistributionGraph data={surveyData} field="Q105" />
        </div>
      </div>
    </div>
  );
};

export default SurveyDashboard;
