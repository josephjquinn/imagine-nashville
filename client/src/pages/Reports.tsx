import { useState } from "react";

export function Reports() {
  const [activeCategory, setActiveCategory] = useState("Main Reports");

  const reportCategories = [
    {
      title: "Main Reports",
      reports: [
        {
          name: "Imagine Nashville All Dashboards",
          path: "/reports/Imagine-Nashville-All-Dashboards.pdf",
          description:
            "Complete collection of all Imagine Nashville dashboards and data visualizations",
          size: "12MB",
        },
        {
          name: "Data Presentation with Appendices",
          path: "/reports/Imagine-Nashville-Data-Presentation-with-Appendices-2.28.24.pdf",
          description:
            "Comprehensive data presentation including detailed appendices",
          size: "9.3MB",
        },
      ],
    },
    {
      title: "Youth Reports",
      reports: [
        {
          name: "Youth Dashboard",
          path: "/reports/Imagine-Nashville-Youth-Dashboard-4.30.24.pdf",
          description:
            "Detailed analysis of youth perspectives and experiences",
          size: "6.9MB",
        },
        {
          name: "Youth-Led Research Findings",
          path: "/reports/Imagine-Nashville-Youth-Led-Research-Findings-from-CDC-4.30.24.pdf",
          description: "Research findings from youth-led community initiatives",
          size: "7.1MB",
        },
      ],
    },
    {
      title: "Demographic Dashboards",
      reports: [
        {
          name: "By Ethnicity Dashboards",
          path: "/reports/By-Ethnicity-Dashboards.pdf",
          description: "Analysis of survey results by ethnic background",
          size: "1.6MB",
        },
        {
          name: "By Household Income Dashboards",
          path: "/reports/By-Household-Income-Dashboards.pdf",
          description: "Analysis of survey results by household income levels",
          size: "1MB",
        },
        {
          name: "By Sexual Orientation & Gender Identity",
          path: "/reports/By-Sexual-Orientation-Gender-Identity-Dashboards.pdf",
          description:
            "Analysis of survey results by sexual orientation and gender identity",
          size: "1MB",
        },
        {
          name: "Age 65+ Dashboard",
          path: "/reports/Age-65-Dashboard.pdf",
          description:
            "Analysis of survey results for residents age 65 and older",
          size: "538KB",
        },
      ],
    },
    {
      title: "Neighborhood Reports",
      reports: [
        {
          name: "Antioch, Cane Ridge, Priest Lake",
          path: "/reports/Antioch_Cane-Ridge_Priest-Lake-37011-37013-37217.pdf",
          description:
            "Survey results for Antioch, Cane Ridge, and Priest Lake areas",
          size: "532KB",
        },
        {
          name: "Bellevue",
          path: "/reports/Bellevue-37221.pdf",
          description: "Survey results for Bellevue area",
          size: "582KB",
        },
        {
          name: "Crieve Hall, Brentioch",
          path: "/reports/Crieve-Hall_Brentioch-37027-37211.pdf",
          description: "Survey results for Crieve Hall and Brentioch areas",
          size: "527KB",
        },
        {
          name: "Donelson, Hermitage, Old Hickory",
          path: "/reports/Donelson_Hermitage_Old-Hickory-37070-37076-37138-37214.pdf",
          description:
            "Survey results for Donelson, Hermitage, and Old Hickory areas",
          size: "549KB",
        },
        {
          name: "Downtown & Business District",
          path: "/reports/Downtown_Biz-District-37201-37213-37219-37234-37236-37237-37241-37242-37243-37246-37250.pdf",
          description:
            "Survey results for Downtown and Business District areas",
          size: "522KB",
        },
        {
          name: "East Nashville",
          path: "/reports/East-Nashville-37202-37206-37216-37222-37224-37227-37229-37230-37244.pdf",
          description: "Survey results for East Nashville areas",
          size: "534KB",
        },
        {
          name: "Green Hills, Belle Meade, Forest Hills, Oak Hill",
          path: "/reports/Green-Hills_Belle-Meade_Forest-Hills_Oak-Hill-37205-37215-37220.pdf",
          description:
            "Survey results for Green Hills, Belle Meade, Forest Hills, and Oak Hill areas",
          size: "541KB",
        },
        {
          name: "Gulch, Midtown, Belmont, 12South",
          path: "/reports/Gulch_Midtown_Belmont_12South-37203-37212-37235-37240.pdf",
          description:
            "Survey results for Gulch, Midtown, Belmont, and 12South areas",
          size: "527KB",
        },
        {
          name: "Joelton, Whites Creek",
          path: "/reports/Joelton-Whites-Creek.pdf",
          description: "Survey results for Joelton and Whites Creek areas",
          size: "593KB",
        },
        {
          name: "Madison, Goodlettsville",
          path: "/reports/Madison_Goodlettsville-37072-37115-37116.pdf",
          description: "Survey results for Madison and Goodlettsville areas",
          size: "544KB",
        },
        {
          name: "Nations, Sylvan, Charlotte Park",
          path: "/reports/Nations_Sylvan_Charlotte-Park-37209.pdf",
          description:
            "Survey results for Nations, Sylvan, and Charlotte Park areas",
          size: "545KB",
        },
        {
          name: "North Nashville, Bordeaux",
          path: "/reports/North-Nashville_Bordeaux-37207-37208-37218-37228.pdf",
          description: "Survey results for North Nashville and Bordeaux areas",
          size: "543KB",
        },
        {
          name: "Woodbine, WeHo, Berry Hill",
          path: "/reports/Woodbine_WeHo_Berry-Hill-37204-37210.pdf",
          description:
            "Survey results for Woodbine, WeHo, and Berry Hill areas",
          size: "537KB",
        },
        {
          name: "Davidson County Dashboard",
          path: "/reports/Davidson-Co.-Dashboard.pdf",
          description:
            "Comprehensive analysis of Davidson County survey results",
          size: "516KB",
        },
        {
          name: "Surrounding Counties Dashboard",
          path: "/reports/Surrounding-Counties-Dashboard.pdf",
          description:
            "Analysis of survey results from counties surrounding Nashville",
          size: "555KB",
        },
      ],
    },
  ];

  const activeCategoryData = reportCategories.find(
    (cat) => cat.title === activeCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Imagine Nashville Reports
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Access comprehensive reports and analysis of Nashville's community
            survey results.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Categories
              </h2>
              <nav className="space-y-1">
                {reportCategories.map((category) => (
                  <button
                    key={category.title}
                    onClick={() => setActiveCategory(category.title)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      activeCategory === category.title
                        ? "bg-[var(--brand-blue)] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {activeCategoryData?.title}
              </h2>
              <p className="text-gray-600">
                {activeCategoryData?.reports.length} reports available
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {activeCategoryData?.reports.map((report, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.name}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {report.size}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6">{report.description}</p>
                    <a
                      href={report.path}
                      download
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--brand-blue)] hover:bg-[#E94E3C] transition-colors duration-200"
                    >
                      Download Report
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
