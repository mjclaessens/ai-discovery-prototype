function Links() {
  return (
    <div className="absolute content-stretch flex gap-[32px] items-start leading-[0] left-[46px] not-italic text-[14px] text-white top-[8px] whitespace-nowrap" data-name="Links">
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-semibold justify-end relative shrink-0">
        <p>
          <span className="font-['Source_Sans_3',sans-serif] leading-[20px] text-[#e5e7e8]">For</span>
          <span className="font-['Source_Sans_3',sans-serif] leading-[20px] text-[#ebf3ff]">{` `}</span>
          <span className="font-['Source_Sans_3',sans-serif] font-semibold leading-[20px] text-white">Individuals</span>
        </p>
      </div>
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-end relative shrink-0">
        <p>
          <span className="leading-[20px] text-[#f3f8ff]">For</span>
          <span className="leading-[20px]">{` Businesses`}</span>
        </p>
      </div>
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-end relative shrink-0">
        <p>
          <span className="leading-[20px] text-[#e5e7e8]">For</span>
          <span className="leading-[20px]">{` Universities`}</span>
        </p>
      </div>
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-end relative shrink-0">
        <p>
          <span className="leading-[20px] text-[#e5e7e8]">For</span>
          <span className="leading-[20px]">{` Governments`}</span>
        </p>
      </div>
    </div>
  );
}

/** Logged-out homepage meta nav (black bar + audience links + underline) */
export default function MetaNav() {
  return (
    <div className="bg-black h-[40px] relative shrink-0 w-full" data-name="Meta Nav">
      <div className="relative h-full w-full max-w-[1440px] mx-auto">
        <Links />
        <div className="absolute h-0 left-[38px] top-[38px] w-[118px]" data-name="Bar">
          <div className="absolute inset-[-4px_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 118 8">
              <path d="M0 4H118" id="Bar" stroke="var(--stroke-0, white)" strokeWidth="8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
