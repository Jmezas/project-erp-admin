import { Component } from "@angular/core";
import { Result } from "src/app/shared/models/result";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";

@Component({
  selector: "app-movement",
  templateUrl: "./movement.component.html",
  styleUrls: ["./movement.component.scss"],
})
export class MovementComponent {
  movement: [] = [];
  totalRecords: number;
  search: string = "";
  dateStart: string = "";
  dateEnd: string = "";
  rangeDates: Date[];
  constructor(private api: InventoryService) {
    this.getAll();
  }
  getAll() {
    this.api.getAllMovement(0, 10, "", "", "").subscribe((res: Result) => {
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSearch(search: any) {
    this.api.getAllMovement(0, 10, this.search, this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api
      .getAllMovement(event.page, event.rows, this.search, this.dateStart, this.dateEnd)
      .subscribe((res: Result) => {
        this.movement = res.payload.data;
        this.totalRecords = res.payload.total;
      });
  }
  onSelect() {
    if (this.rangeDates != null || this.rangeDates != undefined) {
      this.dateStart = this.rangeDates[0].toISOString().slice(0, 10);
      if (this.rangeDates[1] != null) {
        this.dateEnd = this.rangeDates[1].toISOString().slice(0, 10);
      }
    } else {
      this.dateStart = "";
      this.dateEnd = "";
    }

    this.api.getAllMovement(0, 10, this.search, this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
}
