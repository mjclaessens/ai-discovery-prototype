import { BrowserRouter, Route, Routes } from "react-router";
import LoggedOutHomepage from "./pages/LoggedOutHomepage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { ROUTES } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<LoggedOutHomepage />} />
        <Route path={ROUTES.search} element={<SearchResultsPage />} />
        <Route path={ROUTES.productPath} element={<ProductDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
