import type { ReactNode, RefObject } from "react";
import { CHAT_PANEL_ASIDE_CLASS, ChatPanelHeader } from "@/components/chat/ChatPanelChrome";
import { cn } from "@/lib/utils";

type ChatPanelShellProps = {
  onClose?: () => void;
  children: ReactNode;
  footer: ReactNode;
  scrollRef?: RefObject<HTMLDivElement | null>;
  asideClassName?: string;
} & Omit<React.ComponentPropsWithoutRef<"aside">, "children">;

/**
 * Shared aside layout for SERP and PDP: fixed width/positioning, header, scroll region, composer footer.
 */
export function ChatPanelShell({
  onClose,
  children,
  footer,
  scrollRef,
  asideClassName,
  className,
  ...asideProps
}: ChatPanelShellProps) {
  return (
    <aside
      className={cn(CHAT_PANEL_ASIDE_CLASS, asideClassName, className)}
      data-name="Chat Panel"
      {...asideProps}
    >
      <ChatPanelHeader onClose={onClose} />
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none] pt-2"
      >
        {children}
      </div>
      <div
        className="shrink-0 flex flex-col gap-[10px] items-start px-4 pt-4 pb-4 w-full min-w-0 bg-white overflow-x-clip"
        data-name="Chat input"
      >
        {footer}
      </div>
    </aside>
  );
}
