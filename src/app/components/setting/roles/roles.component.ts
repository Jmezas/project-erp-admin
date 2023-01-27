import { Component } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Result } from "src/app/shared/models/result";
import { RoleService } from "src/app/shared/service/roles/role.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent {
  public closeResult: string;
  public search: string = "";
  roles: [];
  public totalRecords: number;
  edit: boolean = false;
  //create  and edit
  public name: string = "";
  id: number = 0;

  constructor(private modalService: NgbModal, private api: RoleService, private router: Router) {
    this.getAll();
  }
  open(content, id: number) {
    this.name = "";
    if (id > 0) {
      this.edit = true;
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
    this.api.getAllRoles(0, 10, this.search).subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  getAll() {
    this.api.getAllRoles(0, 10, "").subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllRoles(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  onSave() {
    let category = {
      id: 0,
      name: this.name,
    };

    this.api.postRole(category).subscribe((res) => {
      this.getAll();
      Swal.fire({
        icon: "success",
        title: "Se grabo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
    });
  }

  onUpdate() {
    let Roles = {
      id: this.id,
      name: this.name,
    };
    this.api.putRole(this.id, Roles).subscribe((res) => {
      this.getAll();
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
        this.api.deleteRole(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }
  onLinkedit(id: number) {
    localStorage.setItem("id_role", id.toString());
    this.router.navigate(["/settings/add-roles"]);
  }
  onCreateLinkt() {
    console.log("create");
    localStorage.removeItem("id_role");
    this.router.navigate(["/settings/add-roles"]);
  }
}
