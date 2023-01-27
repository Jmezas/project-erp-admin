import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SettingRoutingModule } from "./setting-routing.module";
import { ProfileComponent } from "./profile/profile.component";
import { SharedModule } from "../../shared/shared.module";
import { CompanyComponent } from "./company/company.component";
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxSpinnerModule } from "ngx-spinner";
import { RolesComponent } from "./roles/roles.component";
import { WarehouseComponent } from "./warehouse/warehouse.component";
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { DropdownModule } from "primeng/dropdown";
import { AddRolesComponent } from "./roles/add-roles/add-roles.component";
import { MenusComponent } from "./menus/menus.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { TreeModule } from "primeng/tree";
import { SeriesComponent } from './series/series.component';
@NgModule({
  declarations: [
    ProfileComponent,
    CompanyComponent,
    RolesComponent,
    WarehouseComponent,
    AddRolesComponent,
    MenusComponent,
    SeriesComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    SettingRoutingModule,
    SharedModule,
    NgxDropzoneModule,
    NgxSpinnerModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    NgSelectModule,
    TreeModule,
  ],
})
export class SettingModule {}
