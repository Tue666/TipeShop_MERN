import { PermissionProps } from '../config';

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
}

export interface AccessActionGuardProps {
  currentActions: PermissionProps['actions'];
  actions: PermissionProps['actions'];
}
