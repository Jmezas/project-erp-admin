import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomersRoutingModule} from './customers-routing.module';
import {ListCustomersComponent} from './list-customers/list-customers.component';
import {CreateCustomersComponent} from './create-customers/create-customers.component';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {DropdownModule} from 'primeng/dropdown';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    declarations: [ListCustomersComponent, CreateCustomersComponent],
    imports: [
        CommonModule,
        CustomersRoutingModule,
        TableModule,
        PaginatorModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        NgSelectModule,
    ],
})
export class CustomersModule {
}
