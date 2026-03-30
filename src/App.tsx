import { BrowserRouter, Route, Routes } from "react-router";
import { GlobalChatLayer } from "@/components/chat/GlobalChatLayer";
import { GlobalChatProvider } from "@/context/GlobalChatContext";
import LoggedOutHomepage from "./pages/LoggedOutHomepage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import RolesPage from "./pages/RolesPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { ROUTES } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalChatProvider>
        <Routes>
          <Route path={ROUTES.home} element={<LoggedOutHomepage />} />
          <Route path={ROUTES.search} element={<SearchResultsPage />} />
          <Route path={ROUTES.roles} element={<RolesPage />} />
          <Route path={ROUTES.productPath} element={<ProductDetailsPage />} />
        </Routes>
        <GlobalChatLayer />
      </GlobalChatProvider>
    </BrowserRouter>
  );
}
