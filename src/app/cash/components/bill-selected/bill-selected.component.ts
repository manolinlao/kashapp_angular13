import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-bill-selected',
    templateUrl: './bill-selected.component.html',
})
export class BillSelectedComponent implements OnInit {
    @Input() denom: number = 0;
    @Input() num: number = 0;
    imgFile: string = '';

    ngOnInit(): void {
        this.imgFile = `assets/img/eur${this.denom.toString()}.jpg`;
    }
}
