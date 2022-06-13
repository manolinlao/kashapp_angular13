import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SelectImportComponent} from './pages/select-import/select-import.component';
import {LoadDenomsComponent} from './pages/load-denoms/load-denoms.component';
import {OptionsComponent} from './pages/options/options.component';
import {PrepareComponent} from './pages/prepare/prepare.component';
import {CardComponent} from './pages/card/card.component';
import {MoneyComponent} from './pages/money/money.component';
import {FinalComponent} from './pages/final/final.component';

const routes: Routes = [
    {
        path: 'load',
        component: LoadDenomsComponent,
    },
    {
        path: 'amount',
        component: SelectImportComponent,
    },
    {
        path: 'options',
        component: OptionsComponent,
    },
    {
        path: 'prepare',
        component: PrepareComponent,
    },
    {
        path: 'card',
        component: CardComponent,
    },
    {
        path: 'money',
        component: MoneyComponent,
    },
    {
        path: 'final/:code',
        component: FinalComponent,
    },
    {
        path: '**',
        redirectTo: 'load',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppCashRoutingModule {}
