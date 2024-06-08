import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DismissReason} from 'src/app/common/dismissReason';
import {Result} from 'src/app/shared/models/result';
import {GeneralService} from 'src/app/shared/service/general.service';
import {WarehouseService} from 'src/app/shared/service/warehouses/warehouse.service';
import Swal from 'sweetalert2';
import {DroplistUbigeo, ListWarehouse, WarehouseSave} from '../../../shared/models/warehouse';
import {FieldInvalid} from '../../../shared/common/ValidateInput';
import {Constants} from '../../../shared/common/constants';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-warehouse.ts',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
})
export class WarehouseComponent {
    public productForm: UntypedFormGroup;
    public closeResult: string;
    public search: string = '';
    public warehouse: ListWarehouse[] = [];
    totalRecords = 0;
    edit: boolean = false;
    //create  and edit
    public name: string = '';
    id: number = 0;

    departamento: DroplistUbigeo[] = [];
    provincia: DroplistUbigeo[] = [];
    distrito: DroplistUbigeo[] = [];
    selectdepartamento: string;

    page = 1;
    pageSize = 10;

    constructor(private modalService: NgbModal, private api: WarehouseService
        , private fb: UntypedFormBuilder, private apiGeneral: GeneralService
        , private toastr: ToastrService) {
        this.getAll();
        this.createForm();
        this.getDepartamento();
    }

    open(content, idWarehause: number) {
        this.clearForm();

        this.id = idWarehause !== 0 ? (this.onGet(idWarehause), idWarehause) : 0;

        console.log(this.id);
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }

    onSearch(search: any) {
        this.api.getAllWarehouse(0, 10, this.search).subscribe((res: Result) => {
            this.warehouse = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    getAll() {
        this.api.getAllWarehouse(0, this.pageSize, '').subscribe((res: Result) => {
            this.warehouse = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    paginate(event) {
        this.page = event;
        this.api.getAllWarehouse((event - 1), this.pageSize, this.search).subscribe((res: Result) => {
            this.warehouse = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    createForm() {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            phone: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
            address: ['', [Validators.required, Validators.minLength(3)]],
            email: [''],
            department: ['', [Validators.required]],
            province: ['', [Validators.required]],
            ubigeo: ['', [Validators.required]],
        });
    }

    getDepartamento() {
        const accion = 'DEPARTAMENTO';
        this.apiGeneral.getUbigeo(accion, '00', '00', '00').subscribe((res: Result) => {
            this.departamento = res.payload.data;
        });
    }

    getProvincia(departamento: string) {
        this.selectdepartamento = departamento;
        const accion = 'PROVINCIA';
        this.apiGeneral.getUbigeo(accion, departamento, '00', '00').subscribe((res: Result) => {
            this.provincia = res.payload.data;
        });
    }

    getDistrito(provincia: string) {
        const accion = 'DISTRITO';
        console.log(provincia);
        this.apiGeneral.getUbigeo(accion, this.selectdepartamento, provincia, '00').subscribe((res: Result) => {
            this.distrito = res.payload.data;
            console.log(this.distrito);
        });
    }

    //TODO: Validar input del formulario
    isFieldInvalid(fieldName: string): boolean {
        return FieldInvalid(fieldName, this.productForm);
    }

    onSave() {
        if (this.productForm.invalid) {
            return Object.values(this.productForm.controls).forEach((control) => {
                if (control instanceof UntypedFormGroup) {
                    Object.values(control.controls).forEach((control) => control.markAsTouched());
                } else {
                    control.markAsTouched();
                }
            });
        }
        const data: WarehouseSave = {
            id: this.id,
            name: this.productForm.value.name,
            phone: this.productForm.value.phone,
            address: this.productForm.value.address,
            email: this.productForm.value.email,
            ubigeo: this.productForm.value.ubigeo,
            company: 1, //por defecto
        };

        const request$ = this.id !== 0 ?
            this.api.putWarehouse(this.id, data) :
            this.api.postWarehouse(data);

        request$.subscribe({
            next: (res: Result) => {
                this.handleSuccess();
            },
            error: (err) => {
                this.handleError(err);
            }
        });
    }

    handleSuccess() {
        this.getAll();
        this.modalService.dismissAll();
        const message = this.id !== 0 ?
            new Constants().MESSAGE_SUCCESS_UPDATE :
            new Constants().MESSAGE_SUCCESS;
        this.clearForm();
        this.toastr.success(message, new Constants().TITLE_SUCCESS);
    }

    handleError(err) {
        const message = err || new Constants().MESSAGE_REQUEST;
        this.toastr.error(message, new Constants().TITLE_ERROR);
    }

    clearForm() {
        this.productForm.reset();
        this.id = 0;
        this.provincia = null;
        this.distrito = null;
    }

    onGet(id: number) {
        this.id = id;
        this.api.getWarehouseById(id).subscribe((res: Result) => {
            this.getProvincia(res.payload.data.ubigeo.department);
            this.getDistrito(res.payload.data.ubigeo.province);
            this.productForm.patchValue({
                name: res.payload.data.name,
                phone: res.payload.data.phone,
                address: res.payload.data.address,
                email: res.payload.data.email,
                department: res.payload.data.ubigeo.department,
                province: res.payload.data.ubigeo.province,
                ubigeo: res.payload.data.ubigeo.id,
            });

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
                this.api.deleteWarehouse(id).subscribe((res) => {
                    this.getAll();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }
}
