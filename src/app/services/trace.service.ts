/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TraceService {
  prod: boolean = environment.production;

  write3(
    component: string,
    str1: string,
    str2: string,
    logInProd: boolean = true
  ) {
    if ((this.prod && logInProd) || !this.prod) {
      console.log(this.getUTCDate() + ' ' + component, str1, str2);
    }
  }

  write(component: string, str: string, logInProd: boolean = true) {
    if ((this.prod && logInProd) || !this.prod) {
      console.log(this.getUTCDate() + ' ' + component, str);
    }
  }

  getUTCDate(): string {
    const date: Date = new Date();
    const hour: string = date.getUTCHours().toString().padStart(2, '0');
    const minute: string = date.getUTCMinutes().toString().padStart(2, '0');
    const second: string = date.getUTCSeconds().toString().padStart(2, '0');
    const milis: string = date.getUTCMilliseconds().toString().padStart(3, '0');

    return `[${hour}:${minute}:${second}.${milis}]`;
  }

  getDate(): string {
    const date: Date = new Date();
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: string = date.getFullYear().toString();
    const hour: string = date.getUTCHours().toString().padStart(2, '0');
    const minute: string = date.getMinutes().toString().padStart(2, '0');
    const second: string = date.getSeconds().toString().padStart(2, '0');
    const milis: string = date.getMilliseconds().toString().padStart(3, '0');

    return `[${hour}:${minute}:${second}.${milis}]`;
  }
}
