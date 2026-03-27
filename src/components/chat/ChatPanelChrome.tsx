import actionsClose from "../../assets/actions-close.svg";
import actionsSettings from "../../assets/actions-settings.svg";
import sparkleIcon from "../../assets/sparkle.svg";

/** Chat header sparkle — `src/assets/sparkle.svg`, 20px (Figma 2156:31405). */
export function ChatPanelSparkleIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Variant B Icon" aria-hidden>
      <img alt="" className="block size-full object-contain" src={sparkleIcon} />
    </div>
  );
}

/** Figma Chat header (2156:31405): sparkle + settings + close. */
export function ChatPanelHeader({ onClose }: { onClose?: () => void }) {
  return (
    <header
      className="bg-white content-stretch flex h-[49px] shrink-0 w-full items-center justify-between overflow-clip px-[16px]"
      data-name="Chat header"
    >
      <ChatPanelSparkleIcon />
      <div
        className="content-stretch flex shrink-0 items-center gap-[4px]"
        data-name="Text input/AI Chat Top Buttons"
      >
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          aria-label="Assistant settings"
        >
          <img alt="" className="size-5 shrink-0 object-contain" src={actionsSettings} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          aria-label="Close assistant panel"
        >
          <img alt="" className="size-5 shrink-0 object-contain" src={actionsClose} aria-hidden />
        </button>
      </div>
    </header>
  );
}

/** Shared aside shell matching SERP ChatPanel width and borders. */
export const CHAT_PANEL_ASIDE_CLASS =
  "relative flex flex-col bg-white z-[15] border-[#dae1ed] min-h-0 justify-between max-sm:relative max-sm:mt-6 max-sm:w-full max-sm:border max-sm:rounded-lg max-sm:max-h-[min(560px,72dvh)] max-sm:overflow-hidden sm:fixed sm:top-[108px] sm:h-[calc(100dvh-108px)] sm:w-[384px] sm:shrink-0 sm:border-l sm:border-t-0 sm:border-r-0 sm:border-b-0 sm:[right:max(0px,calc((100vw-1440px)/2))]";
