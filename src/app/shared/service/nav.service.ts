import { Injectable, HostListener, Inject } from "@angular/core";
import { BehaviorSubject, Observable, Subscriber } from "rxjs";
import { AuthService } from "./auth.service";
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService {
  pdrVenta: boolean;
  public screenWidth: any;
  public collapseSidebar: boolean = false;
  treeMenu: any[];
  constructor(@Inject(WINDOW) private window, private authRutes: AuthService) {
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
    this.treeMenu = this.authRutes.getUserInfo().menu;
    // this.armarMenu();
  }

  // Windows width
  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  //  MENUITEMS: Menu[] = [];
  MENUITEMS: Menu[] = [
    {
      path: "/dashboard/default",
      title: "Dashboard",
      icon: "home",
      type: "link",
      badgeType: "primary",
      active: false,
    },
    {
      title: "Productos",
      icon: "box",
      type: "sub",
      active: false,
      children: [
        {
          title: "Físico",
          type: "sub",
          icon: "box",
          children: [
            { path: "/products/physical/category", title: "Categoria", type: "link", icon: "box" },
            { path: "/products/physical/sub-category", title: "Sub Categoria", type: "link" },
            { path: "/products/physical/Unit", title: "Unidad Medida", type: "link" },
            { path: "/products/physical/product-list", title: "Lista Producto", type: "link" },
            { path: "/products/physical/add-product", title: "Agregar Producto", type: "link" },
          ],
        },
      ],
    },
    {
      title: "Venta",
      icon: "dollar-sign",
      type: "sub",
      active: false,
      children: [
        { path: "/sales/orders", title: "Lista Venta", type: "link" },
        { path: "/sales/new-sale", title: "Venta", type: "link" },
      ],
    },
    {
      title: "Inventario",
      icon: "user-plus",
      type: "sub",
      active: false,
      children: [
        { path: "/inventory/list-movement", title: "Lista Movimiento", type: "link" },
        { path: "/inventory/add-movement", title: "Generar Movimiento", type: "link" },
        { path: "/inventory/consulta-stock", title: "Consultar stock", type: "link" },
      ],
    },

    {
      title: "Users",
      icon: "user-plus",
      type: "sub",
      active: false,
      children: [
        { path: "/users/list-user", title: "User List", type: "link" },
        { path: "/users/create-user", title: "Create User", type: "link" },
      ],
    },
    {
      title: "Clientes",
      icon: "users",
      type: "sub",
      active: false,
      children: [
        { path: "/customers/list-customers", title: "Lista cliente ", type: "link" },
        { path: "/customers/create-customers", title: "Crear cliente", type: "link" },
      ],
    },

    {
      title: "Reports",
      path: "/reports",
      icon: "bar-chart",
      type: "link",
      active: false,
    },
    {
      title: "Settings",
      icon: "settings",
      type: "sub",
      children: [
        { path: "/settings/profile", title: "Profile", type: "link" },
        { path: "/settings/general", title: "General", type: "link" },
        { path: "/settings/roles", title: "Roles", type: "link" },
        { path: "/settings/warehouse", title: "Almacen", type: "link" },
        { path: "/settings/menu", title: "Menu", type: "link" },
      ],
    },

    {
      title: "Login",
      path: "/auth/login",
      icon: "log-in",
      type: "link",
      active: false,
    },
  ];
  armarMenu() {
    this.treeMenu.forEach((element) => {
      let menu: Menu = {
        title: element.name,
        icon: element.icon,
        type: element.type,
        active: false,
        path: element.path,
        children: [],
      };
      element.children.forEach((item) => {
        let menuChildren: Menu = {
          title: item.name,
          //icon: element.icon,
          type: element.type,
          path: item.path,
          active: false,
          children: [],
        };
        item.children.forEach((item2) => {
          let menuChildren2: Menu = {
            path: item2.path,
            title: item2.name,
            //icon: element.icon,
            //active: false,
            type: item2.type,
          };

          menuChildren.children.push(menuChildren2);
        });
        if (menuChildren.children.length == 0) {
          delete menuChildren.children;
        }
        if (menuChildren.path == null) {
          delete menuChildren.path;
        }
        menu.children.push(menuChildren);
      });
      if (menu.children.length == 0) {
        delete menu.children;
      }
      if (menu.path == null) {
        delete menu.path;
      }
      this.MENUITEMS.push(menu);
    });
    console.log(this.MENUITEMS);
  }

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
