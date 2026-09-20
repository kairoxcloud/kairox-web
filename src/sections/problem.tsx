import { Warning } from "@phosphor-icons/react";

import { Reveal } from "../components/reveal";
import { SectionHead } from "../components/section-head";
import { images } from "../lib/images";

export function Problem() {
  return (
    <section id="problem" className="px-5 pb-4 md:px-8" aria-labelledby="problem-heading">
      <div className="rounded-frame relative isolate flex min-h-[34rem] items-center justify-center overflow-hidden lg:min-h-[42rem]">
        <img
          src={images.heroContainer.src}
          width={images.heroContainer.width}
          height={images.heroContainer.height}
          alt="A shipping container formed out of cloud, floating above a bank of cumulus"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(74%_66%_at_50%_44%,rgb(8_8_11/0.3),rgb(8_8_11/0.86))]"
        />
        {/* The wide scrim is kept light so the container still reads, which is not dark
            enough behind text on its own. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(54%_46%_at_50%_54%,rgb(8_8_11/0.74),transparent_74%)]"
        />

        <div className="shell flex w-full flex-col items-center py-20 text-center lg:py-28">
          <SectionHead id="problem-heading" icon={Warning} eyebrow="The problem" tone="photo">
            A chat box writes the diff. <span className="tail">It cannot run it.</span>
          </SectionHead>

          <Reveal className="flex flex-col items-center">
            <p className="t-lead measure mt-7 text-balance text-white/76">
              Producing a patch is the part that already works. What a model cannot do from a text
              box is run the suite, read the failure, fix it, and show the change still holds an
              hour later.
            </p>
            <p className="t-body measure mt-4 text-balance text-white/58">
              So Kairox hands it a machine: a container of its own, on its own branch, with an event
              log of everything it did.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
