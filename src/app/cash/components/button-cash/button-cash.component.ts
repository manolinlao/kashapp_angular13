/* eslint-disable radix */
/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-cash',
  templateUrl: './button-cash.component.html',
  styleUrls: ['./button-cash.component.scss'],
})
export class ButtonCashComponent implements OnInit {
  @Input() amount: string = '';

  @Output() onButtonClick: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {}

  buttonClick() {
    this.onButtonClick.emit(parseInt(this.amount));
  }
}
