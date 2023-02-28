import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TreeNode } from "primeng/api";
import { forkJoin } from "rxjs";
import { Result } from "src/app/shared/models/result";
import { MenuService } from "src/app/shared/service/menus/menu.service";
import { RoleService } from "src/app/shared/service/roles/role.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-roles",
  templateUrl: "./add-roles.component.html",
  styleUrls: ["./add-roles.component.scss"],
})
export class AddRolesComponent {
  public rolesForm: UntypedFormGroup;

  files1: any[];
  selecttree: any = [];
  id;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private api: RoleService,
    private apiMenu: MenuService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createform();

    //
    // let id = localStorage.getItem("id_role");
    this.activatedRoute.params.subscribe((params) => {
      this.id = params["id"];

      if (this.id != null) {
        forkJoin(
          // forkJoin is a RxJS operator
          {
            menu: this.apiMenu.getMenuTree(),
            role: this.api.getRoleById(+this.id),
          }
        ).subscribe((res) => {
          this.files1 = res.menu["payload"].data;
          this.rolesForm.patchValue({
            name: res.role["payload"].data.name,
          });
          let menus = res.role["payload"].data.menus;

          this.files1.forEach((element) => {
            if (menus.includes(element.id)) {
              this.selecttree.push(element);
            }
            this.checkChildren(element, menus, this.selecttree);
          });
        });
      } else {
        this.apiMenu.getMenuTree().subscribe((res: Result) => {
          this.files1 = res.payload.data;
        });
      }
    });
  }
  checkChildren(element, menus, selecttree) {
    if (element.children) {
      element.children.forEach((child) => {
        if (menus.includes(child.id)) {
          selecttree.push(child);
        }
        this.checkChildren(child, menus, selecttree);
      });
    }
  }
  createform() {
    this.rolesForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"), Validators.minLength(3)]],
    });
  }

  getMenuTree() {
    this.apiMenu.getMenuTree().subscribe((res: Result) => {
      this.files1 = res.payload.data;
    });
  }
  onSave() {
    console.log(this.selecttree);

    let menus = [];
    this.selecttree.forEach((element) => {
      menus.push(element.id);
      if (element.code_menu) menus.push(element.code_menu);
      if (element.parent) if (element.parent.code_menu) menus.push(element.parent.code_menu);
    });
    const conjunto = new Set(menus);
    const unicos = [...conjunto];
    console.log(unicos.sort());
    let id = localStorage.getItem("id_role");

    let saveSata = {
      name: this.rolesForm.value.name,
      menu: unicos.sort(),
    };
    if (id == null) {
      this.api.postRole(saveSata).subscribe((res: Result) => {
        Swal.fire({
          title: "Exito!",
          text: "Rol creada correctamente",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value) {
            localStorage.removeItem("id_role");
            this.router.navigate(["/settings/roles"]);
          }
        });
      });
    } else {
      this.api.putRole(+id, saveSata).subscribe((res: Result) => {
        Swal.fire({
          title: "Exito!",
          text: `Rol ${res.payload.data.name}  actualizado correctamente`,
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value) {
            localStorage.removeItem("id_role");
            this.router.navigate(["/settings/roles"]);
          }
        });
      });
    }
  }
}
