import { Route, Routes } from "react-router-dom";
import BrokenURL from "../BrokenURL";
import HomeLayout from "./HomeLayout";
import DeviceOverviewPanel from "./DeviceOverviewPanel";
import SensorDetailPanel from "./SensorDetailPanel";
import LocationPanel from "./LocationPanel";
import HelpCenterPanel from "./HelpCenterPanel";

export default function HomeRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<DeviceOverviewPanel />} />
        <Route path="port-details" element={<SensorDetailPanel />} />
        <Route path="location" element={<LocationPanel />} />
        <Route path="help-center" element={<HelpCenterPanel />} />
      </Route>
      {/* ERROR 404 CATCH */}
      <Route path="*" element={<BrokenURL />} />
    </Routes>
  );
}
