import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Result } from "src/app/shared/models/result";
import { GeneralService } from "src/app/shared/service/general.service";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-warehouse",
  templateUrl: "./warehouse.component.html",
  styleUrls: ["./warehouse.component.scss"],
})
export class WarehouseComponent {
  public productForm: UntypedFormGroup;
  public closeResult: string;
  public search: string = "";
  warehouse: [];
  public totalRecords: number;
  edit: boolean = false;
  //create  and edit
  public name: string = "";
  id: number = 0;

  departamento: any = [];
  provincia: any = [];
  distrito: any = [];
  selectdepartamento: string;

  constructor(
    private modalService: NgbModal,
    private api: WarehouseService,
    private fb: UntypedFormBuilder,
    private apiGeneral: GeneralService
  ) {
    this.getAll();
    this.createForm();
    this.getDepartamento();
  }
  open(content, id: number) {
    this.productForm.reset();
    this.name = "";
    if (id > 0) {
      this.edit = true;
      this.onGet(id);
      this.provincia = [];
      this.distrito = [];
    } else {
      this.edit = false;
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" }).result.then(
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
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  onSearch(search: any) {
    this.api.getAllWarehouse(0, 10, this.search).subscribe((res: Result) => {
      this.warehouse = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  getAll() {
    this.api.getAllWarehouse(0, 10, "").subscribe((res: Result) => {
      this.warehouse = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllWarehouse(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.warehouse = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  createForm() {
    this.productForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"), Validators.minLength(3)],
      ],
      phone: ["", [Validators.required, Validators.pattern("[0-9]{9}")]],
      address: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      departament: ["", [Validators.required]],
      province: ["", [Validators.required]],
      distrit: ["", [Validators.required]],
    });
  }
  getDepartamento() {
    let accion = "DEPARTAMENTO";
    this.apiGeneral.getUbigeo(accion, "00", "00", "00").subscribe((res: any[]) => {
      this.departamento = res;
    });
  }

  getProvincia(departamento: any) {
    this.selectdepartamento = departamento.value.code;
    let accion = "PROVINCIA";
    this.apiGeneral.getUbigeo(accion, departamento.value.code, "00", "00").subscribe((res: any[]) => {
      this.provincia = res;
    });
  }

  getDistrito(provincia: any) {
    let accion = "DISTRITO";
    this.apiGeneral
      .getUbigeo(accion, this.selectdepartamento, provincia.value.code, "00")
      .subscribe((res: any[]) => {
        this.distrito = res;
      });
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
    let data = {
      id: 0,
      name: this.productForm.value.name,
      phone: this.productForm.value.phone,
      address: this.productForm.value.address,
      email: this.productForm.value.email,
      departament: this.productForm.value.departament.code,
      province: this.productForm.value.province.code,
      distrit: this.productForm.value.distrit.code,
      ubigeo: this.productForm.value.distrit.idubi,
      company: 1, //por defecto
    };

    this.api.postWarehouse(data).subscribe((res) => {
      this.getAll();
      this.modalService.dismissAll();

      Swal.fire({
        icon: "success",
        title: "Se grabo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
    });
  }
  onGet(id: number) {
    this.id = id;
    this.api.getWarehouseById(id).subscribe((res: Result) => {
      this.productForm.patchValue({
        name: res.payload.data.name,
        phone: res.payload.data.phone,
        address: res.payload.data.address,
        email: res.payload.data.email,
        departament: res.payload.data.departament,
        province: res.payload.data.province,
        distrit: res.payload.data.distrit,
      });
      let ent = this.departamento.find((e) => e.code == res.payload.data.departament);
      this.productForm.controls["departament"].setValue({
        code: ent.code,
        descriptions: ent.descriptions,
      });
      let departament = res.payload.data.departament;
      let province = res.payload.data.province;
      let distrit = res.payload.data.distrit;

      this.apiGeneral
        .getUbigeo("PROVINCIA", res.payload.data.departament, "00", "00")
        .subscribe((res: any[]) => {
          this.provincia = res;
          let ent2 = this.provincia.find((e) => e.code == province);
          this.productForm.controls["province"].setValue({
            code: ent2.code,
            descriptions: ent2.descriptions,
          });
          this.apiGeneral.getUbigeo("DISTRITO", departament, province, "00").subscribe((res: any[]) => {
            this.distrito = res;
            let ent3 = this.distrito.find((e) => e.code == distrit);
            this.productForm.controls["distrit"].setValue({
              code: ent3.code,
              descriptions: ent3.descriptions,
            });
          });
        });
    });
  }
  onUpdate() {
    if (this.productForm.invalid) {
      return Object.values(this.productForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let data = {
      id: this.id,
      name: this.productForm.value.name,
      phone: this.productForm.value.phone,
      address: this.productForm.value.address,
      email: this.productForm.value.email,
      departament: this.productForm.value.departament.code,
      province: this.productForm.value.province.code,
      distrit: this.productForm.value.distrit.code,
      ubigeo: this.productForm.value.distrit.idubi,
      company: 1, //por defecto
    };
    this.api.putWarehouse(this.id, data).subscribe((res) => {
      this.getAll();
      this.modalService.dismissAll();
      Swal.fire({
        icon: "success",
        title: "Se actualizo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
    });
  }
  onDelete(id: number) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡borrarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteWarehouse(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }
}
