import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FeatherIconsComponent } from "./components/feather-icons/feather-icons.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { ToggleFullscreenDirective } from "./directives/fullscreen.directive";
import { ContentLayoutComponent } from "./layout/content-layout/content-layout.component";
import { NavService } from "./service/nav.service";
import { WINDOW_PROVIDERS } from "./service/windows.service";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { RightSidebarComponent } from "./components/right-sidebar/right-sidebar.component";
import { TableService } from "./service/table.service";
import { NgbdSortableHeader } from "./directives/NgbdSortableHeader";
import { GeneralComponent } from "./components/general/general.component";
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { Error404Component } from "./components/error404/error404.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    ToggleFullscreenDirective,
    FeatherIconsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    NgbdSortableHeader,
    GeneralComponent,
    Error404Component,
  ],
    imports: [CommonModule, RouterModule, TableModule, PaginatorModule, ReactiveFormsModule, NgxSpinnerModule, NgbPagination],
  providers: [NavService, TableService, WINDOW_PROVIDERS],
  exports: [FeatherIconsComponent, ToggleFullscreenDirective, NgbdSortableHeader],
})
export class SharedModule {}
