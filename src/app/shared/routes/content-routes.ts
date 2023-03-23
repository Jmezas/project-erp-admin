import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "dashboard",
    loadChildren: () => import("../../components/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "products",
    loadChildren: () => import("../../components/products/products.module").then((m) => m.ProductsModule),
    data: {
      breadcrumb: "Productos",
    },
  },
  {
    path: "sales",
    loadChildren: () => import("../../components/sales/sales.module").then((m) => m.SalesModule),
    data: {
      breadcrumb: "Ventas",
    },
  },

  {
    path: "users",
    loadChildren: () => import("../../components/users/users.module").then((m) => m.UsersModule),
    data: {
      breadcrumb: "Usuario",
    },
  },

  {
    path: "customers",
    loadChildren: () => import("../../components/customers/customers.module").then((m) => m.CustomersModule),
    data: {
      breadcrumb: "Cliente",
    },
  },
  {
    path: "inventory",
    loadChildren: () => import("../../components/inventory/inventory.module").then((m) => m.InventoryModule),
    data: {
      breadcrumb: "Inventario",
    },
  },
  {
    path: "reports",
    loadChildren: () => import("../../components/reports/reports.module").then((m) => m.ReportsModule),
    data: {
      breadcrumb: "Reportes",
    },
  },
  {
    path: "settings",
    loadChildren: () => import("../../components/setting/setting.module").then((m) => m.SettingModule),
    data: {
      breadcrumb: "Configuración",
    },
  },
];
