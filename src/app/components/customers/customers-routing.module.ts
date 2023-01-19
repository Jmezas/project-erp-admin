import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { ListCustomersComponent } from "./list-customers/list-customers.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "list-customers",
        component: ListCustomersComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Lista de clientes",
          breadcrumb: "Vendor List",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
