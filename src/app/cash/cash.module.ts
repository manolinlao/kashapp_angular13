import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppCashRoutingModule} from './cash-routing.module';
import {IonicModule} from '@ionic/angular';
import {SelectImportComponent} from './pages/select-import/select-import.component';
import {SharedModule} from '../shared/shared.module';
import {LoadDenomsComponent} from './pages/load-denoms/load-denoms.component';
import {TrueFalsePipe} from './pipes/truefalse.pipe';
import {StepsComponent} from './components/steps/steps.component';
import {PrimengModule} from '../primeng/primeng.module';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonCashComponent} from './components/button-cash/button-cash.component';
import {FormsModule} from '@angular/forms';
import {OptionsComponent} from './pages/options/options.component';
import {SelectOptionComponent} from './components/select-option/select-option.component';
import {PrepareComponent} from './pages/prepare/prepare.component';
import {BillSelectedComponent} from './components/bill-selected/bill-selected.component';
import {CardComponent} from './pages/card/card.component';
import {MoneyComponent} from './pages/money/money.component';
import {FinalComponent} from './pages/final/final.component';

@NgModule({
    declarations: [
        SelectImportComponent,
        LoadDenomsComponent,
        TrueFalsePipe,
        StepsComponent,
        ButtonCashComponent,
        OptionsComponent,
        SelectOptionComponent,
        PrepareComponent,
        BillSelectedComponent,
        CardComponent,
        MoneyComponent,
        FinalComponent,
    ],
    imports: [
        CommonModule,
        AppCashRoutingModule,
        IonicModule.forRoot(),
        SharedModule,
        PrimengModule,
        TranslateModule,
        FormsModule,
    ],
})
export class CashModule {}
