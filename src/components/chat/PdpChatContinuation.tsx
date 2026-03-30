import { useEffect, useMemo, useState } from "react";
import { AiResponseTypingBlock, UserMessageLoadingSkeleton } from "@/components/chat/ChatTypingAnimations";
import {
  AI_CHARS_PER_STEP,
  AI_TYPE_MS_PER_STEP,
  AI_TYPEWRITER_INITIAL_DELAY_MS,
} from "@/components/chat/chatTypingConstants";
import { ChatAiMessageActions, UserMessageChip } from "@/components/chat/ChatConversationPrimitives";

function buildPdpAiSegments(productNounForAi: string): readonly { text: string; bold?: boolean }[] {
  return [
    {
      text: `This ${productNounForAi} is a strong fit for you as a product manager`,
      bold: true,
    },
    {
      text:
        " because it bridges technical understanding and practical application—exactly the gap PMs need to close right now.",
    },
    { text: "\n\n" },
    { text: "Do you have any questions?", bold: true },
  ];
}

function pdpAiPlaintextLen(segments: readonly { text: string; bold?: boolean }[]) {
  return segments.reduce((a, s) => a + s.text.length, 0);
}

/**
 * Product-details turn using the same sequence as SERP exchanges: user pulse → user chip → AI typewriter → actions.
 */
export function PdpChatContinuationAnimated({
  courseTitle,
  productNounForAi,
  onUserMessageMounted,
}: {
  courseTitle: string;
  productNounForAi: string;
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const userLabel = `View ${courseTitle}`;
  const segments = useMemo(() => buildPdpAiSegments(productNounForAi), [productNounForAi]);
  const aiPlaintextLen = useMemo(() => pdpAiPlaintextLen(segments), [segments]);

  const [phase, setPhase] = useState<"user_loading" | "user_chip" | "typing" | "done">("user_loading");
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase !== "user_loading") return;
    const id = window.setTimeout(() => setPhase("user_chip"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "user_chip") return;
    const id = window.setTimeout(() => {
      setTypedLen(0);
      setPhase("typing");
    }, AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= aiPlaintextLen) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, aiPlaintextLen));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen, aiPlaintextLen]);

  return (
    <div className="contents">
      {phase === "user_loading" ? <UserMessageLoadingSkeleton /> : null}
      {phase === "user_chip" || phase === "typing" || phase === "done" ? (
        <UserMessageChip onUserMessageMounted={onUserMessageMounted}>{userLabel}</UserMessageChip>
      ) : null}
      {phase === "typing" ? <AiResponseTypingBlock segments={segments} typedLen={typedLen} /> : null}
      {phase === "done" ? (
        <div className="relative shrink-0 w-full" data-name="Individual chat inputs">
          <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
            <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[21px] text-[14px] text-[#0f1114]">
              <span className="font-bold">This {productNounForAi} is a strong fit for you as a product manager</span>{" "}
              because it bridges technical understanding and practical application—exactly the gap PMs need to close right
              now.
            </p>
            <p className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px] text-[14px] text-[#0f1114]">
              Do you have any questions?
            </p>
            <ChatAiMessageActions />
          </div>
        </div>
      ) : null}
    </div>
  );
}
