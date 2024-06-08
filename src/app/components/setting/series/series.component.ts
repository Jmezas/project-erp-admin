import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Result} from 'src/app/shared/models/result';
import {SerieService} from 'src/app/shared/service/series/serie.service';
import Swal from 'sweetalert2';
import {Series} from '../../../shared/models/serie';

@Component({
    selector: 'app-series',
    templateUrl: './series.component.html',
    styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnInit {
    closeResult: string;
    search: string = '';
    listSeries: Series[] = [];
    totalRecords: number = 0;
    edit: boolean = false;
    serieForm: UntypedFormGroup;
    //create  and edit
    name: string = '';
    id: number = 0;
    page = 1;
    pageSize = 10;

    constructor(private modalService: NgbModal, private api: SerieService, private fb: UntypedFormBuilder) {
        this.getAll();
        this.createform();
    }

    ngOnInit(): void {
    }

    createform() {
        this.serieForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(2)]],
            name: ['', [Validators.required, Validators.minLength(2)]],
            serie: ['', [Validators.required]],
            numero: ['', [Validators.required]],
        });
    }

    open(content, id: number) {
        this.name = '';
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

    onSearch(search: any) {
        this.api.getAllSerie(0, 10, this.search).subscribe((res: Result) => {
            this.listSeries = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    getAll() {
        this.api.getAllSerie(0, 10, '').subscribe((res: Result) => {
            console.log(res);
            this.listSeries = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    paginate(event) {
        this.api.getAllSerie(event.page, event.rows, this.search).subscribe((res: Result) => {
            this.listSeries = res.payload.data;
            this.totalRecords = res.payload.total;
        });
    }

    onSave() {
        if (this.serieForm.invalid) {
            return Object.values(this.serieForm.controls).forEach((control) => {
                if (control instanceof UntypedFormGroup) {
                    Object.values(control.controls).forEach((control) => control.markAsTouched());
                } else {
                    control.markAsTouched();
                }
            });
        }

        let dataSerie: Series = {
            id: 0,
            name: this.serieForm.value.name,
            code: this.serieForm.value.code,
            serie: this.serieForm.value.serie,
            number: parseInt(this.serieForm.value.numero),
        };
        this.api.postSerie(dataSerie).subscribe({
            next: (res: Result) => {
                this.getAll();
                this.modalService.dismissAll();
                this.serieForm.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Se grabo correctamente',
                    showConfirmButton: false,
                    timer: 1100,
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

    onGet(id: number) {
        this.id = id;
        this.api.getSerieById(id).subscribe((res: Result) => {
            this.serieForm.patchValue({
                code: res.payload.data.code,
                name: res.payload.data.name,
                serie: res.payload.data.serie,
                numero: res.payload.data.number,
            });
            this.id = res.payload.data.id;
        });
    }

    onUpdate() {
        if (this.serieForm.invalid) {
            return Object.values(this.serieForm.controls).forEach((control) => {
                if (control instanceof UntypedFormGroup) {
                    Object.values(control.controls).forEach((control) => control.markAsTouched());
                } else {
                    control.markAsTouched();
                }
            });
        }
        let dataSerie: any = {
            id: this.id,
            name: this.serieForm.value.name,
            code: this.serieForm.value.code,
            serie: this.serieForm.value.serie,
            number: parseInt(this.serieForm.value.numero),
        };
        this.api.putSerie(this.id, dataSerie).subscribe({
            next: (res: Result) => {
                this.getAll();
                this.modalService.dismissAll();
                this.serieForm.reset();
                this.id = 0;
                Swal.fire({
                    icon: 'success',
                    title: 'Se actualizo correctamente',
                    showConfirmButton: false,
                    timer: 1100,
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
                this.api.deleteSerie(id).subscribe((res) => {
                    this.getAll();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }
}
