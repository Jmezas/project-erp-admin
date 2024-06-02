import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { DeleteSaleComponent } from "./delete-sale/delete-sale.component";
import { NewSaleComponent } from "./new-sale/new-sale.component";
import { OrdersComponent } from "./orders/orders.component";
import { TypePaymentComponent } from "./type-payment/type-payment.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "list-sales",
        component: OrdersComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Venta",
          breadcrumb: "Venta",
        },
      },

      {
        path: "new-sale",
        component: NewSaleComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Nueva venta",
          breadcrumb: "Transactions",
        },
      },
      {
        path: "type-payment",
        component: TypePaymentComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Tipo de pago",
          breadcrumb: "Tipo de pago",
        },
      },
      {
        path: "delete-sale",
        component: DeleteSaleComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Eliminar venta",
          breadcrumb: "Venta",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
