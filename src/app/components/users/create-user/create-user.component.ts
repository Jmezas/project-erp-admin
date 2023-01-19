import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { matchValidator, User } from "src/app/shared/models/users";
import { GeneralService } from "src/app/shared/service/general.service";
import { RoleService } from "src/app/shared/service/roles/role.service";
import { UserService } from "src/app/shared/service/users/user.service";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent implements OnInit {
  public accountForm: UntypedFormGroup;
  public permissionForm: UntypedFormGroup;
  public active = 1;
  roles: any[] = [];
  warehouses: any[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiRole: RoleService,
    private toastr: ToastrService,
    private apiGeneral: GeneralService,
    private api: UserService,
    private apiWarehouse: WarehouseService
  ) {
    this.createAccountForm();
    this.getRoles();
    this.getWarehouse();
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      nroDocumento: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      fname: ["", [Validators.required]],
      lname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
      phone: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
          matchValidator("confirmPwd", true),
        ],
      ],
      confirmPwd: ["", [Validators.required, matchValidator("password")]],
      roles: ["", [Validators.required]],
      warehouse: ["", [Validators.required]],
    });
  }

  ngOnInit() {}

  getRoles() {
    this.apiRole.getRole().subscribe((res: any) => {
      this.roles = res.payload.data;
    });
  }
  getWarehouse() {
    this.apiWarehouse.getWarehouse().subscribe((res: any) => {
      this.warehouses = res.payload.data;
    });
  }
  buscar(value) {
    console.log(value);
    if (value.length != 8) {
      this.toastr.warning("El DNI debe tener 8 digitos", "¡Avertencia!");
      return;
    }
    this.apiGeneral.getConsultaDNI(value).subscribe((res: any) => {
      if (res.nombre == null) {
        this.toastr.error(res.respuesta, "¡Error!");
        return;
      }
      this.accountForm.patchValue({
        fname: res.nombre,
        lname: res.apellidoPaterno + " " + res.apellidoMaterno,
      });
    });
  }
  onSubmit() {
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
      roles: this.accountForm.value.roles.map((x) => x.id),
    };
    console.log(data);
    this.api.postUser(data).subscribe((res: any) => {
      console.log(res);
      this.accountForm.reset();
      this.toastr.success("Usuario creado correctamente", "¡Éxito!");
    });
  }
}
