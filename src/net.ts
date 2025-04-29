import { useQuery } from '@tanstack/react-query';
import {
  ICategories,
  ICustomer,
  ICustomers,
  IEmployee,
  IEmployees,
  IOrder,
  IOrderDetails,
  IOrders,
  IProduct,
  IProducts,
  IRegions,
  IShipper,
  IShippers,
  ISupplier,
  ISuppliers,
  ITerritories,
} from './models';

const API_URL = 'https://demodata.grapecity.com/northwind/api/v1';

// Orders

export const useQueryOrders = ({
  isCustomersPage,
  isEmployeesPage,
  isShippersPage,
  id,
}: {
  isCustomersPage?: boolean;
  isEmployeesPage?: boolean;
  isShippersPage?: boolean;
  id?: string;
} = {}) => {
  return useQuery<IOrders>({
    queryKey: [
      API_URL +
        (isCustomersPage
          ? '/Customers/'
          : isEmployeesPage
            ? '/Employees/'
            : isShippersPage
              ? '/Shippers/'
              : '') +
        (id || '') +
        '/Orders',
    ],
  });
};

export const useQueryOrder = ({ id }: { id: string | undefined }) => {
  return useQuery<IOrder>({
    queryKey: [API_URL + '/Orders/' + id],
  });
};

export const useQueryOrderDetails = ({
  isOrdersPage,
  id,
}: {
  isOrdersPage: boolean;
  id: string | undefined;
}) => {
  return useQuery<IOrderDetails>({
    queryKey: [
      API_URL +
        (isOrdersPage ? '/Orders/' : '/Products/') +
        id +
        '/OrderDetails',
    ],
  });
};

// Employees

export const useQueryEmployees = () => {
  return useQuery<IEmployees>({
    queryKey: [API_URL + '/Employees'],
  });
};

export const useQueryEmployee = ({
  id,
  enabled = true,
}: {
  id: string | number | undefined;
  enabled?: boolean;
}) => {
  return useQuery<IEmployee>({
    queryKey: [API_URL + '/Employees/' + id],
    enabled,
  });
};

export const useQueryOrderEmployee = ({ id }: { id: string | undefined }) => {
  return useQuery<IEmployee>({
    queryKey: [API_URL + '/Orders/' + id + '/Employee'],
  });
};

export const useEmployeeTeritories = ({
  employeeId,
}: {
  employeeId: string | undefined;
}) => {
  return useQuery<ITerritories>({
    queryKey: [API_URL + '/Employees/' + employeeId + '/Territories'],
  });
};

// Shippers

export const useQueryShippers = () => {
  return useQuery<IShippers>({
    queryKey: [API_URL + '/Shippers'],
  });
};

export const useQueryOrderShipper = ({ id }: { id: string | undefined }) => {
  return useQuery<IShipper>({
    queryKey: [API_URL + '/Orders/' + id + '/Shipper'],
  });
};

// Suppliers

export const useQuerySuppliers = () => {
  return useQuery<ISuppliers>({
    queryKey: [API_URL + '/Suppliers'],
  });
};

export const useQuerySupplier = ({
  id,
  enabled = true,
}: {
  id: string | number | undefined;
  enabled?: boolean;
}) => {
  return useQuery<ISupplier>({
    queryKey: [API_URL + '/Suppliers/' + id],
    enabled,
  });
};

// Products

export const useQueryProducts = () => {
  return useQuery<IProducts>({
    queryKey: [API_URL + '/Products'],
  });
};

export const useQueryOrderProducts = ({
  id,
  enabled = true,
}: {
  id: string | undefined;
  enabled?: boolean;
}) => {
  return useQuery<IProducts>({
    queryKey: [API_URL + '/Orders/' + id + '/Products'],
    enabled,
  });
};

export const useQueryProduct = ({ id }: { id: string | undefined }) => {
  return useQuery<IProduct>({
    queryKey: [API_URL + '/Products/' + id],
  });
};

export const useQueryCategories = () => {
  return useQuery<ICategories>({
    queryKey: [API_URL + '/Categories'],
  });
};

// Customers

export const useQueryCustomers = () => {
  return useQuery<ICustomers>({
    queryKey: [API_URL + '/Customers'],
  });
};

export const useQueryCustomer = ({ id }: { id: string | undefined }) => {
  return useQuery<ICustomer>({
    queryKey: [API_URL + '/Customers/' + id],
  });
};

export const useQueryOrderCustomer = ({ id }: { id: string | undefined }) => {
  return useQuery<ICustomer>({
    queryKey: [API_URL + '/Orders/' + id + '/Customer'],
  });
};

export const useQueryRegions = () => {
  return useQuery<IRegions>({
    queryKey: [API_URL + '/Regions'],
  });
};
