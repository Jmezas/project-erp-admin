import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Result } from "../../models/result";
import { matchValidator } from "../../models/users";
import { AuthService } from "../../service/auth.service";
import { NavService } from "../../service/nav.service";
import { UserService } from "../../service/users/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public accountForm: UntypedFormGroup;
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;
  closeResult: string;
  @Output() rightSidebarEvent = new EventEmitter<boolean>();
  islogged: boolean = false;
  constructor(
    public navServices: NavService,
    public authRutes: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private apiUser: UserService
  ) {
    // console.log("va", this.navServices.pdrVenta);
    // this.open = !this.open;
    // this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.createform();
  }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar;
    this.rightSidebarEvent.emit(this.right_sidebar);
  }

  openMobileNav() {
    this.openNav = !this.openNav;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  cerrarVenta() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.openNav = !this.openNav;
  }
  logout() {
    this.authRutes.logOut();
  }

  ngOnInit() {}
  onSave() {
    this.islogged = true;
    if (this.accountForm.invalid) {
      return Object.values(this.accountForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let data = {
      email: this.authRutes.getUserInfo().email,
      password: this.accountForm.value.passActual,
      passwordUpdate: this.accountForm.value.password,
    };

    this.apiUser.updatePassword(data).subscribe({
      next: (res: Result) => {
        this.islogged = false;
        this.modalService.dismissAll();
        Swal.fire({
          icon: "success",
          title: "Contraseña Actualizada",
          text: "La contraseña se actualizo correctamente la contraseña  =>" + res.payload.data.password,
        }).then((result) => {
          if (result.isConfirmed) {
            this.authRutes.logOut();
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
  openModal(content) {
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
  createform() {
    this.accountForm = this.formBuilder.group({
      passActual: ["", Validators.required],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
          matchValidator("confirmPwd", true),
        ],
      ],
      confirmPwd: ["", [Validators.required, matchValidator("password")]],
    });
  }
}
