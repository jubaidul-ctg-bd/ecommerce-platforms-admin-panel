export interface TableListItem {
  key: number;
  id: string;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;


  shopName: string;
  username:string;
  password:string;
  cellNo: string;
  mail: string;
  address: string;
  DOB: string;
  gender: string;
  nationality: string;
  role: string;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedBy: string;
  UpdatedAt: string;
  
  user:users
  userid:ObjectID;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;

  id?: string;

  shopName?: string;
  username?:string;
  password?:string;
  cellNo?: string;
  mail?: string;
  address?: string;
  DOB?: string;
  gender?: string;
  nationality?: string;
  role?: string;
  CreatedBy?: string;
  CreatedAt?: string;
  UpdatedBy?: string;
  UpdatedAt?: string;
  
  user?:users
  userid?:ObjectID;

  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
