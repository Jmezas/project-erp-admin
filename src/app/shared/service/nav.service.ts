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
  treeMenu: any[] = [];
  MENUITEMS: Menu[] = [];
  // Windows width
  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  constructor(@Inject(WINDOW) private window, private authRutes: AuthService) {
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
  }
  menuItem(): Menu[] {
    const menuLocal = JSON.parse(localStorage.getItem("MENU"));
    console.log(menuLocal);
    menuLocal.forEach((element) => {
      element.forEach((element2) => {
        this.treeMenu.push(element2);
      });
    });

    let hash = {};
    this.treeMenu = this.treeMenu.filter((o) => (hash[o.id] ? false : (hash[o.id] = true))).sort();
    this.treeMenu.map((menu) => (menu.code_menu = menu.code_menu == null ? 0 : menu.code_menu));
    const menuEntriesMap = {};
    menuEntriesMap[0] = {
      children: [],
    };
    // Register all menu entries to map
    this.treeMenu.forEach((entry) => {
      menuEntriesMap[entry.id] = {
        id: entry.id,
        path: entry.path,
        name: entry.name,
        type: entry.type,
        icon: entry.icon,
        children: [],
      };
    });
    // Add all children to their parent
    this.treeMenu.forEach((entry) => {
      menuEntriesMap[entry.code_menu]?.children?.push(menuEntriesMap[entry.id]);
    });

    menuEntriesMap[0].children.forEach((element) => {
      this.MENUITEMS.push(this.armarMenu(element));
    });
    console.log(this.MENUITEMS);
    return this.MENUITEMS;
  }
  armarMenu(treeMenu: any): Menu {
    let menu: Menu = {
      title: treeMenu.name,
      icon: treeMenu.icon,
      type: treeMenu.type,
      active: false,
      path: treeMenu.path,
      children: [],
    };
    if (treeMenu.children) {
      treeMenu.children.forEach((item) => {
        menu.children.push(this.armarMenu(item));
      });
    }
    if (!menu.children.length) {
      delete menu.children;
    }
    if (!menu.path) {
      delete menu.path;
    }
    return menu;
  }
  items(): Observable<Menu[]> {
    return new Observable((observer: Subscriber<Menu[]>) => {
      observer.next(this.menuItem());
      observer.complete();
    });
  }
  // items = new BehaviorSubject<Menu[]>(this.menuItem());
}
