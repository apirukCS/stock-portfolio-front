// src/global.d.ts
declare global {
  interface Window {
    handleCredentialResponse?: (
      response: google.accounts.id.CredentialResponse,
    ) => void;
  }
}

export {};
