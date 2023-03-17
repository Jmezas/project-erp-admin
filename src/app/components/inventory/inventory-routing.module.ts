import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { AddMovementComponent } from "./add-movement/add-movement.component";
import { ConsultStockComponent } from "./consult-stock/consult-stock.component";
import { MovementComponent } from "./movement/movement.component";
import { AddInventoryComponent } from "./product-inventory/add-inventory/add-inventory.component";
import { ProductInventoryComponent } from "./product-inventory/product-inventory.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "list-movement",
        component: MovementComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Movimiento",
          breadcrumb: "Movimiento",
        },
      },
      {
        path: "add-movement",
        component: AddMovementComponent,
        canActivate: [AuthGuard],
        data: {
          title: " REGISTRO DE INGRESOS / SALIDAS",
          breadcrumb: "Agregar",
        },
      },
      {
        path: "consulta-stock",
        component: ConsultStockComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Consultar stock",
          breadcrumb: "consulta",
        },
      },
      {
        path: "product-inventory",
        component: ProductInventoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Producto en inventario",
          breadcrumb: "consulta",
        },
      },
      {
        path: "add-inventory",
        component: AddInventoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Agregar producto en inventario",
          breadcrumb: "Registrar",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
