import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InventoryRoutingModule } from "./inventory-routing.module";
import { MovementComponent } from "./movement/movement.component";
import { AddMovementComponent } from "./add-movement/add-movement.component";
import { CalendarModule } from "primeng/calendar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { NgSelectModule } from "@ng-select/ng-select";
import { DropdownModule } from "primeng/dropdown";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "src/app/shared/service/interceptor.service";
import { PaginatorModule } from "primeng/paginator";
import { ConsultStockComponent } from "./consult-stock/consult-stock.component";
import { ImageModule } from "primeng/image";
@NgModule({
  declarations: [MovementComponent, AddMovementComponent, ConsultStockComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    NgSelectModule,
    DropdownModule,
    CKEditorModule,
    NgxDropzoneModule,
    NgxSpinnerModule,
    PaginatorModule,
    ImageModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
})
export class InventoryModule {}
