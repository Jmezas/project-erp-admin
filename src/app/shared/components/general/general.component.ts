import {Component} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {General} from '../../models/general';
import {Result} from '../../models/result';
import {GeneralService} from '../../service/general.service';
import {DismissReason} from '../../common/dismissReason';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Constants} from '../../common/constants';
import {ToastrService} from 'ngx-toastr';
import {FieldInvalid} from '../../common/ValidateInput';

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss'],
})
export class GeneralComponent {
    closeResult: string;
    search = '';
    general: General[] = [];

    totalRecords: number = 0;
    edit = false;

    generalForm: UntypedFormGroup;
    idGeneral = 0;
    page = 1;
    pageSize = 10;
    totalPage: number;
    collectionSize = 0;

    constructor(private modalService: NgbModal, private api: GeneralService
        , private formBuilder: UntypedFormBuilder
        , private toastr: ToastrService) {
        this.getAll();
        this.createform();
    }

    createform() {
        this.generalForm = this.formBuilder.group({
            parentcode: ['', Validators.required],
            code: ['', Validators.required],
            description: ['', Validators.required],
            description2: [''],
        });
    }

    //TODO: Validar input del formulario
    isFieldInvalid(fieldName: string): boolean {
        return FieldInvalid(fieldName, this.generalForm);
    }

    open(content, id: number) {
        this.clearForm();
        this.idGeneral = id !== 0 ? (this.onGet(id), id) : 0;

        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }

    getAll() {
        this.api.getAllGeneral(0, 10, '').subscribe((res: Result) => {
            this.general = res.payload.data;
            this.totalRecords = res.payload.total;
            this.collectionSize = res.payload.total;
        });
    }

    paginate(event) {
        this.page = event;
        this.api.getAllGeneral((this.page - 1), this.pageSize, this.search).subscribe((res: Result) => {
            this.general = res.payload.data;
            this.totalRecords = res.payload.total;
            this.collectionSize = res.payload.total;
        });
    }

    onSave() {
        const request$ = this.idGeneral !== 0
            ? this.api.putGeneral(this.idGeneral, this.generalForm.value)
            : this.api.postGeneral(this.generalForm.value);

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
        this.generalForm.reset();
        this.modalService.dismissAll();
        const successMessage = this.idGeneral !== 0
            ? new Constants().MESSAGE_SUCCESS_UPDATE
            : new Constants().MESSAGE_SUCCESS;
        this.clearForm();
        this.toastr.success(successMessage, new Constants().TITLE_SUCCESS);
    }

    handleError(err: any) {
        const errorMessage = err || new Constants().MESSAGE_REQUEST;
        this.toastr.error(errorMessage, new Constants().TITLE_ERROR);
    }

    onGet(id: number) {
        this.idGeneral = id;
        this.api.getGeneralById(id).subscribe((res: Result) => {
            console.log(res.payload.data);
            this.generalForm.patchValue({
                parentcode: res.payload.data.parentcode,
                code: res.payload.data.code,
                description: res.payload.data.description,
                description2: res.payload.data.description2,
            });
        });
    }

    clearForm() {
        this.generalForm.reset();
        this.idGeneral = 0;
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
                this.api.deleteGeneral(id).subscribe((res) => {
                    this.getAll();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }

    onSearch(search: any) {
        this.api.getAllGeneral(0, 10, this.search).subscribe((res: Result) => {
            this.general = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }
}
