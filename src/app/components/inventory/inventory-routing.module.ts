import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { AddMovementComponent } from "./add-movement/add-movement.component";
import { ConsultStockComponent } from "./consult-stock/consult-stock.component";
import { MovementComponent } from "./movement/movement.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
