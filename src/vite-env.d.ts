/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Password required to create or edit bookings. */
  readonly VITE_BOOKING_PASSWORD?: string;
  /** Password required to change studio settings or reset data. */
  readonly VITE_ADMIN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
