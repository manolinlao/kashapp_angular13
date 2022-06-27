/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {SignalingService} from '../../../services/signaling.service';
import {NavController} from '@ionic/angular';
import {TraceService} from '../../../services/trace.service';
import {CurrencyPresented, DataAppService} from '../../services/data-app.service';
import {Subscription} from 'rxjs';

import {DimCashDispenserPresent} from 'fujitsu-mdcs-iot-devices';

@Component({
    selector: 'app-money',
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.scss'],
})
export class MoneyComponent implements OnInit, OnDestroy {
    signalingSubscriptor!: Subscription;
    loading: boolean = true;
    loadingText: string = 'cash.cashComing';
    waitText: string = 'common.wait';
    subTitle: string = 'cash.subTitle1';

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        history.pushState(null, '');
    }

    constructor(
        private signaling: SignalingService,
        private navController: NavController,
        private trace: TraceService,
        private dataAppService: DataAppService
    ) {}

    ngOnDestroy(): void {
        this.trace.write('money', 'on destroy');
        try {
            this.signalingSubscriptor.unsubscribe();
        } catch (err) {}
    }

    ngOnInit() {
        this.trace.write('money', 'on init');

        // listener
        this.signalingSubscriptor = this.signaling.getSubjectKumo().subscribe((objResp) => {
            const STATUS_TIMEOUT = 1; // old:1000
            const BILLS_TAKEN_TIMEOUT = 1; // old: 200

            this.trace.write3('money-page', 'response', JSON.stringify(objResp));

            try {
                if (objResp.type === 'Present') {
                    this.trace.write('money-page', 'Present');

                    setTimeout(() => {
                        if (objResp.status === 'ok') {
                            this.trace.write('money-page.component', 'Present status ok');
                            this.loading = false;
                            this.subTitle = 'cash.subTitle2';

                            const currenciesPresented: CurrencyPresented[] = [...objResp.bills];

                            this.dataAppService.setCurrenciesPresented(currenciesPresented);
                        } else {
                            this.trace.write('money-page', 'Present status nok');
                            this.navController.navigateRoot(['/cash/final', 'present_nok']);
                        }
                    }, STATUS_TIMEOUT);
                } else if (objResp.type === 'ItemsTakenEvent') {
                    this.trace.write('money-page', 'ItemsTakenEvent');
                    setTimeout(() => {
                        this.navController.navigateRoot(['/cash/final', 'bills_taken']);
                    }, BILLS_TAKEN_TIMEOUT);
                } else if (objResp.type === 'Retract') {
                    this.trace.write('money-page', 'Retract');
                    this.navController.navigateRoot(['/cash/final', 'retract']);
                } else if (objResp.type === 'CommandError') {
                    this.trace.write('money-page', 'CommandError');
                    this.navController.navigateRoot(['/cash/final', 'present_nok']);
                }
            } catch (err) {
                this.trace.write3('money-page', 'unidentified event', JSON.stringify(err));
            }
        });

        // send command to get money DimCashDispenserPresent
        const TIMEOUT_PRESENT = 30000;
        const presentCommand = new DimCashDispenserPresent(TIMEOUT_PRESENT);

        this.trace.write('money-page', 'send DimCashDispenserPresent');

        this.signaling.sendMessage(presentCommand.toJsonString());
    }
}
