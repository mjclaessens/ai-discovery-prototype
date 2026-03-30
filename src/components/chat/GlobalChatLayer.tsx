import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useGlobalChat } from "@/context/GlobalChatContext";
import { ChatPanel, ChatPanelSkeleton } from "@/pages/SearchResultsPage";
import { ROUTES } from "@/routes";

function pathIsProductDetails(pathname: string) {
  return pathname.startsWith("/product/");
}

/**
 * Single persistent chat panel for search, product, and roles routes so conversation state survives navigation.
 */
export function GlobalChatLayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    aiPanelOpen,
    closeAiPanel,
    serpChatData,
    serpHandlersRef,
    setPdpContinuation,
    rolesAssistantEmptyDismissed,
    setRolesAssistantEmptyDismissed,
  } = useGlobalChat();

  const prevPathnameRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevPathnameRef.current;
    const cur = location.pathname;
    if (prev === ROUTES.roles && cur === ROUTES.search) {
      setRolesAssistantEmptyDismissed(true);
    }
    if (cur === ROUTES.roles && prev != null && (prev === ROUTES.search || prev.startsWith("/product/"))) {
      setRolesAssistantEmptyDismissed(true);
    }
    prevPathnameRef.current = cur;
  }, [location.pathname, setRolesAssistantEmptyDismissed]);

  const isSearch = location.pathname === ROUTES.search;
  const isRoles = location.pathname === ROUTES.roles;
  const isPdp = pathIsProductDetails(location.pathname);
  const showLayer = (isSearch || isPdp || isRoles) && aiPanelOpen;

  useEffect(() => {
    if (isSearch || isRoles) setPdpContinuation(null);
  }, [isSearch, isRoles, setPdpContinuation]);

  const serpHandlers = serpHandlersRef.current;
  const fallbackHandlers = useMemo(
    () => ({
      onPmAssistantComplete: () => {},
      onRemoveSelectedCourse: () => navigate(ROUTES.search),
      onCompareSelected: () => navigate(ROUTES.search),
      onClose: closeAiPanel,
    }),
    [navigate, closeAiPanel],
  );
  const handlers = isSearch && serpHandlers ? serpHandlers : fallbackHandlers;

  const showRolesChatEmptyState = isRoles && !rolesAssistantEmptyDismissed;

  if (!showLayer) return null;

  const d = serpChatData;

  if (isSearch && !d.resultsReady) {
    return (
      <div className="w-full max-w-[1440px] mx-auto relative pointer-events-none">
        <div className="pointer-events-auto">
          <ChatPanelSkeleton onClose={handlers.onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto relative pointer-events-none">
      <div className="pointer-events-auto">
        <ChatPanel
          onPmAssistantComplete={handlers.onPmAssistantComplete}
          recommendationsReady={d.recommendationsReady}
          courseSelectionFeaturesReady={d.courseSelectionFeaturesReady}
          onClose={handlers.onClose}
          selectedCourses={d.selectedCourses}
          onRemoveSelectedCourse={handlers.onRemoveSelectedCourse}
          onCompareSelected={handlers.onCompareSelected}
          compareChatExchanges={d.compareChatExchanges}
          moreLikeThisChatExchanges={d.moreLikeThisChatExchanges}
          exploreAlternativesChatExchanges={d.exploreAlternativesChatExchanges}
          removeCourseChatExchanges={d.removeCourseChatExchanges}
          comparisonActive={d.comparisonActive}
          showRolesChatEmptyState={showRolesChatEmptyState}
          onDismissRolesChatEmpty={() => setRolesAssistantEmptyDismissed(true)}
        />
      </div>
    </div>
  );
}
