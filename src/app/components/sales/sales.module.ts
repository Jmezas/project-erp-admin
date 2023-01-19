import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SalesRoutingModule } from "./sales-routing.module";
import { OrdersComponent } from "./orders/orders.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { SharedModule } from "src/app/shared/shared.module";
import { NewSaleComponent } from "./new-sale/new-sale.component";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TableModule } from "primeng/table";
import { NgSelectModule } from "@ng-select/ng-select";
import { CheckboxModule } from "primeng/checkbox";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgxDropzoneModule } from "ngx-dropzone";
import { PaginatorModule } from "primeng/paginator";
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "src/app/shared/service/interceptor.service";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
@NgModule({
  declarations: [OrdersComponent, NewSaleComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    NgbModule,
    FormsModule,
    Ng2SearchPipeModule,
    SharedModule,
    Ng2SearchPipeModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    TableModule,
    CheckboxModule,
    NgSelectModule,
    CKEditorModule,
    NgxDropzoneModule,
    PaginatorModule,
    NgxSpinnerModule,
    NgxExtendedPdfViewerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
})
export class SalesModule {}
