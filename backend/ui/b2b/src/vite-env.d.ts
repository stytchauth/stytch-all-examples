/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STYTCH_PUBLIC_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
