import React, { useMemo } from "react";
import { SurveyResponse } from "@/types/survey";

interface MobilityPrioritiesTableProps {
  data: SurveyResponse[];
}

interface MobilityPriority {
  priority: string;
  questionId: string;
  label: string;
}

const MOBILITY_PRIORITIES: MobilityPriority[] = [
  {
    questionId: "Q640_A",
    priority:
      "Improve and increase public transportation availability and options throughout the city (light rail, bus rapid transit, expanded bus service)",
    label: "Public Transportation",
  },
  {
    questionId: "Q640_B",
    priority: "Reduce traffic congestion",
    label: "Traffic Congestion",
  },
  {
    questionId: "Q640_C",
    priority: "Improve road maintenance and operations on existing roads",
    label: "Road Maintenance",
  },
  {
    questionId: "Q640_D",
    priority:
      "Improve bicycle and pedestrian connectivity and infrastructure across the city and in the surrounding communities (bikeable streets, sidewalks, greenway and trail networks, etc.)",
    label: "Bike & Pedestrian",
  },
  {
    questionId: "Q640_E",
    priority:
      "Promote flexible and remote work schedules to reduce the need and impact of commuting",
    label: "Remote Work",
  },
  {
    questionId: "Q640_F",
    priority:
      "Construct new street and highway improvements to better connect parts of the city",
    label: "New Streets",
  },
];

const NEIGHBORHOODS = [
  "All",
  "Joelton/Whites Creek*",
  "North Nashville/Bordeaux",
  "East Nashville",
  "Madison/Goodlettsville",
  "Donelson/Hermitage/Old Hickory",
  "Antioch/Cane Ridge/Priest Lake",
  "Woodbine/WeHo/Berry Hill",
  "Crieve Hall/Brentioct",
  "Green Hills/Belle Meade/Forest Hills/Oak Hill",
  "Nations/Sylvan/Charlotte Park++",
  "Bellevue",
  "Downtown/Biz District*",
  "Gulch/Midtown/Belmont/12South",
];

const NEIGHBORHOOD_CODE_MAP: Record<string, string> = {
  "1": "Joelton/Whites Creek*",
  "2": "North Nashville/Bordeaux",
  "3": "East Nashville",
  "4": "Madison/Goodlettsville",
  "5": "Donelson/Hermitage/Old Hickory",
  "6": "Antioch/Cane Ridge/Priest Lake",
  "7": "Woodbine/WeHo/Berry Hill",
  "8": "Crieve Hall/Brentioct",
  "9": "Green Hills/Belle Meade/Forest Hills/Oak Hill",
  "10": "Nations/Sylvan/Charlotte Park++",
  "11": "Bellevue",
  "12": "Downtown/Biz District*",
  "13": "Gulch/Midtown/Belmont/12South",
};

export const MobilityPrioritiesTable: React.FC<
  MobilityPrioritiesTableProps
