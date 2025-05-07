import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import SurveyDashboard from "./pages/Visualizations";
import { NeighborhoodBreakdown } from "./pages/NeighborhoodBreakdown";
import { PDFProvider } from "./contexts/PDFContext";
import { PDFDownloadButton } from "./components/PDFDownloadButton";

function App() {
  return (
    <PDFProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/visualizations" element={<SurveyDashboard />} />
            <Route
              path="/neighborhood-breakdown"
              element={<NeighborhoodBreakdown />}
            />
          </Route>
        </Routes>
        <PDFDownloadButton />
      </Router>
    </PDFProvider>
  );
}

export default App;
