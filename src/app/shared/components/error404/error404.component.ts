import {Component} from '@angular/core';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss'],
})
export class Error404Component {
    constructor() {
        //this.data();
    }

    data() {
        //based on https://dribbble.com/shots/3913847-404-page

        var pageX = document.body.clientWidth;
        var pageY = document.body.clientHeight;
        var mouseY = 0;
        var mouseX = 0;

        document.onmousemove = (event: MouseEvent) => {
            //verticalAxis
            mouseY = event.pageY;
            let yAxis = ((pageY / 2 - mouseY) / pageY) * 300;
            //horizontalAxis
            mouseX = event.pageX / -pageX;
            let xAxis = -mouseX * 100 - 100;

            console.log('X: ' + xAxis, 'Y: ' + yAxis);
            // $(".box__ghost-eyes").css({ transform: "translate(" + xAxis + "%,-" + yAxis + "%)" });
            // document
            //   .querySelector("box__ghost-eyes")
            //    .css({ transform: "translate(" + xAxis + "%,-" + yAxis + "%)" });
            const box = document.querySelector<HTMLElement>('.box__ghost-eyes');
            const style: CSSStyle = {
                transform: `translate(${xAxis}%, -${yAxis}%)`,
            };
            if (box) {
                box.style.cssFloat = Object.entries(style)
                    .map(([prop, value]) => `${prop}: ${value};`)
                    .join(' ');
            }
        };
    }
}

export class CSSStyle {
    transform: string;
}
