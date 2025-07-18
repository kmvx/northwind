interface IAddress {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  region: string;
}

export interface ICategory {
  categoryId: number;
  categoryName: string;
  description: string;
}
export type ICategories = ICategory[];

export interface ICustomer extends IAddress {
  companyName: string;
  contactName: string;
  contactTitle: string;
  customerId: string;
  fax: string;
  phone: string;
}
export type ICustomers = ICustomer[];

export interface IEmployee extends IAddress {
  birthDate: string;
  employeeId: number;
  firstName: string;
  homePhone: string;
  lastName: string;
  notes: string;
  reportsTo: number;
  title: string;
  titleOfCourtesy: string;
  photo: string;
  photoPath: string;
}
export type IEmployees = IEmployee[];

export interface IOrder {
  customerId: string;
  employeeId: number;
  freight: number;
  orderDate: string;
  orderId: number;
  requiredDate: string;
  shipAddress: string;
  shipCity: string;
  shipCountry: string;
  shipName: string;
  shipPostalCode: string;
  shipRegion: string;
  shipVia: number;
  shippedDate: string | null;
}
export type IOrders = IOrder[];

export interface IOrderDetail {
  discount: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}
export type IOrderDetails = IOrderDetail[];

export interface IProduct {
  categoryId: number;
  discontinued: boolean;
  productName: string;
  quantityPerUnit: string;
  supplierId: number;
  reorderLevel: number;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
}
export type IProducts = IProduct[];

export interface IShipper {
  companyName: string;
  phone: string;
  shipperId: number;
}
export type IShippers = IShipper[];

export interface ISupplier extends IAddress {
  companyName: string;
  contactName: string;
  contactTitle: string;
  phone: string;
  supplierId: number;
}
export type ISuppliers = ISupplier[];

export interface ITerritory {
  territoryId: number;
  territoryDescription: string;
  regionId: number;
}
export type ITerritories = ITerritory[];

export interface IRegion {
  regionId: number;
  regionDescription: string;
}
export type IRegions = IRegion[];
