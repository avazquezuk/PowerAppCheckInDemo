/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Service provider: 'mock' or 'bc' */
  readonly VITE_SERVICE_PROVIDER?: 'mock' | 'bc';
  
  /** Business Central base URL */
  readonly VITE_BC_BASE_URL?: string;
  
  /** Business Central API version */
  readonly VITE_BC_API_VERSION?: string;
  
  /** Business Central Company ID */
  readonly VITE_BC_COMPANY_ID?: string;
  
  /** Business Central Tenant ID */
  readonly VITE_BC_TENANT_ID?: string;
  
  /** Development mode flag */
  readonly DEV: boolean;
  
  /** Production mode flag */
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
