/* eslint-disable no-console */
import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {BillsDistribution} from '../../interfaces/app-cash.interface';
import {TraceService} from '../../../services/trace.service';

@Component({
    selector: 'app-select-option',
    templateUrl: './select-option.component.html',
    styleUrls: ['./select-option.component.css'],
})
export class SelectOptionComponent implements OnInit {
    @Input() billsDistribution!: BillsDistribution;
    @Input() id: number = 0;
    @Output() onOptionClick: EventEmitter<number> = new EventEmitter();

    allOk: boolean = false;

    constructor(private trace: TraceService) {}

    ngOnInit(): void {
        this.trace.write('select-option', 'init');
        try {
            if (this.billsDistribution.bills.length > 0) {
                this.allOk = true;
            }
        } catch (err) {
            this.trace.write('selec-option.component', `error with data: ${err}`);
        }
    }

    optionClick() {
        this.onOptionClick.emit(this.id);
    }

    getImage(denom: number) {
        return `assets/img/eur${denom.toString()}.jpg`;
    }
}
