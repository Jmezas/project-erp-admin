import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
  onCreateLinkt() {
    this.router.navigate(["/settings/add-roles"]);
  }
}
