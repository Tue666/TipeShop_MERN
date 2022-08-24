import axiosInstance from './axiosInstance';

// models
import type { Resource, Operation, StatusResponse, RequiredBy, Role } from '../models';

export interface CheckExistBody {
  names: Operation['name'][];
}
export interface CheckExistResponse {
  exist: boolean;
}

export interface InsertRoleBody extends RequiredBy<Partial<Omit<Role, '_id'>>, 'name'> {}
export interface InsertRoleResponse extends StatusResponse {
  role: Role;
}

export interface InsertResourceBody
  extends RequiredBy<Partial<Omit<Resource, '_id' | 'children'>>, 'name'> {}
export interface InsertResourceResponse extends StatusResponse {
  resource: Resource;
}

export interface UpdateResourceParams extends Pick<Role, '_id'> {}
export interface UpdateResourceBody extends InsertResourceBody {}
export interface UpdateResourceResponse extends InsertResourceResponse {}

export interface InsertOperationBody extends RequiredBy<Partial<Omit<Operation, '_id'>>, 'name'> {}
export interface InsertOperationResponse extends StatusResponse {
  operation: Operation;
}

export interface UpdateOperationParams extends Pick<Operation, '_id'> {}
export interface UpdateOperationBody extends InsertOperationBody {}
export interface UpdateOperationResponse extends InsertOperationResponse {}

const accessControlApi = {
  //#region Role
  // [GET] /roles
  findAllRole: (): Promise<Role[]> => {
    const url = `/roles`;
    return axiosInstance.get(url);
  },

  // [POST] /roles/exist
  checkRoleExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/roles/exist`;
    return axiosInstance.post(url, body);
  },

  // [POST] /roles
  insertRole: (body: InsertRoleBody): Promise<InsertRoleResponse> => {
    const url = `/roles`;
    return axiosInstance.post(url, body);
  },
  //#endregion

  //#region Resource
  // [GET] /resources/nested
  findAllResourceWithNested: (): Promise<Resource[]> => {
    const url = `/resources/nested`;
    return axiosInstance.get(url);
  },

  // [POST] /resources/exist
  checkResourceExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/resources/exist`;
    return axiosInstance.post(url, body);
  },

  // [POST] /resources
  insertResource: (body: InsertResourceBody): Promise<InsertResourceResponse> => {
    const url = `/resources`;
    return axiosInstance.post(url, body);
  },

  // [PUT] /resources/:_id
  editResource: (
    params: UpdateResourceParams,
    body: UpdateResourceBody
  ): Promise<UpdateResourceResponse> => {
    const { _id } = params;
    const url = `/resources/${_id}`;
    return axiosInstance.put(url, body);
  },
  //#endregion

  //#region Operation
  // [GET] /operations
  findAllOperation: (): Promise<Operation[]> => {
    const url = `/operations`;
    return axiosInstance.get(url);
  },

  // [POST] /operations/exist
  checkOperationExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/operations/exist`;
    return axiosInstance.post(url, body);
  },

  // [POST] /operations
  insertOperation: (body: InsertOperationBody): Promise<InsertOperationResponse> => {
    const url = `/operations`;
    return axiosInstance.post(url, body);
  },

  // [PUT] /operations/:_id
  editOperation: (
    params: UpdateOperationParams,
    body: UpdateOperationBody
  ): Promise<UpdateOperationResponse> => {
    const { _id } = params;
    const url = `/operations/${_id}`;
    return axiosInstance.put(url, body);
  },
  //#endregion
};

export default accessControlApi;
