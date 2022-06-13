/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {CurrencyPresented, DataAppService} from '../../services/data-app.service';
import {TraceService} from '../../../services/trace.service';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-final',
    templateUrl: './final.component.html',
    styleUrls: ['./final.component.scss'],
})
export class FinalComponent implements OnInit, OnDestroy {
    simulate: boolean = false;

    code: string = '';
    importSelected: number = 0;
    currenciesPresented: CurrencyPresented[] = [];
    loading: boolean = true;

    routeParametersSubscription!: Subscription;
    myTimeout!: ReturnType<typeof setTimeout>;

    constructor(
        private trace: TraceService,
        private dataAppService: DataAppService,
        private activatedRoute: ActivatedRoute,
        private navController: NavController,
        private translate: TranslateService
    ) {}
    ngOnDestroy(): void {
        this.trace.write('final', 'on destroy');
        try {
            clearTimeout(this.myTimeout);
            this.routeParametersSubscription.unsubscribe();
        } catch (err) {}
    }
    ngOnInit() {
        if (this.simulate) {
            this.importSelected = 350;
            this.currenciesPresented = [
                {
                    denom: '5',
                    numBills: 20,
                },
                {
                    denom: '10',
                    numBills: 5,
                },
                {
                    denom: '20',
                    numBills: 7,
                },
            ];

            this.code = 'bills_taken';
            this.loading = false;

            setTimeout(() => {
                this.gotoEntrance();
            }, 4000);

            return;
        }

        this.routeParametersSubscription = this.activatedRoute.params.subscribe(({code}) => {
            this.code = code;
            this.trace.write('final', `code = ${code}`);
            this.loading = false;

            this.myTimeout = setTimeout(() => {
                this.gotoEntrance();
            }, 60000);

            switch (code) {
                case 'bills_taken':
                    this.importSelected = this.dataAppService.getImportSelected();
                    this.currenciesPresented = this.dataAppService.getCurrenciesPresented();

                    this.trace.write3('final', 'bills_taken', 'importSelected = ' + this.importSelected.toString());
                    this.trace.write3('final', 'currenciesPresented', JSON.stringify(this.currenciesPresented));

                    break;
                case 'retract':
                    break;
                default:
                    break;
            }
        });
    }

    toNumber(str: string): number {
        return Number(str);
    }

    getCashTakenLiteral(): string {
        return `${this.translate.instant('final.cashTaken')}: ${this.importSelected} €`;
    }

    continue() {
        this.navController.navigateRoot(['cash/amount']);
    }

    gotoEntrance() {
        this.trace.write('final', 'timeout, calling gotoEntrance');
        this.navController.navigateRoot(['/entrance']);
    }
}
