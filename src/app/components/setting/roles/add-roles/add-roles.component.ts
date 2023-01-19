import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-roles",
  templateUrl: "./add-roles.component.html",
  styleUrls: ["./add-roles.component.scss"],
})
export class AddRolesComponent {
  public rolesForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder) {
    this.createform();
  }
  createform() {
    this.rolesForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"), Validators.minLength(3)],
      ],
    });
  }
}
