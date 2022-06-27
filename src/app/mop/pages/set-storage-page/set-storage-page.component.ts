/* eslint-disable no-empty */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-eval */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
import {Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DimCashDispenserGetBoxes, DimCashDispenserModifyStorageItems} from 'fujitsu-mdcs-iot-devices';
import {Subscription} from 'rxjs';
import {CashBox} from '../../interfaces/cashbox.interface';
import {SignalingService} from 'src/app/services/signaling.service';
import {TraceService} from '../../../services/trace.service';
import {AlertController} from '@ionic/angular';

interface Denom {
    name: string;
    value: number;
}

@Component({
    selector: 'app-set-storage-page',
    templateUrl: './set-storage-page.component.html',
    styleUrls: ['./set-storage-page.component.css', './set-storage-page.component.scss'],
})
export class SetStoragePageComponent implements OnInit, OnDestroy {
    signalingSubscriptor!: Subscription;

    @ViewChild('myInput') myInput!: ElementRef;
    @ViewChild('myInputDentroDelFrom') myInputDentroDelForm!: ElementRef;

    possibleDenoms: Denom[] = [];
    cashboxArray: CashBox[] = [];

    loading: boolean = true;
    waitText: string = 'common.wait';

    dateCommandGetBoxes: number = 0;
    dateCommandSetStorage: number = 0;

