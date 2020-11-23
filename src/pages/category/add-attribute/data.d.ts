export interface TableListItem {
  key: number;
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
  id:string;
  title: string;
  parentCategoryTitle: string;
  order: string;
  description: string;
  icon: string;
  image: string;
  banner: string; 
  banner: string;
  slug: string 
  parentCategories: [];
  attrOption:any[];
  categoriesId: string;
  attrTitle: string;
  attrType: string;
  type: string;
  termValues: any
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
  parentCategories: any;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id?:string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  title?: string;
  parentCategoryTitle?: string;
  order?: string;
  description?: string;
  icon?: string;
  image?: string;
  banner?: string; 
  slug?: string;
  pageSize?: number;
  currentPage?: number;
  parentCategories?: [];
  attrOption?:any[];
  termValues?: any;
  categoriesId?: string;
  type?:string;
  attrTitle?: string;
  attrType?: string;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
