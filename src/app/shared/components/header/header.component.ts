import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NavService } from "../../service/nav.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService) {
    console.log("va", this.navServices.pdrVenta);
    // this.open = !this.open;
    // this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar;
    this.rightSidebarEvent.emit(this.right_sidebar);
  }

  openMobileNav() {
    this.openNav = !this.openNav;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  cerrarVenta() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.openNav = !this.openNav;
  }

  ngOnInit() {}
}
