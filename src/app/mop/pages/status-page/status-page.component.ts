/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable no-undef */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {DimCashDispenserGetBoxes} from 'fujitsu-mdcs-iot-devices';
import {MessageService} from 'primeng/api';
import {Subscription} from 'rxjs';
import {SignalingService} from 'src/app/services/signaling.service';
import {CashBox} from '../../interfaces/cashbox.interface';
import {TraceService} from '../../../services/trace.service';

@Component({
    selector: 'app-status-page',
    templateUrl: './status-page.component.html',
    styleUrls: ['./status-page.component.css', './status-page.component.scss'],
    providers: [MessageService],
})
export class StatusPageComponent implements OnInit, OnDestroy {
    kumoIotDevicesConnectorServiceSubscriptor!: Subscription;
    cashboxArray: CashBox[] = [];
    loading: boolean = true;
    waitText: string = 'common.wait';
    loadingBillsText: string = '';
    cashboxIdShowed: string = '';
    isBigScreen: boolean = false;

    @HostListener('window:resize', ['$event'])
    getScreenSize() {
        if (window.innerWidth > 700) {
            this.isBigScreen = true;
        } else {
            this.isBigScreen = false;
        }
    }

    constructor(
        private signalingService: SignalingService,
        private messageService: MessageService,
        private trace: TraceService
    ) {
        this.getScreenSize();
    }

    ngOnInit() {
        this.trace.write('status-page', 'init');

        this.isBigScreen = false;
        if (window.innerWidth > 700) {
            this.isBigScreen = true;
        }

        this.kumoIotDevicesConnectorServiceSubscriptor = this.signalingService.getSubjectKumo().subscribe((objResp) => {
            this.trace.write3('status-page', 'response', JSON.stringify(objResp));

            try {
                if (objResp.type.toLowerCase() === 'commanderror') {
                    this.msgErr(objResp.error);
                    this.loading = false;
                }
                if (objResp.type.toLowerCase() === 'boxesinfo') {
                    this.loading = false;
                    this.cashboxArray = objResp.boxes;
                }
            } catch (err) {
                this.trace.write3('status-page', 'error', JSON.stringify(err));
                this.loading = false;
            }
        });

        this.getCashBoxes();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }

    msgErr(txt: string) {
        this.messageService.add({
            severity: 'warn',
            summary: '',
            detail: txt,
        });
    }

    getCashBoxes(): void {
        const getBoxesCommand = new DimCashDispenserGetBoxes();

        this.signalingService.sendMessage(getBoxesCommand.toJsonString());
    }

    getNumbills(cashbox: CashBox) {
        return cashbox.denominations[0].currentBills.fit;
    }

    getTypeCashBox(cashbox: CashBox): string {
        return cashbox.boxType;
    }

    getStatusToolTipText(cashbox: CashBox): string {
        const result = `capacity = ${cashbox.capacity}
          threshold High = ${cashbox.highThreshold}
          theshold Low = ${cashbox.lowThreshold}          
          sn = ${cashbox.serialNumber}
        `;

        return result;
    }

    getDenomDataToolTipText(data: any): string {
        const result = `unfit = ${data.unfit}
          suspect = ${data.suspect}
          counterfeit = ${data.counterfeit}          
          inked = ${data.inked}
        `;

        return result;
    }

    getStatus(cashbox: CashBox): string {
        return cashbox.status;
    }

    getStatusSeverity(cashbox: CashBox) {
        if (cashbox.status === 'ok') {
            return 'info';
        }

        return 'danger';
    }

    getLevel(cashbox: CashBox): string {
        const bills = cashbox.denominations[0].currentBills.fit;

        if (bills < cashbox.lowThreshold) {
            return 'low';
        }
        if (bills > cashbox.highThreshold) {
            return 'high';
        }

        return 'ok';
    }

    getLevelSeverity(cashbox: CashBox): string {
        if (cashbox.denominations[0].currentBills.fit! < cashbox.lowThreshold) {
            return 'danger';
        }
        if (cashbox.denominations[0].currentBills.fit! > cashbox.highThreshold) {
            return 'primary';
        }

        return 'success';
    }

    showInfoCashBox(cashboxId: string) {
        if (cashboxId === this.cashboxIdShowed) {
            this.cashboxIdShowed = '';
        } else {
            this.cashboxIdShowed = cashboxId;
        }
    }

    isInfoToShow(cashboxId: string): boolean {
        if (cashboxId === this.cashboxIdShowed) {
            return true;
        }

        return false;
    }

    unsubscribe() {
        try {
            this.kumoIotDevicesConnectorServiceSubscriptor.unsubscribe();
        } catch (err) {}
    }
}
