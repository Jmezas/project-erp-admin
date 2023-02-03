import { Component, TemplateRef } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Customer } from "src/app/shared/models/customers";
import { General } from "src/app/shared/models/general";
import { Result } from "src/app/shared/models/result";

import { CustomerService } from "src/app/shared/service/customers/customer.service";
import { GeneralService } from "src/app/shared/service/general.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-list-customers",
  templateUrl: "./list-customers.component.html",
  styleUrls: ["./list-customers.component.scss"],
})
export class ListCustomersComponent {
  public customerForm: UntypedFormGroup;
  public closeResult: string;
  public search: string = "";
  customer: any[];
  public totalRecords: number;
  edit: boolean = false;
  general: any = [];

  departamento: any = [];
  provincia: any = [];
  distrito: any = [];
  selectdepartamento: string;

  selectedDocumento: General;
  nroDocumento: string;

  //create  and edit
  public name: string = "";
  id: number = 0;

  //mensaje
  mensaje: string = "";

  isloading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private api: CustomerService,
    private apiGeneral: GeneralService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.getAll();
    this.getGeneral();
    this.getDepartamento();
    this.createform();
  }

  //abrira el modal para crear o editar
  open(content, id: number) {
    this.name = "";
    if (id > 0) {
      this.edit = true;
      this.onGet(id);
    } else {
      this.provincia = [];
      this.distrito = [];
      this.customerForm.reset();
      this.edit = false;
    }
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true })
      .result.then(
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

  //create and edit
  createform() {
    this.customerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      nroDocumento: ["", [Validators.required]],
      email: [
        "",
        [Validators.pattern("/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/")],
      ],
      phone: [""],
      address: ["", [Validators.required]],
      document: ["", [Validators.required]],
      departament: ["", [Validators.required]],
      province: ["", Validators.required],
      distrit: ["", [Validators.required]],
    });
  }
  onSearch() {
    this.api.getAllCustomer(0, 10, this.search.toUpperCase()).subscribe((res: Result) => {
      this.customer = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  getAll() {
    this.api.getAllCustomer(0, 10, "").subscribe((res: Result) => {
      this.customer = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllCustomer(event.page, event.rows, this.search.toUpperCase()).subscribe((res: Result) => {
      this.customer = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  getGeneral() {
    let code = 1;
    this.apiGeneral.getGeneral(code).subscribe((res: Result) => {
      this.general = res.payload.data;
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

  getBucarDocumento() {
    if (this.customerForm.value.document != null) {
      if (this.customerForm.value.nroDocumento != null) {
        if (this.customerForm.value.document.code == 6) {
          if (this.customerForm.value.nroDocumento.length != 11) {
            this.toastr.warning("El RUC debe tener 11 digitos", "¡Avertencia!");
            return;
          }
          this.apiGeneral.getConsultaRUC(this.customerForm.value.nroDocumento).subscribe((res: any) => {
            if (res.TipoRespuesta == 2) {
              this.toastr.error(res.MensajeRespuesta, "¡Error!");
              return;
            }
            this.customerForm.controls["name"].setValue(res.RazonSocial.trim());
            this.customerForm.controls["address"].setValue(res.DomicilioFiscal.replace(/\s+/g, " "));
          });
        } else if (this.customerForm.value.document.code == 1) {
          if (this.customerForm.value.nroDocumento.length != 8) {
            this.toastr.warning("El DNI debe tener 8 digitos", "¡Avertencia!");
            return;
          }
          this.apiGeneral.getConsultaDNI(this.customerForm.value.nroDocumento).subscribe((res: any) => {
            if (res.nombre == null) {
              this.toastr.error(res.respuesta, "¡Error!");
              return;
            }
            this.customerForm.controls["name"].setValue(
              `${res.nombre} ${res.apellidoPaterno} ${res.apellidoMaterno}`
            );
          });
        } else {
          this.toastr.warning("Seleccione un tipo de documento", "¡Avertencia!");
          return;
        }
      } else {
        this.toastr.warning("Ingrese nro documento", "¡Avertencia!");
        return;
      }
    } else {
      this.toastr.warning("Seleccione un tipo de documento", "¡Avertencia!");
      return;
    }
  }

  onGet(id: number) {
    this.id = id;
    this.api.getCustomerById(id).subscribe((res: Result) => {
      this.customerForm.patchValue({
        name: res.payload.data.name,
        nroDocumento: res.payload.data.nroDocumento,
        email: res.payload.data.email,
        phone: res.payload.data.phone,
        address: res.payload.data.address,
        document: res.payload.data.document,
        departament: res.payload.data.departament,
        province: res.payload.data.province,
        distrit: res.payload.data.distrit,
      });
      let doc = this.general.find((e) => e.code == res.payload.data.document);

      this.customerForm.controls["document"].setValue({
        code: doc.code,
        description: doc.description,
      });
      let ent = this.departamento.find((e) => e.code == res.payload.data.departament);
      this.customerForm.controls["departament"].setValue({
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
          this.customerForm.controls["province"].setValue({
            code: ent2.code,
            descriptions: ent2.descriptions,
          });
          this.apiGeneral.getUbigeo("DISTRITO", departament, province, "00").subscribe((res: any[]) => {
            this.distrito = res;
            let ent3 = this.distrito.find((e) => e.code == distrit);
            this.customerForm.controls["distrit"].setValue({
              code: ent3.code,
              descriptions: ent3.descriptions,
            });
          });
        });
    });
  }
  onSave() {
    if (this.customerForm.invalid) {
      return Object.values(this.customerForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let customer: Customer = {
      id: 0,
      name: this.customerForm.value.name,
      nroDocumento: this.customerForm.value.nroDocumento,
      email: this.customerForm.value.email,
      phone: this.customerForm.value.phone,
      address: this.customerForm.value.address,
      document: this.customerForm.value.document.code,
      departament: this.customerForm.value.departament.code,
      province: this.customerForm.value.province.code,
      distrit: this.customerForm.value.distrit.code,
      ubigeo: this.customerForm.value.distrit.idubi,
    };

    this.api.createCustomer(customer).subscribe((res) => {
      this.getAll();
      this.modalService.dismissAll();
      Swal.fire("Buen trabajo!", "Tu registro ha sido guardado.", "success");
    });
  }
  onUpdate() {
    let customer: Customer = {
      id: this.id,
      name: this.customerForm.value.name,
      nroDocumento: this.customerForm.value.nroDocumento,
      email: this.customerForm.value.email,
      phone: this.customerForm.value.phone,
      address: this.customerForm.value.address,
      document: this.customerForm.value.document,
      departament: this.customerForm.value.departament.code,
      province: this.customerForm.value.province.code,
      distrit: this.customerForm.value.distrit.code,
      ubigeo: this.customerForm.value.distrit.idubi,
    };
    if (this.customerForm.invalid) {
      return Object.values(this.customerForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    this.api.updateCustomer(this.id, customer).subscribe((res) => {
      this.getAll();
      this.modalService.dismissAll();
      Swal.fire("Buen trabajo!", "Tu registro ha sido actualizado.", "success");
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
        this.api.deleteCustomer(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }
}
