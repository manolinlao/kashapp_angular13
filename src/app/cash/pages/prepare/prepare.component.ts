/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, OnInit, OnDestroy} from '@angular/core';

import {
    DimCashDispenserPrepareDispenseAmount,
    DimCashDispenserPrepareDispenseDistribution,
    DimCashDistribution,
} from 'fujitsu-mdcs-iot-devices';
import {Subscription} from 'rxjs';
import {DenominationSelected} from '../../interfaces/app-cash.interface';
import {DataAppService} from '../../services/data-app.service';
import {TraceService} from '../../../services/trace.service';
import {SignalingService} from '../../../services/signaling.service';
import {NavController, AlertController} from '@ionic/angular';

@Component({
    selector: 'app-prepare',
    templateUrl: './prepare.component.html',
    styleUrls: ['./prepare.component.scss'],
})
export class PrepareComponent implements OnInit, OnDestroy {
    importSelected: number = 0;

    denoms: DenominationSelected[] = [];
    validDenoms: DenominationSelected[] = [];
    preparingText: string = 'prepare.preparing';
    waitText: string = 'common.wait';
    importToDispenseText: string = '';
    amount: number = 0;
    algorithm: string = '';

    signalingSubscriptor!: Subscription;

    simulate: boolean = false;

    constructor(
        private dataAppService: DataAppService,
        private trace: TraceService,
        private signaling: SignalingService,
        private navController: NavController,
        private alertController: AlertController
    ) {}

    get useDenoms(): boolean {
        return this.dataAppService.getUseDenoms();
    }

    ngOnDestroy(): void {
        this.trace.write('prepare', 'on destroy');
        try {
            this.signalingSubscriptor.unsubscribe();
        } catch (err) {}
    }

    ngOnInit() {
        this.trace.write('prepare', 'on init');

        this.importSelected = this.dataAppService.getImportSelected();
        this.denoms = this.dataAppService.getBillsByDenomSelected();
        this.algorithm = this.dataAppService.getAlgorithm();

        if (this.useDenoms) {
            this.denoms.forEach((denom: DenominationSelected) => {
                if (denom.selected !== 0) {
                    this.validDenoms.push(denom);
                }
            });
        }

        this.signalingSubscriptor = this.signaling.getSubjectKumo().subscribe((objResp) => {
            const PREPARE_DISPENSE_TIMEOUT = 1; // old 3000

            this.trace.write3('prepare', 'response', JSON.stringify(objResp));

            try {
                if (objResp.type === 'PrepareDispenseAmount' || objResp.type === 'PrepareDispenseDistribution') {
                    setTimeout(() => {
                        if (objResp.status === 'ok') {
                            this.navController.navigateRoot(['cash/card']);
                        } else if (objResp.status === 'nok') {
                            let txtError = objResp.errorDescription;

                            if (txtError === '') {
                                txtError = objResp.error;
                            }
                            this.showNok(txtError);
                        }
                    }, PREPARE_DISPENSE_TIMEOUT);
                }

                if (objResp.type === 'CommandError') {
                    setTimeout(() => {
                        this.showNok(objResp.error);
                    }, 1);
                }
            } catch (err) {
                this.trace.write3('prepare-page', 'error', JSON.stringify(err));
            }
        });

        // send command to get denominations
        if (this.simulate) {
            this.navController.navigateRoot(['cash/final', 'bills_taken']);
            //this.navController.navigateRoot(['cash/final', 'retract']);
            //this.navController.navigateRoot(['cash/final', 'present_nok']);
            //this.navController.navigateRoot(['cash/card']);
        } else {
            this.sendPrepareDispenseCommand();
        }
    }

    sendPrepareDispenseCommand() {
        this.trace.write('prepare', 'sendPrepareDispenseCommand useDenoms =' + String(this.useDenoms));

        if (!this.useDenoms) {
            const prepareDispenseCommand = new DimCashDispenserPrepareDispenseAmount(this.importSelected);

            this.signaling.sendMessage(prepareDispenseCommand.toJsonString());
        } else {
            const distributions: DimCashDistribution[] = [];

            for (let ind = 0; ind < this.denoms.length; ind++) {
                const objDist: DimCashDistribution = {
                    numBills: this.denoms[ind].selected,
                    denom: this.denoms[ind].id,
                };

                distributions.push(objDist);
            }
            const prepareDispenseDistributionCommand = new DimCashDispenserPrepareDispenseDistribution(
                this.importSelected,
                distributions
            );

            this.signaling.sendMessage(prepareDispenseDistributionCommand.toJsonString());
        }
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
        this.navController.navigateRoot(['cash/amount']);
    }
}
