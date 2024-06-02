import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import * as feather from 'feather-icons';


@Component({
  selector: 'app-feather-icons',
  templateUrl: './feather-icons.component.html',
  styleUrls: ['./feather-icons.component.scss']
})
export class FeatherIconsComponent implements OnInit {

  @Input('icon') public icon;

  constructor() { }

  ngOnInit(): void {
    try {
      feather.replace();
    } catch (error) {
      console.log('Error replacing Feather Icons:', error);
    }
  }
}
