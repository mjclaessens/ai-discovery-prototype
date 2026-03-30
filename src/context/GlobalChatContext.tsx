import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { ResolvedSerpCourse } from "@/data/serpCourses";

/** Serializable chat props mirrored from SearchResultsPage for the shared panel. */
export type SerpChatDataSnapshot = {
  resultsReady: boolean;
  recommendationsReady: boolean;
  courseSelectionFeaturesReady: boolean;
  selectedCourses: ResolvedSerpCourse[];
  compareChatExchanges: readonly { key: string; seq: number; courses: ResolvedSerpCourse[] }[];
  moreLikeThisChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    previousCourses: ResolvedSerpCourse[];
  }[];
  exploreAlternativesChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    replacedCourse: ResolvedSerpCourse | null;
  }[];
  removeCourseChatExchanges: readonly { key: string; seq: number }[];
  comparisonActive: boolean;
};

export const defaultSerpChatDataSnapshot: SerpChatDataSnapshot = {
  resultsReady: false,
  recommendationsReady: false,
  courseSelectionFeaturesReady: false,
  selectedCourses: [],
  compareChatExchanges: [],
  moreLikeThisChatExchanges: [],
  exploreAlternativesChatExchanges: [],
  removeCourseChatExchanges: [],
  comparisonActive: false,
};

/** Live handlers from SearchResultsPage (cleared on unmount; PDP uses fallbacks). */
export type SerpChatHandlers = {
  onPmAssistantComplete: () => void;
  onRemoveSelectedCourse: (id: string) => void;
  onCompareSelected: () => void;
  onClose: () => void;
};

export type PdpChatContinuation = {
  courseId: string;
  courseTitle: string;
  /** Thumbnail for the composer course pill on PDP. */
  courseThumb: string;
  productNounForAi: string;
};

type GlobalChatContextValue = {
  aiPanelOpen: boolean;
  setAiPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAiPanel: () => void;
  closeAiPanel: () => void;
  composerText: string;
  setComposerText: React.Dispatch<React.SetStateAction<string>>;
  productManagerConfirmed: boolean;
  setProductManagerConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  serpChatData: SerpChatDataSnapshot;
  setSerpChatData: React.Dispatch<React.SetStateAction<SerpChatDataSnapshot>>;
  serpHandlersRef: RefObject<SerpChatHandlers | null>;
  pdpContinuation: PdpChatContinuation | null;
  setPdpContinuation: React.Dispatch<React.SetStateAction<PdpChatContinuation | null>>;
  /**
   * When false on /roles, the chat panel shows the “Where would you like to start?” empty state.
   * Set true after the user has started elsewhere (search/PDP) or dismissed the empty state on Roles.
   */
  rolesAssistantEmptyDismissed: boolean;
  setRolesAssistantEmptyDismissed: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalChatContext = createContext<GlobalChatContextValue | null>(null);

export function GlobalChatProvider({ children }: { children: ReactNode }) {
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [productManagerConfirmed, setProductManagerConfirmed] = useState(false);
  const [serpChatData, setSerpChatData] = useState<SerpChatDataSnapshot>(defaultSerpChatDataSnapshot);
  const [pdpContinuation, setPdpContinuation] = useState<PdpChatContinuation | null>(null);
  const [rolesAssistantEmptyDismissed, setRolesAssistantEmptyDismissed] = useState(false);
  const serpHandlersRef = useRef<SerpChatHandlers | null>(null);

  const toggleAiPanel = useCallback(() => setAiPanelOpen((o) => !o), []);
  const closeAiPanel = useCallback(() => setAiPanelOpen(false), []);

  const value = useMemo(
    () =>
      ({
        aiPanelOpen,
        setAiPanelOpen,
        toggleAiPanel,
        closeAiPanel,
        composerText,
        setComposerText,
        productManagerConfirmed,
        setProductManagerConfirmed,
        serpChatData,
        setSerpChatData,
        serpHandlersRef,
        pdpContinuation,
        setPdpContinuation,
        rolesAssistantEmptyDismissed,
        setRolesAssistantEmptyDismissed,
      }) satisfies GlobalChatContextValue,
    [
      aiPanelOpen,
      toggleAiPanel,
      closeAiPanel,
      composerText,
      productManagerConfirmed,
      serpChatData,
      pdpContinuation,
      rolesAssistantEmptyDismissed,
    ],
  );

  return <GlobalChatContext.Provider value={value}>{children}</GlobalChatContext.Provider>;
}

export function useGlobalChat(): GlobalChatContextValue {
  const ctx = useContext(GlobalChatContext);
  if (!ctx) {
    throw new Error("useGlobalChat must be used within GlobalChatProvider");
  }
  return ctx;
}
