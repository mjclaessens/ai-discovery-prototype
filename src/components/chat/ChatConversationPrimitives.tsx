import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import actionsCopy from "@/assets/actions-copy.svg";
import actionsMore from "@/assets/actions-more.svg";
import actionsReload from "@/assets/actions-reload.svg";
import actionsThumbsDown from "@/assets/actions-thumbsdown.svg";
import actionsThumbsUp from "@/assets/actions-thumbsup.svg";

const aiMessageActionBtnClass =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-[#6d7c99] transition-colors hover:bg-[#f2f5fa] hover:text-[#0f1114] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]";

/** AI assistant reply toolbar: thumbs, copy, regenerate, more (Figma Actions / message feedback row). */
export function ChatAiMessageActions() {
  return (
    <div
      className="content-stretch flex flex-wrap gap-0 items-center min-h-[32px] pt-2 relative shrink-0"
      data-name="Actions"
    >
      <button type="button" className={aiMessageActionBtnClass} aria-label="Helpful response" data-name="toggles/ThumbsUp">
        <img alt="" src={actionsThumbsUp} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="Not helpful" data-name="toggles/ThumbsDown">
        <img alt="" src={actionsThumbsDown} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="Copy response" data-name="actions/Copy">
        <img alt="" src={actionsCopy} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="Regenerate response" data-name="actions/Reload">
        <img alt="" src={actionsReload} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="More actions" data-name="actions/More">
        <img alt="" src={actionsMore} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
    </div>
  );
}

export function UserMessageChip({
  children,
  onUserMessageMounted,
}: {
  children: ReactNode;
  /** Called when this user bubble mounts so the panel can pin it to the top (new turn). */
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || !onUserMessageMounted) return;
    onUserMessageMounted(el);
  }, [onUserMessageMounted, children]);

  return (
    <div
      ref={setRootRef}
      className="relative shrink-0 w-full scroll-mt-2"
      data-name="Individual chat inputs"
      data-chat-user-turn
    >
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center px-[16px] relative w-full">
          <div
            className="bg-[#f2f5fa] content-stretch flex gap-[4px] items-start justify-end max-w-[min(452px,100%)] px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-fit min-w-0 ml-auto"
            data-name="Chip"
          >
            <div className="flex flex-[1_0_0] flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#0f1114] text-[14px]">
              <p className="leading-[21px]">{children}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
