import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Result } from "src/app/shared/models/result";
import { GeneralService } from "src/app/shared/service/general.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
})
export class CompanyComponent {
  public accountForm: UntypedFormGroup;
  edit: boolean = false;
  id: number;
  constructor(
    private toastr: ToastrService,
    private apiGeneral: GeneralService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.createAccountForm();
    this.onGet();
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      ruc: ["", [Validators.required]],
      name: ["", [Validators.required]],
      adress: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
      phone: ["", [Validators.required]],
      web: ["", [Validators.required]],
    });
  }

  buscar(value) {
    console.log(value);
    if (value.length != 11) {
      this.toastr.warning("El DNI debe tener 11 digitos", "¡Avertencia!");
      return;
    }
    this.apiGeneral.getConsultaRUC(value).subscribe((res: any) => {
      if (res.TipoRespuesta == 2) {
        this.toastr.error(res.MensajeRespuesta, "¡Error!");
        return;
      }
      this.accountForm.patchValue({
        name: res.RazonSocial.trim(),
        adress: res.DomicilioFiscal.replace(/\s+/g, " "),
      });
    });
  }
  onSave() {
    if (this.accountForm.invalid) {
      return Object.values(this.accountForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let data = this.accountForm.value;
    let dataSend = {
      ruc: data.ruc,
      name: data.name,
      adress: data.adress,
      email: data.email,
      phone: data.phone,
      web: data.web,
    };
    this.apiGeneral.postCompany(dataSend).subscribe((res: any) => {
      Swal.fire("Buen trabajo!", "Tu registro ha sido guardado.", "success");
    });
  }
  onUpdate() {
    if (this.accountForm.invalid) {
      return Object.values(this.accountForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let data = this.accountForm.value;
    let dataSend = {
      id: this.id,
      ruc: data.ruc,
      name: data.name,
      adress: data.adress,
      email: data.email,
      phone: data.phone,
      web: data.web,
    };
    this.apiGeneral.putCompany(this.id, dataSend).subscribe((res: any) => {
      Swal.fire("Buen trabajo!", "Tu registro ha sido actualizado.", "success");
    });
  }
  onGet() {
    this.apiGeneral.getCompanyById(1).subscribe((res: Result) => {
      let data = res.payload.data;
      this.id = data.id;
      this.edit = true;
      this.accountForm.patchValue({
        ruc: data.ruc,
        name: data.name,
        adress: data.adress,
        email: data.email,
        phone: data.phone,
        web: data.web,
      });
    });
  }
}
