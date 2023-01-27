import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { content } from "./shared/routes/content-routes";
import { ContentLayoutComponent } from "./shared/layout/content-layout/content-layout.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { Error404Component } from "./shared/components/error404/error404.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard/default",
    pathMatch: "full",
  },
  {
    path: "",
    component: ContentLayoutComponent,
    children: content,
  },
  {
    path: "auth/login",
    component: LoginComponent,
  },
  {
    path: "auth/error",
    component: Error404Component,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
