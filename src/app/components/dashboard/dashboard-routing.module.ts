import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "default",
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Dashboard",
          breadcrumb: "Dashboard",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