    myForm: FormGroup = this.fb.group({
        selectedDenom0: [{name: 0, value: 0}],
        selectedDenom1: [{name: 0, value: 10}],
        selectedDenom2: [{name: 0, value: 0}],
        selectedDenom3: [{name: 0, value: 0}],
        selectedDenom4: [{name: 0, value: 0}],
        selectedDenom5: [{name: 0, value: 0}],
        selectedDenom6: [{name: 0, value: 0}],
        selectedDenom7: [{name: 0, value: 0}],
        selectedDenom8: [{name: 0, value: 0}],
        selectedDenom9: [{name: 0, value: 0}],
        selectedDenom10: [{name: 0, value: 0}],
        numBills0: [0],
        numBills1: [0],
        numBills2: [0],
        numBills3: [0],
        numBills4: [0],
        numBills5: [0],
        numBills6: [0],
        numBills7: [0],
        numBills8: [0],
        numBills9: [0],
        numBills10: [0],
    });

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        history.pushState(null, '');
    }

    constructor(
        private signaling: SignalingService,
        private alertController: AlertController,
        private fb: FormBuilder,
        private trace: TraceService
    ) {
        this.possibleDenoms = [
            {
                name: '0',
                value: 0,
            },
            {
                name: '5 €',
                value: 5,
            },
            {
                name: '10 €',
                value: 10,
            },
            {
                name: '20 €',
                value: 20,
            },
            {
                name: '50 €',
                value: 50,
            },
            {
                name: '100 €',
                value: 100,
            },
            {
                name: '200 €',
                value: 200,
            },
            {
                name: '500 €',
                value: 500,
            },
        ];
    }

    ngOnInit() {
        // listener
        this.signalingSubscriptor = this.signaling.getSubjectKumo().subscribe((objResp) => {
            this.trace.write3('set-storage-page', 'response', JSON.stringify(objResp));

            try {
                if (objResp.type.toLowerCase() === 'modifystorageitems') {
                    this.trace.write3(
                        'TIME CONTROL SET STORAGE',
                        'Respuesta a GetBoxes',
                        (Date.now() - this.dateCommandGetBoxes).toString()
                    );
                    if (objResp.status === 'nok') {
                        this.showMessage(objResp.errorDescription);
                    } else {
                        this.showMessage('Set Storage done');
                    }
                } else {
                    this.trace.write3(
                        'TIME CONTROL SET STORAGE',
                        'Respuesta a ModifyStorageItems',
                        (Date.now() - this.dateCommandSetStorage).toString()
                    );
                    if (objResp.type.toLowerCase() === 'commanderror') {
                        this.showMessage(objResp.error);
                    }
                    if (objResp.type.toLowerCase() === 'boxesinfo') {
                        // only get boxType === 'out'
                        this.cashboxArray = objResp.boxes.filter((box: any) => box.boxType === 'out');

                        this.chargeFormDenoms();
                    }
                }
            } catch (err) {
                this.loading = false;
            }
        });

        this.getCashBoxes();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }

    getCashBoxes(): void {
        const getBoxesCommand = new DimCashDispenserGetBoxes();

        this.dateCommandGetBoxes = Date.now();
        this.signaling.sendMessage(getBoxesCommand.toJsonString());
    }

    chargeFormDenoms() {
        this.trace.write('set-storage-page', 'chargeFormDenoms', false);

        for (let ind = 0; ind < this.cashboxArray.length; ind++) {
            const cashbox: CashBox = this.cashboxArray[ind];

            try {
                eval(`this.myForm.value.selectedDenom${ind}`).value = cashbox.denominations[0].denom;
                eval(`this.myForm.value.selectedDenom${ind}`).name = `${cashbox.denominations[0].denom} €`;
                eval(`this.myForm.controls.numBills${ind}`).setValue(this.getActualBills(cashbox));
            } catch (err) {
                this.trace.write3('set-storage-page', 'chargeFormDenoms', 'possibly one unit has null denominations');
                eval(`this.myForm.value.selectedDenom${ind}`).value = 10;
                eval(`this.myForm.value.selectedDenom${ind}`).name = 'xx €';
                eval(`this.myForm.controls.numBills${ind}`).setValue(0);
            }
        }

        this.loading = false;
    }

    async showMessage(msgErr: string) {
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
    }

    sendSetStorageCommand() {
        const storage = [
            {unit: 'PHP3', currency: 'EUR', value: 20, box: 'EUR20', items: 120},
            {unit: 'PHP4', currency: 'EUR', value: 5, box: 'EUR5', items: 65},
            {unit: 'PHP5', currency: 'EUR', value: 10, box: 'EUR10', items: 45},
        ];

        const modifyStorageCommand = new DimCashDispenserModifyStorageItems(storage);

        this.signaling.sendMessage(modifyStorageCommand.toJsonString());
    }

    setStorage() {
        this.trace.write('set-storage-page', this.myForm.value, false);
        const storage = [];

        for (let ind = 0; ind < this.cashboxArray.length; ind++) {
            try {
                const storageUnit = {
                    unit: this.cashboxArray[ind].id,
                    currency: 'EUR',
                    value: eval(`this.myForm.value.selectedDenom${ind}`).value,
                    box: this.cashboxArray[ind].denominations[0].name,
                    items: eval(`this.myForm.value.numBills${ind}`),
                };

                storage.push(storageUnit);
            } catch (err) {}
        }

        const modifyStorageCommand = new DimCashDispenserModifyStorageItems(storage);

        this.dateCommandSetStorage = Date.now();
        this.signaling.sendMessage(modifyStorageCommand.toJsonString());
    }

    getFormControlNameDenom(ind: number): string {
        return `selectedDenom${ind}`;
    }

    getFormControlNameNumbills(ind: number): string {
        return `numBills${ind}`;
    }

    getActualBills(cashbox: CashBox): number {
        let result = 0;

        try {
            result = cashbox.denominations[0].currentBills.fit;
        } catch (err) {}

        return result;
    }

    getCashboxName(cashbox: CashBox): string {
        let result = '';

        try {
            result = cashbox.denominations[0].name;
        } catch (err) {}

        return result;
    }

    unsubscribe() {
        try {
            this.trace.write('set-storage-page.component', 'unsubscribe', false);
            this.signalingSubscriptor.unsubscribe();
        } catch (err) {
            this.trace.write('set-storage-page.component ERR', JSON.stringify(err), false);
        }
    }
}
