import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import MetaNav from "@/components/layout/MetaNav";
import AppPageHeader from "@/components/layout/AppPageHeader";
import { ExploreRoleCard } from "@/components/roles/ExploreRoleCard";
import { RolesFilterBar } from "@/components/roles/RolesFilterBar";
import { ROLES_PAGE_FILTERS, ROLES_PAGE_ROLES } from "@/data/rolesPageContent";
import { useGlobalChat } from "@/context/GlobalChatContext";
import { ROUTES } from "@/routes";

export default function RolesPage() {
  const navigate = useNavigate();
  const { aiPanelOpen, toggleAiPanel } = useGlobalChat();
  const [headerSearchDraft, setHeaderSearchDraft] = useState("");

  const submitHeaderSearch = useCallback(() => {
    const t = headerSearchDraft.trim();
    if (t) navigate({ pathname: ROUTES.search, search: `?q=${encodeURIComponent(t)}` });
    else navigate(ROUTES.search);
  }, [headerSearchDraft, navigate]);

  const onHeaderAutocompletePick = useCallback(
    (q: string) => {
      const t = q.trim();
      if (!t) return;
      setHeaderSearchDraft(t);
      navigate({ pathname: ROUTES.search, search: `?q=${encodeURIComponent(t)}` });
    },
    [navigate],
  );

  return (
    <div className="min-h-screen w-full bg-white" data-name="Roles page">
      <div className="sticky top-0 z-40 bg-white">
        <MetaNav />
        <AppPageHeader
          className="max-w-[1440px] mx-auto"
          serp={{
            query: headerSearchDraft,
            onQueryChange: setHeaderSearchDraft,
            onSearchSubmit: submitHeaderSearch,
            onAutocompletePick: onHeaderAutocompletePick,
            aiPanelOpen,
            onAiSparkleClick: toggleAiPanel,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px]">
        <main
          className={`w-full min-w-0 px-4 py-6 pb-16 sm:pl-[46px] sm:pr-[46px] ${aiPanelOpen ? "sm:pr-[430px]" : ""}`}
          data-name="Roles main"
        >
          <div className="mx-auto flex w-full max-w-[932px] flex-col gap-8">
            <header className="max-w-[690px]">
              <h1 className="font-['Source_Sans_3',sans-serif] text-[36px] font-semibold leading-9 tracking-[-0.02em] text-[#0f1114]">
                Explore roles
              </h1>
              <p className="mt-2 font-['Source_Sans_3',sans-serif] text-[16px] font-normal leading-6 text-[#404b61]">
                Advance in your career with recognized credentials across levels. Choose from 40+ roles.
              </p>
            </header>

            <RolesFilterBar items={ROLES_PAGE_FILTERS} />

            <section className="w-full" aria-label="Role cards">
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ROLES_PAGE_ROLES.map((role) => (
                  <ExploreRoleCard key={role.title} role={role} />
                ))}
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  className="font-['Source_Sans_3',sans-serif] text-[14px] font-semibold leading-5 text-[#0056d2] underline decoration-solid [text-decoration-skip-ink:none] transition-colors hover:text-[#0040a8]"
                >
                  Show more
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
