import { DecimalPipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { NgbdSortableHeader, SortEvent } from "src/app/shared/directives/NgbdSortableHeader";
import { Result } from "src/app/shared/models/result";
import { TableService } from "src/app/shared/service/table.service";
import { UserService } from "src/app/shared/service/users/user.service";
import { UserListDB, USERLISTDB } from "src/app/shared/tables/list-users";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.scss"],
  providers: [TableService, DecimalPipe],
})
export class ListUserComponent implements OnInit {
  public users: any[] = [];
  public totalRecords: number;
  search: string = "";
  constructor(private api: UserService, private router: Router) {
    this.getAll();
  }

  getAll() {
    this.api.getAllUser(0, 10, "").subscribe((res: Result) => {
      this.users = res.payload.data;
      this.totalRecords = res.payload.total;
      this.users.forEach((element) => {
        element.role = element.roles;
      });

      console.log(this.users);
    });
  }

  paginate(event) {
    this.api.getAllUser(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.users = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  onSearch(search: any) {
    this.api.getAllUser(0, 10, this.search).subscribe((res: Result) => {
      this.users = res.payload.data;
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
        this.api.deleteUser(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  onLinkedit(id: number) {
    localStorage.setItem("id_user", id.toString());
    this.router.navigate(["/users/create-user"]);
  }
  onCreateLinkt() {
    localStorage.removeItem("id_user");
    this.router.navigate(["/users/create-user"]);
  }
  ngOnInit() {}
}
