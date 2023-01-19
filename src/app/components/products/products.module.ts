import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ProductsRoutingModule } from "./products-routing.module";
import { CategoryComponent } from "./physical/category/category.component";
import { SubCategoryComponent } from "./physical/sub-category/sub-category.component";
import { ProductListComponent } from "./physical/product-list/product-list.component";
import { AddProductComponent } from "./physical/add-product/add-product.component";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import "hammerjs";
import "mousetrap";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgxDropzoneModule } from "ngx-dropzone";
// search module
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { SharedModule } from "src/app/shared/shared.module";
// import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
// import {  } from '../../directives/shorting.directive/';
//ng prime
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { DropdownModule } from "primeng/dropdown";
import { MessagesModule } from "primeng/messages";
import { UnitComponent } from "./physical/unit/unit.component";
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    CategoryComponent,
    SubCategoryComponent,
    ProductListComponent,
    AddProductComponent,
    UnitComponent,
  ],
  imports: [
    Ng2SearchPipeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgbModule,
    GalleryModule,
    CKEditorModule,
    NgxDropzoneModule,
    SharedModule,
    TableModule,
    PaginatorModule,
    MessagesModule,
    DropdownModule,
    NgxSpinnerModule,
  ],
  exports: [SubCategoryComponent],
  bootstrap: [SubCategoryComponent],
  providers: [NgbActiveModal],
})
export class ProductsModule {}
