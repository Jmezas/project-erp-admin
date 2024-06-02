import {Component} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Result} from 'src/app/shared/models/result';
import {Unit} from 'src/app/shared/models/unit';
import {TypePaymentService} from 'src/app/shared/service/type-payments/type-payment.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-type-payment',
    templateUrl: './type-payment.component.html',
    styleUrls: ['./type-payment.component.scss'],
})
export class TypePaymentComponent {
    public closeResult: string;
    public search: string = '';
    typePayment: any[];

    public totalRecords: number;
    edit: boolean = false;

    // create  and edit
    name: string = '';
    code: string = '';
    id: number = 0;

    isloading: boolean = false;
    loading: boolean = false;

    constructor(private modalService: NgbModal, private api: TypePaymentService) {
        this.getAll();
    }

    open(content, id: number) {
        this.id = 0;
        this.name = '';
        this.code = '';
        if (id > 0) {
            this.edit = true;
            this.onGet(id);
        } else {
            this.edit = false;
        }
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    getAll() {
        this.loading = true;
        this.api.getAllTypePayment(0, 10, '').subscribe((res: Result) => {
            this.loading = false;
            this.typePayment = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    paginate(event) {
        this.loading = true;
        this.api.getAllTypePayment(event.page, event.rows, this.search.toUpperCase()).subscribe((res: Result) => {
            this.loading = false;
            this.typePayment = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    onSave() {
        let unit: Unit = {
            id: 0,
            name: this.name,
        };
        this.isloading = true;
        this.api.postTypePayment(unit).subscribe((res) => {
            this.isloading = false;
            this.getAll();
            Swal.fire({
                icon: 'success',
                title: 'Se grabo correctamente',
                showConfirmButton: false,
                timer: 1100,
            });
            this.modalService.dismissAll();
        });
    }

    onGet(id: number) {
        this.id = id;
        this.isloading = true;
        this.api.getTypePaymentById(id).subscribe((res: Result) => {
            this.isloading = false;
            this.name = res.payload.data.name;
        });
    }

    onUpdate() {
        this.isloading = true;
        let unit: Unit = {
            id: this.id,
            name: this.name,
            code: this.code,
        };

        this.api.putTypePayment(this.id, unit).subscribe((res) => {
            this.isloading = false;
            this.getAll();
            Swal.fire({
                icon: 'success',
                title: 'Se actualizo correctamente',
                showConfirmButton: false,
                timer: 1100,
            });
            this.modalService.dismissAll();
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
                this.isloading = true;
                this.api.deleteTypePayment(id).subscribe((res) => {
                    this.isloading = false;
                    this.getAll();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }

    onSearch(search: any) {
        this.loading = true;

        this.api.getAllTypePayment(0, 10, this.search.toUpperCase()).subscribe((res: Result) => {
            this.loading = false;
            this.typePayment = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }
}
