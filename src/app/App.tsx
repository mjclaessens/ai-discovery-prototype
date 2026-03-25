import { BrowserRouter, Route, Routes } from "react-router";
import LoggedOutHomepage from "../imports/LoggedOutHomepage";
import SerpDw from "../imports/SerpDw";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoggedOutHomepage />} />
        <Route path="/search" element={<SerpDw />} />
      </Routes>
    </BrowserRouter>
  );
}
