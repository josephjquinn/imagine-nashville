import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
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
