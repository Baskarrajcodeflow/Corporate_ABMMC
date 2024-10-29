// salary-file-status.enum.ts
export enum SalaryFileStatus {
    UPLOADED = 'UPLOADED',
    SANITY_CHECK_PENDING = 'SANITY_CHECK_PENDING',
    SANITY_CHECK_FAILED = 'SANITY_CHECK_FAILED',
    SANITY_CHECK_SUCCESS = 'SANITY_CHECK_SUCCESS',
    RISK_ANALYSIS_INITIATED = 'RISK_ANALYSIS_INITIATED',
    RISK_FLAGED = 'RISK_FLAGED',
    RISK_NO_RISK = 'RISK_NO_RISK',
    SCHEDULED = 'SCHEDULED',
    LIVE = 'LIVE',
    CANCELED = 'CANCELED',
    SUSPENDED = 'SUSPENDED',
    SUCCESS = 'SUCCESS',
    PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  }
  