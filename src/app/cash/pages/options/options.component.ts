/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {LoadingController, AlertController, NavController} from '@ionic/angular';
import {TraceService} from '../../../services/trace.service';
import {TranslateService} from '@ngx-translate/core';
import {SignalingService} from '../../../services/signaling.service';
import {Subscription} from 'rxjs';

import {DimCashDispenserDispensableOptions} from 'fujitsu-mdcs-iot-devices';
import {BillsDistribution, Denom} from '../../interfaces/app-cash.interface';
import {DataAppService} from '../../services/data-app.service';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit, OnDestroy {
    loader: HTMLIonLoadingElement;
    loading: boolean = true;
    signalingSubscriptor: Subscription;

    amount: number = 0;
    billsDistribution!: BillsDistribution[];
    numberOptionNoSelect: string = '0';

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        history.pushState(null, '');
    }

    constructor(
        private loadingController: LoadingController,
        private alertController: AlertController,
        private trace: TraceService,
        private translate: TranslateService,
        private signalingService: SignalingService,
        private navController: NavController,
        private dataAppService: DataAppService
    ) {}

    ngOnDestroy() {
        this.trace.write('options', 'on destroy');
        try {
            this.signalingSubscriptor.unsubscribe();
        } catch (err) {}
    }
    ngOnInit() {
        this.trace.write('options', 'on init');
        this.amount = this.dataAppService.getImportSelected();
        this.presentLoader();

        this.signalingSubscriptor = this.signalingService.getSubjectKumo().subscribe((objResp) => {
            this.trace.write3('options-page', 'response', JSON.stringify(objResp));

            try {
                if (objResp.type.toLocaleLowerCase() === 'commanderror') {
                    this.trace.write('options', 'COMMANDERROR');
                    this.loader.dismiss();
                    this.showNok('error with dispensableOptions');

                    /*
                    this.trace.write3('options-page', 'commanderror', objResp.error);
                    this.loading = false;
                    this.messageService.add({
                      severity: 'warn',
                      summary: '',
                      detail: 'error with dispensableOptions',
                    });
                    */
                }

                if (objResp.type.toLowerCase() === 'dispensableoptions') {
                    this.trace.write3('options-page', 'event', 'dispensableoptions');
                    this.billsDistribution = objResp.options;
                    this.billsDistribution = this.clean(this.billsDistribution);
                    this.trace.write3('options-page', 'billsDistribution', JSON.stringify(this.billsDistribution));
                    this.numberOptionNoSelect = (this.billsDistribution.length + 1).toString();
                    this.loader.dismiss();
                    this.loading = false;
                }
            } catch (err) {
                this.trace.write3('options-page', 'unidentified event', JSON.stringify(err));
            }
        });

        this.sendPrepareDispenseCommand();
    }

    async presentLoader() {
        this.loader = await this.loadingController.create({
            message: this.translate.instant('optionBills.computing'),
        });
        this.loader.present();
    }

    clean(arr: BillsDistribution[]): BillsDistribution[] {
        const result: BillsDistribution[] = [];

        result.push(arr[0]);
        for (let ind = 1; ind < arr.length; ind++) {
            const objBills: Denom[] = arr[ind].bills;

            let found = false;

            for (let indRes = 0; indRes < result.length; indRes++) {
                if (JSON.stringify(result[indRes].bills) === JSON.stringify(objBills)) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                result.push(arr[ind]);
            }
        }

        return result;
    }

    sendPrepareDispenseCommand() {
        const dispensableOptions = new DimCashDispenserDispensableOptions(this.amount);

        this.signalingService.sendMessage(dispensableOptions.toJsonString());
    }

    async showNok(msgErr: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: '',
            subHeader: '',
            message: msgErr,
            buttons: ['OK'],
            backdropDismiss: false,
            mode: 'ios',
        });

        await alert.present();

        const {role} = await alert.onDidDismiss();
        this.trace.write('select-import', 'nok dismissed');
        this.loading = false;
    }

    noSelect() {
        this.dataAppService.setUseDenoms(false);
        this.navController.navigateRoot(['cash/prepare']);
    }

    optionClick(id: number) {
        this.trace.write3('options-page', 'selected option', id.toString());
        this.trace.write3('options-page', 'bills', JSON.stringify(this.billsDistribution[id].bills));

        const billsByDenomSelected = [];

        for (let ind = 0; ind < this.billsDistribution[id].bills.length; ind++) {
            billsByDenomSelected[ind] = {
                id: this.billsDistribution[id].bills[ind].denom,
                selected: this.billsDistribution[id].bills[ind].numBills,
            };
        }

        this.dataAppService.setAlgorithm(this.billsDistribution[id].algorithm);
        this.dataAppService.setBillsByDenomSelected(billsByDenomSelected);
        this.dataAppService.setUseDenoms(true);
        this.navController.navigateRoot(['cash/prepare']);
    }

    goBack() {
        this.navController.navigateRoot(['cash/amount']);
    }
}
