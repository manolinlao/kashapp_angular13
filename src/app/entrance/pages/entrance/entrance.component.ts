/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {TraceService} from '../../../services/trace.service';
import {SignalingService} from '../../../services/signaling.service';
import {UserService} from '../../../services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {Subscription} from 'rxjs';
import {AtmInfo, CapabilitiesAtm, Device, State} from '../../interfaces/entrance.interface';
import {Router} from '@angular/router';
import {
    ActionSheetButton,
    ActionSheetController,
    AlertController,
    LoadingController,
    NavController,
} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-entrance',
    templateUrl: './entrance.component.html',
    styleUrls: ['./entrance.component.scss'],
})
export class EntranceComponent implements OnInit, OnDestroy {
    atms: AtmInfo[] = [];
    deviceSelected!: Device | undefined;
    waiting: boolean = true;

    devices!: Device[];
    clients!: string[];

    private subscription!: Subscription;
    private subscriptionLogin!: Subscription;

    loading: HTMLIonLoadingElement;

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        history.pushState(null, '');
    }

    constructor(
        private trace: TraceService,
        private signalingService: SignalingService,
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private translate: TranslateService,
        private actionSheetController: ActionSheetController,
        private navController: NavController
    ) {}

    ngOnInit() {
        this.trace.write('entrance', 'on init');
        this.trace.write('entrance', 'typeuser=' + this.userService.getTypeUser());

        this.waiting = true;

        this.signalingService.removeUser(
            this.userService.getTypeUser(),
            this.userService.getAtmName(),
            this.userService.getUserName()
        );

        this.userService.resetTypeUser();

        this.presentLoading(this.translate.instant('entrance.loading'));

        if (!this.signalingService.connected) {
            this.trace.write3('entrance', 'on init', 'not connected');
            console.log(this.authService.auth?.token);
            this.signalingService.init(`${this.authService.auth?.token}`);
        } else {
            this.trace.write3('entrance', 'on init', 'connected');
            this.signalingService.sendGetActualState();
        }

        this.subscriptionLogin = this.signalingService.getSubject().subscribe((resp: any) => {
            this.trace.write3('entrance', 'subscriptionLogin response', JSON.stringify(resp));
            const objResp = JSON.parse(resp);

            if (objResp.type === 'error') {
                setTimeout(() => {
                    // sessionStorage.removeItem('cashapp_token');
                    this.loading.dismiss();
                    this.showError('Login error', objResp.errorDescription);
                    this.router.navigate(['/auth']);
                }, 2000);
            }
        });

        this.subscription = this.signalingService.getSubjectState().subscribe((state: State) => {
            this.trace.write3('entrance', 'state received', JSON.stringify(state));

            if (!state.connected) {
                // conectado, ahora podemos añadirnos como cliente
                this.trace.write3('entrance', 'state received', 'connected');
                this.signalingService.addClient(`${this.authService.auth?.name}`);
            } else {
                this.clients = [];
                this.devices = [];
                if (state.devices?.length !== 0) {
                    this.devices = [...state.devices!];
                    this.atms = [];
                    for (let ind = 0; ind < state.devices!.length; ind++) {
                        let capability: number = CapabilitiesAtm.all;

                        if (state.devices![ind].operator && state.devices![ind].client) {
                            capability = CapabilitiesAtm.onlyStatus;
                        }
                        if (state.devices![ind].operator && !state.devices![ind].client) {
                            capability = CapabilitiesAtm.onlyStatus;
                        }
                        if (!state.devices![ind].operator && state.devices![ind].client) {
                            capability = CapabilitiesAtm.onlyStatus;
                        }

                        this.atms[ind] = {
                            name: state.devices![ind].atm,
                            capability,
                        };
                    }
                } else {
                    this.atms = [];
                }

                if (state.clients) {
                    if (state.clients?.length !== 0) {
                        for (let ind = 0; ind < state.clients?.length; ind++) {
                            this.clients[ind] = state.clients![ind].name;
                        }
                    }
                }

                this.loading.dismiss();
                this.waiting = false;
            }
        });
    }

    ngOnDestroy() {
        this.trace.write('entrance', 'on destroy');

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.subscriptionLogin) {
            this.subscriptionLogin.unsubscribe();
        }
    }

    async presentLoading(message: string) {
        this.loading = await this.loadingController.create({
            message,
        });
        this.loading.present();
    }

    async showError(headerTxt: string, msgErr: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: headerTxt,
            subHeader: '',
            message: msgErr,
            buttons: ['OK'],
            backdropDismiss: false,
            mode: 'ios',
        });

        await alert.present();

        const {role} = await alert.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }

    selectAtm(atm: string) {
        this.trace.write3('entrance', 'selectAtm', atm);

        if (atm.includes('not_available')) {
            atm = atm.slice(atm.indexOf('#') + 1);
            this.showError('atm ' + atm, this.translate.instant('entrance.notAvailable'));
        } else {
            this.deviceSelected = this.devices.find((device) => device.atm === atm);
            this.trace.write3('entrance', 'deviceSelected', JSON.stringify(this.deviceSelected));

            this.openMenu();
        }
    }

    async openMenu() {
        const btns: ActionSheetButton[] = [];
        const operateBtn: ActionSheetButton = {
            text: this.translate.instant('entrance.takeCash'),
            icon: 'cash-outline',
            handler: () => this.doOperative('cliente'),
        };
        const mopBtn: ActionSheetButton = {
            text: this.translate.instant('entrance.maintenance'),
            icon: 'cog-outline',
            handler: () => this.doOperative('mop'),
        };
        const statusBtn: ActionSheetButton = {
            text: this.translate.instant('entrance.status'),
            icon: 'eye-outline',
            handler: () => this.doOperative('status'),
        };

        btns.unshift(statusBtn);
        if (this.isPpossibleMop(this.deviceSelected)) {
            btns.unshift(mopBtn);
        }
        if (this.isPossibleOperate(this.deviceSelected)) {
            btns.unshift(operateBtn);
        }

        const actionSheet = await this.actionSheetController.create({
            header: 'ATM ' + this.deviceSelected.atm,
            buttons: btns,
            mode: 'ios',
        });

        await actionSheet.present();
    }

    doOperative(typeOp: string): void {
        this.trace.write3('entrance', 'doOperative::' + typeOp, this.deviceSelected.atm);

        switch (typeOp) {
            case 'cliente':
                this.signalingService.connectWithAtmAsClient(this.deviceSelected.atm, `${this.authService.auth?.name}`);
                this.userService.setTypeUser('client', this.deviceSelected.atm, this.authService.auth.name);

                this.navController.navigateRoot(['cash']);
                break;
            case 'mop':
                this.signalingService.connectWithAtmAsOperator(
                    this.deviceSelected.atm,
                    `${this.authService.auth?.name}`
                );
                this.userService.setTypeUser('operator', this.deviceSelected.atm, this.authService.auth?.name);
                sessionStorage.setItem('userType', 'operator');

                this.navController.navigateRoot(['mop/maintenance']);
                break;
            case 'status':
                this.signalingService.connectWithAtmAsObserver(
                    this.deviceSelected.atm,
                    `${this.authService.auth?.name}`
                );
                this.userService.setTypeUser('observer', this.deviceSelected.atm, this.authService.auth?.name);
                sessionStorage.setItem('userType', 'observer');
                this.navController.navigateRoot(['mop/status']);
                break;
            default:
                break;
        }
    }

    isPossibleOperate(device: Device): boolean {
        let result = true;

        try {
            if (device!.client || device!.operator) {
                result = false;
            }
        } catch (err) {
            result = true;
        }

        return result;
    }

    isPpossibleMop(device: Device): boolean {
        let result = true;

        try {
            if (device!.operator || device!.client) {
                result = false;
            }
        } catch (err) {
            result = true;
        }

        return result;
    }
}
