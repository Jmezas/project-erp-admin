import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoryComponent } from "./category/category.component";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { UnitComponent } from "./unit/unit.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "category",
        component: CategoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Categoría",
          breadcrumb: "Categoría",
        },
      },
      {
        path: "sub-category",
        component: SubCategoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Sub categoría",
          breadcrumb: "Sub categoría",
        },
      },
      {
        path: "Unit",
        component: UnitComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Unidad Medida",
          breadcrumb: "Unidad Medida",
        },
      },
      {
        path: "product-list",
        component: ProductListComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Lista producto",
          breadcrumb: "Lista producto",
        },
      },

      {
        path: "add-product",
        component: AddProductComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Agregar producto",
          breadcrumb: "Agregar producto",
        },
      },
      {
        path: ":id/edit-product",
        component: AddProductComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Actualizar producto",
          breadcrumb: "Actualizar Producto",
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
