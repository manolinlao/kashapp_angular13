/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-magic-numbers */
import { Component, Input, OnInit } from '@angular/core';
import { Device } from '../../interfaces/entrance.interface';
import { TranslateService } from '@ngx-translate/core';

interface User {
  name: string;
  atm: string;
  modeDescription: string;
  mode: number;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Input() clients: string[] = [];
  @Input() devices: Device[] = [];

  get users(): User[] {
    if (this.clients.length > 0) {
      const result = [];

      for (let ind = 0; ind < this.clients.length; ind++) {
        result.push({
          name: this.clients[ind],
          atm: this.getAtm(this.clients[ind]),
          modeDescription: this.getModeDescription(this.clients[ind]),
          mode: this.getMode(this.clients[ind]),
        });
      }

      return result;
    }

    return [];
  }

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {}

  getAtm(client: string): string {
    let result = '';

    for (let ind = 0; ind < this.devices.length; ind++) {
      if (
        this.devices[ind].client === client ||
        this.devices[ind].operator === client ||
        this.devices[ind].observers?.includes(client)
      ) {
        result = this.devices[ind].atm;
        break;
      }
    }

    return result;
  }
  getModeDescription(client: string): string {
    let result = '';

    for (let ind = 0; ind < this.devices.length; ind++) {
      if (
        this.devices[ind].client === client ||
        this.devices[ind].operator === client ||
        this.devices[ind].observers?.includes(client)
      ) {
        if (this.devices[ind].client === client) {
          result = this.translateService.instant('entrance.client');
        }
        if (this.devices[ind].operator === client) {
          result = this.translateService.instant('entrance.operator');
        }
        if (this.devices[ind].observers?.includes(client)) {
          result = this.translateService.instant('entrance.observer');
        }
        break;
      }
    }

    return result;
  }

  getMode(client: string): number {
    let result = 0;

    for (let ind = 0; ind < this.devices.length; ind++) {
      if (
        this.devices[ind].client === client ||
        this.devices[ind].operator === client ||
        this.devices[ind].observers?.includes(client)
      ) {
        if (this.devices[ind].client === client) {
          result = 1;
        }
        if (this.devices[ind].operator === client) {
          result = 2;
        }
        if (this.devices[ind].observers?.includes(client)) {
          result = 3;
        }
        break;
      }
    }

    return result;
  }

  getStyle(userMode: number): string {
    let result = 'font-size:small;color:grey';

    switch (userMode) {
      case 0:
        result = 'font-size:small;color:grey';
        break;
      case 1:
        result = 'font-size:small;color:darkgreen';
        break;
      case 2:
        result = 'font-size:small;color:brown';
        break;
      case 3:
        result = 'font-size:small;color:blue';
        break;
      default:
        result = 'font-size:small;color:grey';
        break;
    }

    return result;
  }
}
