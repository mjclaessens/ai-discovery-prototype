const ROLES_EMPTY_PROMPTS = [
  "Help me switch careers",
  "Help me find the right career",
  "What career is a good fit for me?",
  "Build me a learning plan",
  "Explore careers in AI",
] as const;

/**
 * Roles page chat empty state (Figma): gradient heading + suggested prompt chips.
 */
export function RolesChatEmptyState({ onSelectPrompt }: { onSelectPrompt: (label: string) => void }) {
  return (
    <div
      className="flex w-full min-w-0 flex-col items-stretch gap-8 px-4 pb-6 pt-8"
      data-name="Roles chat empty"
    >
      <h2 className="w-full text-left font-['Source_Sans_3',sans-serif] text-[22px] font-semibold leading-7 tracking-[-0.02em] sm:text-[24px] sm:leading-8">
        <span className="bg-gradient-to-r from-[#6344d4] to-[#4a86e8] bg-clip-text text-transparent">
          Where would you like to start?
        </span>
      </h2>
      <div className="flex w-full flex-wrap justify-start gap-2">
        {ROLES_EMPTY_PROMPTS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelectPrompt(label)}
            className="inline-flex max-w-full cursor-pointer items-center justify-start rounded-full border border-solid border-[#dae1ed] bg-white px-4 py-2.5 text-left font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-5 text-[#0f1114] transition-colors hover:bg-[#f8fafc]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
