import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth/guards/auth.guard';

const routes: Routes = [
    {
        path: 'intro',
        loadChildren: () => import('./intro/intro.module').then((m) => m.IntroModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'entrance',
        loadChildren: () => import('./entrance/entrance.module').then((m) => m.EntranceModule),
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
    },
    {
        path: 'cash',
        loadChildren: () => import('./cash/cash.module').then((m) => m.CashModule),
    },
    {
        path: 'mop',
        loadChildren: () => import('./mop/mop.module').then((mod) => mod.MopModule),
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        redirectTo: 'intro',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
