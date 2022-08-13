import { PermissionProps } from '../config';
// apis
export interface StatusResponse {
  msg: string;
}

export interface PaginationParams {
  page: number;
  number: number;
  [key: string]: any;
}

export interface PaginationProps {
  totalPage: number;
  currentPage: number;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: PaginationProps;
  [key: string]: any;
}
// app
export interface AccessActionGuardProps {
  currentActions: PermissionProps['actions'];
  actions: PermissionProps['actions'];
}

export type UploadFileType =
  | {
      file: File;
      preview: string;
    }
  | string;
