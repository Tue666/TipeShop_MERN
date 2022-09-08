import axiosInstance from './axiosInstance';

// models
import type {
  Resource,
  Operation,
  StatusResponse,
  RequiredBy,
  Role,
  DeletedProps,
} from '../models';

export interface CheckExistBody {
  names: Operation['name'][];
}
export interface CheckExistResponse {
  exist: boolean;
}

export interface CreateRoleBody extends RequiredBy<Partial<Omit<Role, '_id'>>, 'name'> {}
export interface CreateRoleResponse extends StatusResponse {
  role: Role;
}

export interface UpdateRoleParams extends Pick<Role, '_id'> {}
export interface UpdateRoleBody extends CreateRoleBody {}
export interface UpdateRoleResponse extends CreateRoleResponse {}

export interface CreateResourceBody
  extends RequiredBy<Partial<Omit<Resource, '_id' | 'children'>>, 'name'> {}
export interface CreateResourceResponse extends StatusResponse {
  resource: Resource;
}

export interface UpdateResourceParams extends Pick<Resource, '_id'> {}
export interface UpdateResourceBody extends CreateResourceBody {}
export interface UpdateResourceResponse extends CreateResourceResponse {}

export interface CreateOperationBody extends RequiredBy<Partial<Omit<Operation, '_id'>>, 'name'> {}
export interface CreateOperationResponse extends StatusResponse {
  operation: Operation;
}

export interface UpdateOperationParams extends Pick<Operation, '_id'> {}
export interface UpdateOperationBody extends CreateOperationBody {}
export interface UpdateOperationResponse extends CreateOperationResponse {}

export interface DeleteOperationParams extends Pick<Operation, '_id'> {}
export interface DeleteOperationResponse extends StatusResponse {
  deletedId: DeleteOperationParams['_id'];
}

export interface RestoreOperationParams extends Pick<Operation, '_id'> {}
export interface RestoreOperationResponse extends CreateOperationResponse {}

export interface DestroyOperationParams extends Pick<Operation, '_id'> {}
export interface DestroyOperationResponse extends DeleteOperationResponse {}

const accessControlApi = {
  //#region Role
  // [GET] /roles
  findAllRoles: (): Promise<Role[]> => {
    const url = `/roles`;
    return axiosInstance.get(url);
  },

  // [POST] /roles/exist
  checkRoleExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/roles/exist`;
    return axiosInstance.post(url, body);
  },

  // [POST] /roles
  createRole: (body: CreateRoleBody): Promise<CreateRoleResponse> => {
    const url = `/roles`;
    return axiosInstance.post(url, body);
  },

  // [PUT] /roles/:_id
  updateRole: (params: UpdateRoleParams, body: UpdateRoleBody): Promise<UpdateRoleResponse> => {
    const { _id } = params;
    const url = `/roles/${_id}`;
    return axiosInstance.put(url, body);
  },
  //#endregion

  //#region Resource
  // [GET] /resources/nested
  findAllResourcesWithNested: (): Promise<Resource[]> => {
    const url = `/resources/nested`;
    return axiosInstance.get(url);
  },

  // [POST] /resources/exist
  checkResourceExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/resources/exist`;
    return axiosInstance.post(url, body);
  },

  // [POST] /resources
  createResource: (body: CreateResourceBody): Promise<CreateResourceResponse> => {
    const url = `/resources`;
    return axiosInstance.post(url, body);
  },

  // [PUT] /resources/:_id
  updateResource: (
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
  findAllOperations: (): Promise<Operation[]> => {
    const url = `/operations`;
    return axiosInstance.get(url);
  },

  // [GET] /operations/deleted
  findAllOperationsDeleted: (): Promise<Array<Operation & DeletedProps>> => {
    const url = `/operations/deleted`;
    return axiosInstance.get(url);
  },

  // [POST] /operations/exist
  checkOperationExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/operations/exist`;
    return axiosInstance.post(url, body);
  },

  // [POST] /operations
  createOperation: (body: CreateOperationBody): Promise<CreateOperationResponse> => {
    const url = `/operations`;
    return axiosInstance.post(url, body);
  },

  // [PUT] /operations/:_id
  updateOperation: (
    params: UpdateOperationParams,
    body: UpdateOperationBody
  ): Promise<UpdateOperationResponse> => {
    const { _id } = params;
    const url = `/operations/${_id}`;
    return axiosInstance.put(url, body);
  },

  // [DELETE] /operations/:_id
  deleteOperation: (params: DeleteOperationParams): Promise<DeleteOperationResponse> => {
    const { _id } = params;
    const url = `/operations/${_id}`;
    return axiosInstance.delete(url);
  },

  // [PATCH] /operations/restore/:_id
  restoreOperation: (params: RestoreOperationParams): Promise<RestoreOperationResponse> => {
    const { _id } = params;
    const url = `/operations/restore/${_id}`;
    return axiosInstance.patch(url);
  },

  // [DELETE] /operations/destroy/:_id
  destroyOperation: (params: DestroyOperationParams): Promise<DestroyOperationResponse> => {
    const { _id } = params;
    const url = `/operations/destroy/${_id}`;
    return axiosInstance.delete(url);
  },
  //#endregion
};

export default accessControlApi;
