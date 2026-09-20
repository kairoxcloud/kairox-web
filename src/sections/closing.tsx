import { PaperPlaneTilt } from "@phosphor-icons/react";

import { Reveal } from "../components/reveal";
import { SectionHead } from "../components/section-head";
import { WaitlistForm } from "../components/waitlist-form";
import { images } from "../lib/images";

export function Closing() {
  return (
    <section id="closing" className="px-5 pb-0 md:px-8" aria-labelledby="closing-heading">
      <div className="rounded-frame relative isolate overflow-hidden">
        <img
          src={images.closingCloudtop.src}
          width={images.closingCloudtop.width}
          height={images.closingCloudtop.height}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Scrim: the copy has to clear WCAG AA over the photograph. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#08080b]/68" />
        <div
          aria-hidden="true"
          className="bloom -z-10 bottom-[-300px] left-1/2 h-[700px] w-[1000px] -translate-x-1/2"
        />
        {/* Settles into the page colour before the panel's own edge, so the footer is
            separated by darkness rather than by a line where the photograph stops. */}
        <div
          aria-hidden="true"
          className="to-void absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-gradient-to-b from-transparent"
        />

        <div className="shell flex flex-col items-center py-24 text-center lg:py-32">
          <SectionHead
            id="closing-heading"
            icon={PaperPlaneTilt}
            eyebrow="Early access"
            tone="photo"
            lead="Kairox is not open yet. Leave an email and you will hear when the first containers are handed out."
          >
            The first sessions go out <span className="tail">to a small group</span>
          </SectionHead>

          <Reveal className="mt-10 w-full max-w-[32rem]">
            <WaitlistForm id="waitlist" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
