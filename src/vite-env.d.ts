/// <reference types="vite/client" />

// vite-imagetools 12 ships no client types, so the one output format this project uses is declared
// here. `as=metadata` resolves to the emitted asset plus its real pixel dimensions, which is what
// keeps width and height on every <img>.
declare module "*as=metadata" {
  const metadata: {
    src: string;
    width: number;
    height: number;
    format: string;
  };
  export default metadata;
}

interface ImportMetaEnv {
  readonly VITE_WAITLIST_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
