import type { ReactNode } from "react";
import { AI_TYPING_BOLD_CLASS } from "@/components/chat/chatTypingConstants";

export function TypingCaretInline() {
  return (
    <span
      className="inline-block h-[14px] w-px bg-[#0f1114] animate-pulse"
      style={{ verticalAlign: "-0.15em" }}
      aria-hidden
    />
  );
}

/** Matches ChatPanelSkeleton user row — pulse bar before the real user chip appears. */
export function UserMessageLoadingSkeleton() {
  return (
    <div className="relative shrink-0 w-full" data-name="User message loading" aria-busy="true">
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center px-[16px] relative w-full">
          <div className="ml-auto h-[28px] w-[min(214px,90%)] max-w-[min(452px,100%)] shrink-0 rounded-[5px] bg-[#e8ecf4] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function AiResponseTypingBlock({
  segments,
  typedLen,
}: {
  segments: readonly { text: string; bold?: boolean }[];
  typedLen: number;
}) {
  let remaining = typedLen;
  const parts: ReactNode[] = [];
  let partKey = 0;
  for (const seg of segments) {
    if (remaining <= 0) break;
    const take = Math.min(seg.text.length, remaining);
    if (take > 0) {
      const chunk = seg.text.slice(0, take);
      parts.push(
        seg.bold ? (
          <span key={partKey} className={AI_TYPING_BOLD_CLASS}>
            {chunk}
          </span>
        ) : (
          <span key={partKey}>{chunk}</span>
        ),
      );
      partKey += 1;
      remaining -= take;
    }
  }

  return (
    <div className="relative shrink-0 w-full" data-name="Individual chat inputs">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
        <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[21px] min-w-0 w-full max-w-full text-[14px] text-[#0f1114] whitespace-pre-wrap">
          {parts}
          <span className="ml-0.5 inline-block" aria-hidden>
            <TypingCaretInline />
          </span>
        </p>
      </div>
    </div>
  );
}
