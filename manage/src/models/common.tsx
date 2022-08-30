//
import { Account } from './Account';

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type NullableBy<T, K extends keyof T> = Omit<T, K> & Record<K, T[K] | null>;

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

export interface DeletedProps {
  deletedAt: String;
  deletedBy: {
    _id: Account['_id'];
    name: Account['name'];
  };
}

// app
export interface ReducerPayloadAction<T, K> {
  type: K;
  payload?: T;
}

export type UploadFileType =
  | {
      file: File;
      preview: string;
    }
  | string
  | null;
