import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {forkJoin} from 'rxjs';
import {Result} from 'src/app/shared/models/result';
import {matchValidator, User} from 'src/app/shared/models/users';
import {CustomerService} from 'src/app/shared/service/customers/customer.service';
import {GeneralService} from 'src/app/shared/service/general.service';
import {RoleService} from 'src/app/shared/service/roles/role.service';
import {UserService} from 'src/app/shared/service/users/user.service';
import {WarehouseService} from 'src/app/shared/service/warehouses/warehouse.service';
import Swal from 'sweetalert2';
import {FieldInvalid} from '../../../shared/common/ValidateInput';
import {Role} from '../../../shared/models/role';
import {ListWarehouse} from '../../../shared/models/warehouse';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
    accountForm: UntypedFormGroup;
    active = 1;
    roles: Role[] = [];
    warehouses: ListWarehouse[] = [];
    id = 0;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private apiRole: RoleService,
        private toastr: ToastrService,
        private apiGeneral: GeneralService,
        private api: UserService,
        private apiWarehouse: WarehouseService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private apiCustumer: CustomerService
    ) {
        this.createAccountForm();

        this.activatedRoute.params.subscribe((params) => {
            this.id = params['id'];

            if (this.id != null) {
                forkJoin({
                    role: this.apiRole.getRole(),
                    warehouse: this.apiWarehouse.getWarehouse(),
                    user: this.api.getUserById(+this.id),
                }).subscribe((res) => {
                    this.roles = res.role['payload'].data;
                    this.warehouses = res.warehouse['payload'].data;
                    const resultaData = res.user['payload'].data;
                    this.accountForm.patchValue({
                        nroDocumento: resultaData.document,
                        fname: resultaData.name,
                        lname: resultaData.lastname,
                        email: resultaData.email,
                        phone: resultaData.phone,
                        //password: resultaData.password,
                        //confirmPwd: resultaData.password,
                        roles: resultaData.roles.map((x) => x.id),
                        warehouse: resultaData.warehouses.map((x) => x.id),
                    });
                });
            } else {
                this.getRoles();
                this.getWarehouse();
            }
        });
    }

    createAccountForm() {
        this.accountForm = this.formBuilder.group({
            nroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            fname: ['', [Validators.required]],
            lname: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
            phone: ['', [Validators.required]],
            password: [
                '',
                [Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), matchValidator('confirmPwd', true)],
            ],
            confirmPwd: ['', [matchValidator('password')]],
            roles: ['', [Validators.required]],
            warehouse: ['', [Validators.required]],
        });
    }

    ngOnInit() {
    }

    getRoles() {
        this.apiRole.getRole().subscribe((res: Result) => {
            this.roles = res.payload.data;
        });
    }

    getWarehouse() {
        this.apiWarehouse.getWarehouse().subscribe((res: Result) => {
            this.warehouses = res.payload.data;
        });
    }

    searchDocument(value: string) {
        if (value.length !== 8) {
            this.toastr.warning('El DNI debe tener 8 digitos', '¡Avertencia!');
            return;
        }
        this.apiCustumer.searchDocument(value).subscribe((res: Result) => {
            if (res.payload.data.nombre == null || res.payload.data == null) {
                this.toastr.error(res.payload.data.respuesta, '¡Error!');
                return;
            }
            this.accountForm.patchValue({
                fname: res.payload.data.nombres,
                lname: res.payload.data.apellidoPaterno + ' ' + res.payload.data.apellidoMaterno,
            });
        });
    }

    //TODO: Validar input del formulario
    isFieldInvalid(fieldName: string): boolean {
        return FieldInvalid(fieldName, this.accountForm);
    }

    onSubmit() {
        if (this.id != null) {
            delete this.accountForm.value.password;
            delete this.accountForm.value.confirmPwd;
        }
        console.log(this.accountForm.value);
        if (this.accountForm.invalid) {
            return Object.values(this.accountForm.controls).forEach((control) => {
                if (control instanceof UntypedFormGroup) {
                    Object.values(control.controls).forEach((control) => control.markAsTouched());
                } else {
                    control.markAsTouched();
                }
            });
        }
        let data: User = {
            id: 0,
            name: this.accountForm.value.fname,
            lastname: this.accountForm.value.lname,
            email: this.accountForm.value.email,
            phone: this.accountForm.value.phone,
            password: this.accountForm.value.password,
            document: this.accountForm.value.nroDocumento,
            roles: this.accountForm.value.roles,
            warehouses: this.accountForm.value.warehouse,
        };
        console.log(data);
        if (this.id == null) {
            this.api.postUser(data).subscribe({
                next: (res: Result) => {
                    this.accountForm.reset();
                    this.id = null;
                    Swal.fire({
                        title: 'Exito!',
                        text: `el usuario ${res.payload.data.name}  se creado correctamente`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.value) {
                            localStorage.removeItem('id_user');
                            this.router.navigate(['/users/list-user']);
                        }
                    });
                },
                error: (err) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.error.message,
                    });
                },
            });
        } else {
            delete data.password;
            data.id = +this.id;
            this.api.putUser(+this.id, data).subscribe({
                next: (res: Result) => {
                    this.accountForm.reset();
                    this.id = null;
                    Swal.fire({
                        title: 'Exito!',
                        text: `el usuario ${res.payload.data.name}  actualizado correctamente`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.value) {
                            localStorage.removeItem('id_user');
                            this.router.navigate(['/users/list-user']);
                        }
                    });
                },
                error: (err) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.error.message,
                    });
                },
            });
        }
    }
}
