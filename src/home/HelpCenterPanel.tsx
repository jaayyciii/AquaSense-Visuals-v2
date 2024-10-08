import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import QuickNav from "../help-center/QuickNav";
import GetStarted from "../help-center/GetStarted";
import FAQ from "../help-center/FAQ";
import ContactUs from "../help-center/ContactUs";
import type { ContextType } from "./HomeLayout";

export default function HelpCenterPanel() {
  const { setPrompt } = useOutletContext<ContextType>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="d-flex flex-column flex-grow-1 pb-4 px-4">
      <div className="d-flex justify-content-between mt-4">
        <h4>Help Center</h4>
        <div className="input-group w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="input-group-text text-white bg-primary">
            <i className="bi bi-search" />
          </span>
        </div>
      </div>
      <QuickNav />
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <GetStarted />
      </div>
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <FAQ />
      </div>
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <ContactUs setPrompt={setPrompt} />
      </div>
    </div>
  );
}
