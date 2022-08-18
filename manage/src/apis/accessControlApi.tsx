import axiosInstance from './axiosInstance';

// models
import type { Resources, Operation } from '../models';

const accessControlApi = {
  //#region Resource
  // [GET] /resources/nested
  findAllResourceWithNested: (): Promise<Resources> => {
    const url = `/resources/nested`;
    return axiosInstance.get(url);
  },
  //#endregion

  //#region Operation
  // [GET] /operations
  findAllOperation: (): Promise<Operation[]> => {
    const url = `/operations`;
    return axiosInstance.get(url);
  },
  //#endregion
};

export default accessControlApi;