> = ({ data }) => {
  const processedData = useMemo(() => {
    const result: Record<
      string,
      Record<string, { score: number; rank?: number }>
    > = {};
    const responseCounts: Record<string, number> = { All: 0 };

    // Initialize structure for each priority
    MOBILITY_PRIORITIES.forEach((priority) => {
      result[priority.questionId] = {
        All: { score: 0 },
      };

      // Initialize each neighborhood
      Object.values(NEIGHBORHOOD_CODE_MAP).forEach((neighborhood) => {
        result[priority.questionId][neighborhood] = { score: 0 };
      });
    });

    // Initialize response counts for each neighborhood
    Object.values(NEIGHBORHOOD_CODE_MAP).forEach((neighborhood) => {
      responseCounts[neighborhood] = 0;
    });

    // Count responses for each neighborhood
    data.forEach((response) => {
      responseCounts["All"]++;
      if (response.Area_NEW) {
        const neighborhood = NEIGHBORHOOD_CODE_MAP[response.Area_NEW];
        if (neighborhood) {
          responseCounts[neighborhood]++;
        }
      }
    });

    // Process all responses
    const validResponseCounts: Record<string, Record<string, number>> = {};
    MOBILITY_PRIORITIES.forEach((priority) => {
      validResponseCounts[priority.questionId] = { All: 0 };
      Object.values(NEIGHBORHOOD_CODE_MAP).forEach((neighborhood) => {
        validResponseCounts[priority.questionId][neighborhood] = 0;
      });
    });

    data.forEach((response) => {
      const neighborhood = response.Area_NEW
        ? NEIGHBORHOOD_CODE_MAP[response.Area_NEW]
        : null;

      MOBILITY_PRIORITIES.forEach((priority) => {
        const score = Number(
          response[priority.questionId as keyof SurveyResponse]
        );
        if (!isNaN(score) && score > 0) {
          // Only count valid, non-zero scores
          // Add to overall average
          result[priority.questionId]["All"].score += score;
          validResponseCounts[priority.questionId]["All"]++;

          // Add to neighborhood average if applicable
          if (neighborhood) {
            result[priority.questionId][neighborhood].score += score;
            validResponseCounts[priority.questionId][neighborhood]++;
          }
        }
      });
    });

    // Calculate averages and determine rankings
    MOBILITY_PRIORITIES.forEach((priority) => {
      // Calculate overall average
      const allValidCount = validResponseCounts[priority.questionId]["All"];
      if (allValidCount > 0) {
        result[priority.questionId]["All"].score /= allValidCount;
      }

      // Calculate neighborhood averages
      Object.values(NEIGHBORHOOD_CODE_MAP).forEach((neighborhood) => {
        const validCount =
          validResponseCounts[priority.questionId][neighborhood];
        if (validCount > 0) {
          result[priority.questionId][neighborhood].score /= validCount;
        }
      });
    });

    // Determine rankings for each neighborhood
    Object.values(NEIGHBORHOOD_CODE_MAP).forEach((neighborhood) => {
      const priorityScores = MOBILITY_PRIORITIES.map((priority) => ({
        questionId: priority.questionId,
        score: result[priority.questionId][neighborhood].score,
      }));

      // Sort by score descending
      priorityScores.sort((a, b) => b.score - a.score);

      // Assign ranks to top 3
      priorityScores.slice(0, 3).forEach((priority, index) => {
        result[priority.questionId][neighborhood].rank = index + 1;
      });
    });

    return { scores: result, counts: responseCounts };
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="bg-gray-50 px-6 py-4 text-left">
              <div className="border-2 border-green-500 rounded-lg p-2 inline-block bg-green-50 text-sm font-medium text-green-800">
                Highest region by priority
              </div>
            </th>
            {NEIGHBORHOODS.map((neighborhood) => (
              <th
                key={neighborhood}
                className="bg-gray-50 px-2 py-3 align-bottom"
              >
                <div className="text-[10px] font-medium text-gray-600 w-20 break-words">
                  {neighborhood}
                  <div className="text-[10px] text-gray-500 mt-1">
                    n={processedData.counts[neighborhood] || 0}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {MOBILITY_PRIORITIES.map((priority, index) => (
            <tr
              key={priority.questionId}
              className={index % 2 === 0 ? "bg-gray-50" : ""}
            >
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-md">
                  {priority.priority}
                </div>
              </td>
              {NEIGHBORHOODS.map((neighborhood) => {
                const data =
                  processedData.scores[priority.questionId][neighborhood];
                const score = data?.score.toFixed(1);
                const isHighScore = data?.score >= 9.0;
                const rank = data?.rank;

                return (
                  <td
                    key={neighborhood}
                    className="px-3 py-4 text-center relative group"
                  >
                    <div
                      className={`
                      relative
                      ${rank ? "bg-opacity-10 rounded-lg p-2 -m-2" : ""}
                      ${
                        rank === 1
                          ? "bg-yellow-100"
                          : rank === 2
                          ? "bg-blue-100"
                          : rank === 3
                          ? "bg-pink-100"
                          : ""
                      }
                    `}
                    >
                      {/* Score Display */}
                      <div
                        className={`
                        font-medium text-base
                        ${isHighScore ? "text-green-600" : "text-gray-700"}
                        ${rank ? "mb-1" : ""}
                      `}
                      >
                        {score}
                      </div>

                      {/* Rank Indicator */}
                      {rank && (
                        <div className="flex items-center justify-center space-x-1">
                          {[...Array(rank)].map((_, i) => (
                            <div
                              key={i}
                              className={`
                                h-1.5 w-1.5 rounded-full
                                ${
                                  rank === 1
                                    ? "bg-yellow-400"
                                    : rank === 2
                                    ? "bg-blue-400"
                                    : "bg-pink-400"
                                }
                              `}
                            />
                          ))}
                        </div>
                      )}

                      {/* Hover Tooltip */}
                      {rank && (
                        <div
                          className="
                          absolute left-1/2 -translate-x-1/2 -top-2 
                          opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200
                          pointer-events-none
                          z-10
                        "
                        >
                          <div
                            className={`
                            px-2 py-1 rounded text-xs text-white whitespace-nowrap
                            ${
                              rank === 1
                                ? "bg-yellow-400"
                                : rank === 2
                                ? "bg-blue-400"
                                : "bg-pink-400"
                            }
                          `}
                          >
                            {rank === 1
                              ? "Top Priority"
                              : rank === 2
                              ? "Second Priority"
                              : "Third Priority"}
                          </div>
                          <div
                            className={`
                            w-2 h-2 rotate-45 
                            absolute left-1/2 -translate-x-1/2 -bottom-1
                            ${
                              rank === 1
                                ? "bg-yellow-400"
                                : rank === 2
                                ? "bg-blue-400"
                                : "bg-pink-400"
                            }
                          `}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500">
        <div className="mb-4 sm:mb-0">* - small base, n&lt;50</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>
            <span>Top Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            </div>
            <span>Second Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
            </div>
            <span>Third Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-green-600 font-medium">9.0+</div>
            <span>High Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};
