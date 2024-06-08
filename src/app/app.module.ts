import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardModule} from './components/dashboard/dashboard.module';
import {SharedModule} from './shared/shared.module';
import {ProductsModule} from './components/products/products.module';
import {SalesModule} from './components/sales/sales.module';
import {UsersModule} from './components/users/users.module';
import {SettingModule} from './components/setting/setting.module';
import {ReportsModule} from './components/reports/reports.module';
import {AuthModule} from './components/auth/auth.module';
import {CustomersModule} from './components/customers/customers.module';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {ToastrModule} from 'ngx-toastr';
import {InterceptorService} from './shared/service/interceptor.service';
import {InventoryModule} from './components/inventory/inventory.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        AppRoutingModule,
        DashboardModule,
        SettingModule,
        ReportsModule,
        AuthModule,
        SharedModule,
        ProductsModule,
        SalesModule,
        UsersModule,
        SweetAlert2Module.forRoot(),
        HttpClientModule,
        CustomersModule,
        InventoryModule,
        ToastrModule.forRoot(),
    ],
    providers: [ {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}],
    bootstrap: [AppComponent],
})
export class AppModule {
}
