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
  loading: boolean = false;
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
    this.loading = true;
    this.api
      .getAllMovement(0, 10, this.search.toUpperCase(), this.dateStart, this.dateEnd)
      .subscribe((res: Result) => {
        this.loading = false;
        this.movement = res.payload.data;
        this.totalRecords = res.payload.total;
      });
  }
  paginate(event) {
    this.loading = true;
    this.api
      .getAllMovement(event.page, event.rows, this.search.toUpperCase(), this.dateStart, this.dateEnd)
      .subscribe((res: Result) => {
        this.loading = false;
        this.movement = res.payload.data;
        this.totalRecords = res.payload.total;
      });
  }
  onSelect() {
    console.log(this.rangeDates);
    if (this.rangeDates != null || this.rangeDates != undefined) {
      this.dateStart = this.rangeDates[0].toISOString().slice(0, 10);
      if (this.rangeDates[1] != null) {
        this.dateEnd = this.rangeDates[1].toISOString().slice(0, 10);

        const [year, month, day] = this.dateEnd.split("-");
        this.dateEnd = `${year}-${parseInt(month)}-${parseInt(day)}`;
      }
      const [year, month, day] = this.dateStart.split("-");
      this.dateStart = `${year}-${parseInt(month)}-${parseInt(day)}`;
    } else {
      this.dateStart = "";
      this.dateEnd = "";
    }

    this.api
      .getAllMovement(0, 10, this.search.toUpperCase(), this.dateStart, this.dateEnd)
      .subscribe((res: Result) => {
        this.movement = res.payload.data;
        this.totalRecords = res.payload.total;
      });
  }
}
