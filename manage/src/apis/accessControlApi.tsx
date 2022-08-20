import axiosInstance from './axiosInstance';

// models
import type { Resources, Resource, Operation, StatusResponse, RequiredBy } from '../models';

export interface CheckExistBody {
  names: Operation['name'][];
}
export interface CheckExistResponse {
  exist: boolean;
}

export interface InsertOperationBody extends RequiredBy<Partial<Omit<Operation, '_id'>>, 'name'> {}
export interface InsertOperationResponse extends StatusResponse {
  operation: Operation;
}

export interface UpdateOperationParams extends Pick<Operation, '_id'> {}
export interface UpdateOperationBody extends InsertOperationBody {}
export interface UpdateOperationResponse extends InsertOperationResponse {}

export interface InsertResourceBody extends RequiredBy<Partial<Omit<Resource, '_id'>>, 'name'> {}
export interface InsertResourceResponse extends StatusResponse {
  resource: Resource;
}

const accessControlApi = {
  //#region Resource
  // [GET] /resources/nested
  findAllResourceWithNested: (): Promise<Resources> => {
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
