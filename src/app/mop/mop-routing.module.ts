import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MopMainComponent} from './pages/mop-main/mop-main.component';
import {NonePageComponent} from './pages/none-page/none-page.component';
import {SetStoragePageComponent} from './pages/set-storage-page/set-storage-page.component';
import {StatusPageComponent} from './pages/status-page/status-page.component';

const routes: Routes = [
    {
        path: '',
        component: MopMainComponent,
        children: [
            {path: 'none', component: NonePageComponent},
            {path: 'set-storage', component: SetStoragePageComponent},
            {path: 'maintenance', component: SetStoragePageComponent},
            {path: 'status', component: StatusPageComponent},
            {path: '**', redirectTo: 'none'},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppMopRoutingModule {}
