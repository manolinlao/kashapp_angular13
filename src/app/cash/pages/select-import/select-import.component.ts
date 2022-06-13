/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TraceService } from '../../../services/trace.service';
import { DataAppService } from '../../services/data-app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-import',
  templateUrl: './select-import.component.html',
  styleUrls: ['./select-import.component.scss'],
})
export class SelectImportComponent implements OnInit, OnDestroy {
  formValue: number;

  constructor(
    private trace: TraceService,
    private dataAppService: DataAppService,
    private alertController: AlertController,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ngOnDestroy() {
    this.trace.write('select-import', 'on destroy');
  }

  ngOnInit() {
    this.trace.write('select-import', 'on init');
  }

  goForm() {
    if (this.formValue === undefined || this.formValue < 1) {
      return;
    }
    if (this.formValue % 5 !== 0) {
      // cantidad no múltiple de 5
      this.showNok(this.translate.instant('selectImport.multiple5'));
      return;
    }
    this.goSelectedAmount(this.formValue);
  }
  goSelectedAmount(value: number): void {
    this.dataAppService.setImportSelected(value);
    this.dataAppService.setUseDenoms(false);
    this.navController.navigateRoot(['cash/options']);
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

    const { role } = await alert.onDidDismiss();
    this.trace.write('select-import', 'nok dismissed');
    this.formValue = null;
  }
}
