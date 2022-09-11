export interface Operation {
  _id: string;
  name: string;
  description: string;
  locked: boolean;
}

export type RootResource =
  | 'customer service'
  | 'accounts'
  | 'products'
  | 'access control'
  | 'recycle bin';

export interface Resource {
  _id: string;
  name: string;
  description: string;
  parent_id: Resource['_id'] | null;
  operations: Operation[];
  locked: boolean;
  children: Resource[];
  level?: number;
}

export type Resources = {
  [key in RootResource]?: Resource;
};

export interface Permission {
  resource: Resource['_id'][];
  operations: Operation['_id'][];
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
