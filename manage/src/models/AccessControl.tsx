export interface Operation {
  _id: string;
  name: string;
  description: string;
  locked: boolean;
}

export type RootResource = 'accounts' | 'products' | 'access control';

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
  resource: Resource['name'];
  operations: Operation['name'][];
}
