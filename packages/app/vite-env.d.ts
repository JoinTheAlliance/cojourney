// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Define your environment variables here
    readonly VITE_SERVER_URL: string
    // Add more environment variables as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
