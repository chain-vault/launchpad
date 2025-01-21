import { FilePreviewType } from '@app-types/index';

export interface TokenFormInput {
  fileArweaveId: string;
  tokenLogo: { path: string } | File | null;
  tokenLogoFilePreview: FilePreviewType | null;
  tokenName: string;
  tokenSupply: string;
  tokenTicker: string;
}

export type TokenDataKey = keyof TokenFormInput;
export interface UpdateTokenPayload {
  key: TokenDataKey;
  value: File | FilePreviewType | null | string;
}

export interface ProjectDetailsInput {
  projectDescription: string;
  roadmap: string;
  website: string;
  whitePaper: string;
}

export type SalesDataKey = keyof ProjectDetailsInput;

export interface UpdateProjectPayload {
  key: SalesDataKey;
  value: string;
}

export interface SocialsInput {
  discord: string;
  github: string;
  telegram: string;
  twitter: string;
}

export type SocialsDataKey = keyof SocialsInput;

export interface UpdateSocialsPayload {
  key: SocialsDataKey;
  value: string;
}

export interface LaunchInfoInput {
  date: Date | null;
  spotPrice: string;
  startWeight: number;
  tokenAmount: string;
}

export type LaunchDataKey = keyof LaunchInfoInput;

export interface UpdateLauncDataPayload {
  key: LaunchDataKey;
  value: Date | null | number | string;
}
export interface FormState {
  launchInfo: boolean;
  projectInfo: boolean;
  socialsInfo: boolean;
  tokenInfo: boolean;
}

export interface UpdateFormStateAction {
  key: keyof FormState;
  value: boolean;
}

export interface PoolAndTokenInititialiseData {
  formState: FormState;
  isDeleted?: boolean;
  launchInfo: LaunchInfoInput;
  metadatafileArviewId: string;
  projectInfo: ProjectDetailsInput;
  socialsInfo: SocialsInput;
  tokenInfo: TokenFormInput;
}

export type TokenAndPoolAtomType = Record<string, PoolAndTokenInititialiseData>;

export enum UpdateActionType {
  ADD_NEW = 'ADD_NEW',
  CLEAR_ALL = 'CLEAR_ALL',
  FAIL_TRANSACTIONS = 'FAIL_TRANSACTIONS',
  RETRY = 'RETRY',
  UPDATE_ALL_STATUSES = 'UPDATE_ALL_STATUSES',
  UPDATE_STATUS = 'UPDATE_STATUS',
  UPDATE_STEP_DETAILS = 'UPDATE_STEP_DETAILS',
}
