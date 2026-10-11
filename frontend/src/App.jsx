
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import CampaignHistory from "./pages/CampaignHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<CampaignHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
