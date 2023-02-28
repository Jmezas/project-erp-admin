import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs";
import { Result } from "src/app/shared/models/result";
import { matchValidator, User } from "src/app/shared/models/users";
import { GeneralService } from "src/app/shared/service/general.service";
import { RoleService } from "src/app/shared/service/roles/role.service";
import { UserService } from "src/app/shared/service/users/user.service";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";
import Swal from "sweetalert2";

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
  id;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiRole: RoleService,
    private toastr: ToastrService,
    private apiGeneral: GeneralService,
    private api: UserService,
    private apiWarehouse: WarehouseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.createAccountForm();

    this.activatedRoute.params.subscribe((params) => {
      this.id = params["id"];

      if (this.id != null) {
        forkJoin({
          role: this.apiRole.getRole(),
          warehouse: this.apiWarehouse.getWarehouse(),
          user: this.api.getUserById(+this.id),
        }).subscribe((res) => {
          this.roles = res.role["payload"].data;
          this.warehouses = res.warehouse["payload"].data;
          this.accountForm.patchValue({
            nroDocumento: res.user["payload"].data.document,
            fname: res.user["payload"].data.name,
            lname: res.user["payload"].data.lastname,
            email: res.user["payload"].data.email,
            phone: res.user["payload"].data.phone,
            //password: res.user["payload"].data.password,
            //confirmPwd: res.user["payload"].data.password,
            roles: res.user["payload"].data.roles,
            warehouse: res.user["payload"].data.warehouses,
          });
          console.log(res.user["payload"].data.roles);
        });
      } else {
        this.getRoles();
        this.getWarehouse();
      }
    });
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      nroDocumento: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      fname: ["", [Validators.required]],
      lname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
      phone: ["", [Validators.required]],
      password: ["", [Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"), matchValidator("confirmPwd", true)]],
      confirmPwd: ["", [matchValidator("password")]],
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
      roles: this.accountForm.value.roles.map((x) => x.id),
      warehouses: this.accountForm.value.warehouse.map((x) => x.id),
    };

    if (this.id == null) {
      this.api.postUser(data).subscribe({
        next: (res: Result) => {
          this.accountForm.reset();
          this.id = null;
          Swal.fire({
            title: "Exito!",
            text: `el usuario ${res.payload.data.name}  se creado correctamente`,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              localStorage.removeItem("id_user");
              this.router.navigate(["/users/list-user"]);
            }
          });
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
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
            title: "Exito!",
            text: `el usuario ${res.payload.data.name}  actualizado correctamente`,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              localStorage.removeItem("id_user");
              this.router.navigate(["/users/list-user"]);
            }
          });
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.message,
          });
        },
      });
    }
  }
}
