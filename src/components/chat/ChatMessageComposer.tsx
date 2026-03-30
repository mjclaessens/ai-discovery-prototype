import {
  useCallback,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import actionsAdd from "@/assets/actions-add.svg";
import actionsAudio from "@/assets/actions-audio.svg";
import svgPaths from "@/components/svg/svg-blndo5mrzw";
import { ROUTES } from "@/routes";
import { cn } from "@/lib/utils";

const PRODUCT_MANAGER_TITLE = "Product Manager";

/** Figma ChatMessageComposer Toolbar (2156:31405): single ghost IconButton — add / attachment. */
export function ChatComposerAddButton() {
  return (
    <button
      type="button"
      aria-label="Add attachment"
      className="flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#0f1114] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
      data-name="IconButton"
    >
      <img alt="" src={actionsAdd} className="size-5 shrink-0 object-contain" data-name="actions/Add" aria-hidden />
    </button>
  );
}

/** Figma ChatMessageComposer primary send (2156:70477): 32×32, rounded-lg, blue fill, white arrow. */
export function ChatSendCircleButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border-0 p-0 transition-colors duration-150 ${
        disabled ? "cursor-not-allowed bg-[#c1cad9]" : "cursor-pointer bg-[#0056d2] hover:bg-[#0048b0]"
      }`}
      data-name="IconButton"
      aria-label={disabled ? "Send message (enter text first)" : "Send"}
    >
      <div className="relative size-5 shrink-0 -rotate-90 overflow-clip" data-name="direction/ArrowUp">
        <div className="absolute inset-[21.46%_21.56%_21.51%_20%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6875 11.4067">
            <path d={svgPaths.p205bab00} fill="#FFFFFF" id="Vector" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export function ChatComposerActionRow({ canSubmit }: { canSubmit: boolean }) {
  return (
    <div
      className="content-stretch flex min-w-0 w-full shrink-0 items-end justify-between"
      data-name="Action container"
    >
      <div className="content-stretch flex shrink-0 items-center" data-name="Toolbar">
        <ChatComposerAddButton />
      </div>
      <div className="content-stretch flex shrink-0 items-center justify-end gap-1" data-name="Submit">
        <button
          type="button"
          aria-label="Voice input"
          className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-lg border-0 bg-transparent p-1 text-[#0f1114] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          data-name="media/Microphone"
        >
          <img alt="" src={actionsAudio} className="size-5 shrink-0 object-contain" aria-hidden />
        </button>
        <ChatSendCircleButton disabled={!canSubmit} />
      </div>
    </div>
  );
}

/** Figma ChatMessageComposer (2156:31405): compact shell; text body + gap-4px + action row. */
export function ChatInputSkeleton() {
  return (
    <div
      className="bg-[#f2f5fa] flex flex-col gap-1 overflow-clip rounded-lg p-2 relative shrink-0 w-full min-w-0"
      data-name="ChatMessageComposer"
    >
      <div className="flex w-full min-w-0 items-center p-1 relative shrink-0" data-name="Text Body">
        <p className="min-h-[32px] flex-1 font-['Source_Sans_3',sans-serif] font-normal leading-[24px] text-[16px] text-[#5b6780]">
          Ask anything...
        </p>
      </div>
      <ChatComposerActionRow canSubmit={false} />
    </div>
  );
}

export function ChatInput({
  value,
  onChange,
  placeholder,
  awaitingRoleAnswer,
  onConfirmProductManager,
  composerTop,
  inputAriaLabel,
  variant = "default",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  awaitingRoleAnswer: boolean;
  onConfirmProductManager: () => void;
  /** Optional slot inside the #f2f5fa composer shell (e.g. selected course chips — Figma 2163:34106). */
  composerTop?: ReactNode;
  /** Overrides default role vs chat aria-label (e.g. when courses are selected before role pick). */
  inputAriaLabel?: string;
  /** PDP: larger radius, cool gray shell, room for course pill + placeholder. */
  variant?: "default" | "pdp";
}) {
  const navigate = useNavigate();
  const canSubmit = value.trim().length > 0;

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      if (awaitingRoleAnswer && trimmed.toLowerCase() === PRODUCT_MANAGER_TITLE.toLowerCase()) {
        onConfirmProductManager();
        onChange("");
        return;
      }
      navigate({ pathname: ROUTES.search, search: `?q=${encodeURIComponent(trimmed)}` });
      onChange("");
    },
    [awaitingRoleAnswer, navigate, onChange, onConfirmProductManager, value],
  );

  const onTextareaKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form
      ref={formRef}
      className={cn(
        "relative flex w-full min-w-0 shrink-0 flex-col overflow-clip",
        variant === "pdp"
          ? "gap-2 rounded-xl bg-[#e8ecf4] p-3"
          : "gap-1 rounded-lg bg-[#f2f5fa] p-2",
      )}
      data-name="ChatMessageComposer"
      onSubmit={onSubmit}
    >
      {composerTop}
      <div
        className={cn(
          "relative flex w-full min-w-0 shrink-0",
          variant === "pdp" ? "min-h-[52px] items-center px-0 py-1" : "items-center p-1",
        )}
        data-name="Text Body"
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onTextareaKeyDown}
          placeholder={placeholder}
          rows={variant === "pdp" ? 2 : 1}
          aria-label={inputAriaLabel ?? (awaitingRoleAnswer ? "My current role" : "Chat message")}
          className={cn(
            "max-h-[200px] w-full max-w-full flex-1 resize-none overflow-y-auto border-0 bg-transparent p-0 font-['Source_Sans_3',sans-serif] font-normal text-[#0f1114] outline-none placeholder:text-[#5b6780]",
            variant === "pdp"
              ? "min-h-[44px] text-[16px] leading-[22px]"
              : "min-h-[32px] text-[14px] leading-[20px]",
          )}
        />
      </div>
      <ChatComposerActionRow canSubmit={canSubmit} />
    </form>
  );
}
