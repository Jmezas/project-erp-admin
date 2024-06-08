import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// import { Ng2SmartTableModule } from 'ng2-smart-table';
import {UsersRoutingModule} from './users-routing.module';
import {ListUserComponent} from './list-user/list-user.component';
import {CreateUserComponent} from './create-user/create-user.component';

import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from 'src/app/shared/shared.module';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {MultiSelectModule} from 'primeng/multiselect';
import {PasswordModule} from 'primeng/password';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorService} from 'src/app/shared/service/interceptor.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    declarations: [ListUserComponent, CreateUserComponent],
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        TableModule,
        PaginatorModule,
        MultiSelectModule,
        NgxSpinnerModule,
        PasswordModule,
        NgSelectModule
    ],
})
export class UsersModule {
}
