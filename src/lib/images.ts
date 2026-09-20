import closingCloudtop from "@assets/closing-cloudtop-duo.png?w=1536&format=webp&quality=70&as=metadata";
import heroContainer from "@assets/hero-container-duo.png?w=1400&format=webp&quality=72&as=metadata";
import heroTerminal from "@assets/hero-terminal-duo.png?w=1600&format=webp&quality=72&as=metadata";
import lineEventlog from "@assets/line-eventlog-alpha.png?w=240&format=webp&quality=72&as=metadata";
import lineGit from "@assets/line-git-alpha.png?w=240&format=webp&quality=72&as=metadata";
import lineLoop from "@assets/line-loop-alpha.png?w=640&format=webp&quality=72&as=metadata";
import lineSandbox from "@assets/line-sandbox-alpha.png?w=800&format=webp&quality=72&as=metadata";

export interface Image {
  src: string;
  width: number;
  height: number;
}

export const images = {
  heroTerminal,
  heroContainer,
  closingCloudtop,
  lineSandbox,
  lineGit,
  lineEventlog,
  lineLoop,
} satisfies Record<string, Image>;
