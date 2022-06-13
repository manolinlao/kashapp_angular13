/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {TraceService} from '../../../services/trace.service';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../../services/storage.service';
import {TranslateService} from '@ngx-translate/core';
import {SignalingService} from '../../../services/signaling.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  myForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    currentPassword: ['', [Validators.required]],
  });

  loginSubscription: Subscription | null;

  loading: HTMLIonLoadingElement;
  showContent: boolean = true;

  constructor(
    private fb: FormBuilder,
    private trace: TraceService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authSevice: AuthService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private signalingService: SignalingService,
    private navController: NavController
  ) {}

  ngOnDestroy(): void {
    this.trace.write('login', 'on destroy');

    try {
      this.loginSubscription.unsubscribe();
    } catch (err) {}
  }

  ngOnInit() {
    this.trace.write('login', 'on init');

    this.translateService.setDefaultLang('es');
    this.translateService.use('es');

    // desconexión de usuario
    this.signalingService.close();
  }

  login() {
    try {
      this.loginSubscription.unsubscribe();
    } catch (err) {}

    this.signalingService.close();

    if (!this.myForm.valid) {
      this.trace.write('login', 'form not valid');
      return;
    }

    this.presentLoading(this.translateService.instant('login.validating'));
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message,
    });

    this.loading.present();

    this.loginSubscription = this.authSevice
      .login(this.myForm.value.username, this.myForm.value.currentPassword)
      .subscribe({
        next: (resp) => {
          this.trace.write3('login', 'subscription response', JSON.stringify(resp));
          if (resp && resp.name !== '') {
            this.trace.write('login.component subscription resp', 'user exist - go entrance');

            this.storageService.saveLoginToken(resp);

            this.myForm.reset();

            this.endLoading(true);
          } else {
            this.trace.write('login.component subscription resp', 'user does not exist');
            this.showLoginError(this.translateService.instant('login.userNotValid'));
          }
        },
        error: (err) => {
          this.trace.write3('login', 'ERROR in subscription', JSON.stringify(err));
          this.showLoginError(JSON.stringify(err));
        },
        complete: () => this.trace.write('login', 'Subscription complete'),
      });
  }

  async showLoginError(msgErr: string) {
    this.myForm.reset();
    this.endLoading(false);

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Login Error',
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

  endLoading(terminate: boolean) {
    if (terminate) {
      this.showContent = false;
      this.loading.dismiss();
      console.log('login', 'go entrance');

      // Porque no se por qué no destruye el componente login
      try {
        this.loginSubscription.unsubscribe();
      } catch (err) {}

      // this.router.navigate(['/entrance'], { replaceUrl: true });
      this.navController.navigateRoot(['entrance']);
    } else {
      this.loading.dismiss();
    }
  }

  clear() {
    this.myForm.reset();
  }
}
