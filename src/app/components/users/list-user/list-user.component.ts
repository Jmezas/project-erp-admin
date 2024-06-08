import {DecimalPipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Result} from 'src/app/shared/models/result';
import Swal from 'sweetalert2';
import {UserService} from '../../../shared/service/users/user.service';
import {User} from '../../../shared/models/users';

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
    users: User[] = [];
    totalRecords: number;
    search = '';
    page = 1;
    pageSize = 10;

    constructor(private api: UserService, private router: Router) {
        this.getAll();
    }

    getAll() {
        this.api.getAllUser(0, this.pageSize, this.search).subscribe((res: Result) => {
            this.users = res.payload.data;
            this.totalRecords = res.payload.total;
            this.users.map((element) => {
                element.roles = element.roles;
                element.warehouses = element.warehouses;
            });
        });
    }

    paginate(event) {
        this.page = event;
        this.api.getAllUser((this.page - 1), event.rows, this.search).subscribe((res: Result) => {
            this.users = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    onSearch() {
        this.api.getAllUser(0, this.pageSize, this.search).subscribe((res: Result) => {
            this.users = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    onDelete(id: number) {
        Swal.fire({
            title: '¿Estas seguro?',
            text: 'No podras revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ¡borrarlo!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.api.deleteUser(id).subscribe((res) => {
                    this.getAll();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }

    onLinkedit(id: number) {
        this.router.navigate(['/users/create-user']);
    }

    onCreateLinkt() {
        this.router.navigate(['/users/create-user']);
    }

    ngOnInit() {
    }
}
