/* eslint-disable @typescript-eslint/no-shadow */
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SignalingService} from 'src/app/services/signaling.service';
import {TraceService} from 'src/app/services/trace.service';
import {Subscription} from 'rxjs';

import {DimCashDispenserAvailableBills} from 'fujitsu-mdcs-iot-devices';
import {DataAppService} from '../../services/data-app.service';

@Component({
    selector: 'app-load-denoms',
    templateUrl: './load-denoms.component.html',
    styleUrls: ['./load-denoms.component.scss'],
})
export class LoadDenomsComponent implements OnInit, OnDestroy {
    signalingSubscriptor: Subscription;
    loading: HTMLIonLoadingElement;

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        history.pushState(null, '');
    }

    constructor(
        private trace: TraceService,
        private translateService: TranslateService,
        private signalingService: SignalingService,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private navController: NavController,
        private dataAppService: DataAppService
    ) {}

    ngOnDestroy(): void {
        this.trace.write('load-denoms', 'on destroy');
        try {
            this.signalingSubscriptor.unsubscribe();
        } catch (err) {}
    }

    ngOnInit() {
        this.trace.write('load-denoms', 'on init');

        this.presentLoading(this.translateService.instant('loadDenoms.loadingBillsDenomination'));

        try {
            this.signalingSubscriptor = this.signalingService.getSubject().subscribe((resp) => {
                this.trace.write3('load-denoms', 'response', resp);
                const objResp = JSON.parse(resp);

                if (objResp.type === 'new-client-atm' && objResp.name === this.signalingService.connectedAtm) {
                    // send command to get denominations
                    const sendCommand = new DimCashDispenserAvailableBills();
                    this.signalingService.sendMessage(sendCommand.toJsonString());
                    return;
                }

                try {
                    if (objResp.device === 'CASH_DISPENSER' && objResp.type === 'AvailableBills') {
                        this.dataAppService.setMaxBillsDispensables(objResp.maxBillsDispensables);
                        const {bills} = objResp;

                        this.dataAppService.resetBillsByDenom();
                        bills.forEach((bill: {denom: number; numBills: number}) =>
                            this.dataAppService.setBillsByDenom(bill.denom, bill.numBills)
                        );

                        setTimeout(() => {
                            this.loading.dismiss();
                            this.navController.navigateRoot(['cash/amount']);
                        }, 1000);
                    } else {
                        this.trace.write3('load-denoms', 'unidentified event', objResp);
                    }
                } catch (err) {
                    // this.denomsLoaded = true;
                    this.trace.write3('load-denoms', 'ERROR', JSON.stringify(err));

                    this.showNok('error in reception, see log');
                }
            });
        } catch (err) {
            // this.denomsLoaded = true;
            this.trace.write3('load-denoms', 'Error in await connect', JSON.stringify(err));

            this.showNok('Error in await this.signaling.connect');
        }

        // send command to get denominations
        const sendCommand = new DimCashDispenserAvailableBills();
        this.signalingService.sendMessage(sendCommand.toJsonString());
    }

    async presentLoading(message: string) {
        this.loading = await this.loadingController.create({
            message,
        });

        this.loading.present();
    }

    async showNok(message: string) {
        await this.loading.dismiss();
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Error',
            subHeader: '',
            message,
            buttons: ['OK'],
            backdropDismiss: false,
            mode: 'ios',
        });

        await alert.present();
        this.navController.navigateRoot(['auth']);
    }
}
