import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoryComponent } from "./physical/category/category.component";
import { SubCategoryComponent } from "./physical/sub-category/sub-category.component";
import { ProductListComponent } from "./physical/product-list/product-list.component";
import { AddProductComponent } from "./physical/add-product/add-product.component";
import { UnitComponent } from "./physical/unit/unit.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "physical/category",
        component: CategoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Category",
          breadcrumb: "Category",
        },
      },
      {
        path: "physical/sub-category",
        component: SubCategoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category",
        },
      },
      {
        path: "physical/Unit",
        component: UnitComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Unidad Medida",
          breadcrumb: "Unidad Medida",
        },
      },
      {
        path: "physical/product-list",
        component: ProductListComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Lista Producto",
          breadcrumb: "Product List",
        },
      },

      {
        path: "physical/add-product",
        component: AddProductComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Agregar Producto",
          breadcrumb: "Add Product",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
