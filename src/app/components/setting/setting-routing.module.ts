import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GeneralComponent} from 'src/app/shared/components/general/general.component';
import {AuthGuard} from '../auth/auth.guard';
import {CompanyComponent} from './company/company.component';
import {MenusComponent} from './menus/menus.component';
import {ProfileComponent} from './profile/profile.component';
import {AddRolesComponent} from './roles/add-roles/add-roles.component';
import {RolesComponent} from './roles/roles.component';
import {SeriesComponent} from './series/series.component';
import {WarehouseComponent} from './warehouse/warehouse.component';
import {CreateRoleComponent} from './roles/create-role/create-role.component';

const routes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Profile',
            breadcrumb: 'Profile',
        },
    },
    {
        path: 'general',
        component: GeneralComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'General',
            breadcrumb: 'General',
        },
    },
    {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Empresa',
            breadcrumb: 'Empresa',
        },
    },
    {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'roles',
            breadcrumb: 'roles',
        },
    },
    {
        path: 'add-roles',
        component: AddRolesComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Agregar Roles',
            breadcrumb: 'Agregar Roles',
        },
    },
    {
        path: ':id/edit-roles',
        component: AddRolesComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Agregar Roles',
            breadcrumb: 'Agregar Roles',
        },
    },
    {
        path: ':id/edit-role',
        component: CreateRoleComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Agregar Roles',
            breadcrumb: 'Agregar Roles',
        },
    },
    {
        path: 'create-role',
        component: CreateRoleComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Agregar Roles',
            breadcrumb: 'Agregar Roles',
        },
    },
    {
        path: 'warehouse',
        component: WarehouseComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Almacenes',
            breadcrumb: 'Almacenes',
        },
    },
    {
        path: 'menu',
        component: MenusComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Menu',
            breadcrumb: 'Menu',
        },
    },
    {
        path: 'serie',
        component: SeriesComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Serie',
            breadcrumb: 'Serie',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingRoutingModule {
}
