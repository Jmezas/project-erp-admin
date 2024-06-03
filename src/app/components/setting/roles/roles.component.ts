import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Result} from 'src/app/shared/models/result';
import {RoleService} from 'src/app/shared/service/roles/role.service';
import Swal from 'sweetalert2';
import {Role} from '../../../shared/models/role';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
    closeResult: string;
    search = '';
    roles: Role[];
    totalRecords: number;
    page = 1;
    pageSize = 10;
    totalPage: number;
    collectionSize = 0;

    constructor(private modalService: NgbModal, private api: RoleService, private router: Router) {
        this.getAll();
    }

    onSearch() {
        this.api.getAllRoles(0, 10, this.search).subscribe((res: Result) => {
            this.roles = res.payload.data;
            this.totalRecords = res.payload.total;
            this.collectionSize = res.payload.total;
        });
    }

    getAll() {
        this.api.getAllRoles(0, 10, '').subscribe((res: Result) => {
            this.roles = res.payload.data;
            this.totalRecords = res.payload.total;
            this.collectionSize = res.payload.total;
        });
    }

    paginate(event) {
        this.page = event;
        this.api.getAllRoles((this.page - 1), this.pageSize, this.search).subscribe((res: Result) => {
            this.roles = res.payload.data;
            this.totalRecords = res.payload.total;
            this.collectionSize = res.payload.total;
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
                this.api.deleteRole(id).subscribe((res) => {
                    this.getAll();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }

    onCreateLinkt() {
        this.router.navigate(['/settings/create-role']);
    }
}
