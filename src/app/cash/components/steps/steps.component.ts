/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../services/language.service';
import {Subscription} from 'rxjs';

interface Item {
    label: string;
}

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit, OnDestroy {
    @Input() indexStep: number = 0;
    items: Item[] = [];
    languageServiceSubscription: Subscription;

    constructor(private translate: TranslateService, private languageService: LanguageService) {}

    ngOnDestroy(): void {
        try {
            this.languageServiceSubscription?.unsubscribe();
        } catch (err) {}
    }

    ngOnInit() {
        this.createItems();

        this.languageServiceSubscription = this.languageService.currentLang.subscribe((resp) => {
            console.log('steps', resp);
            setTimeout(() => {
                this.createItems();
            }, 100);
        });
    }

    createItems() {
        this.items = [
            {label: this.translate.instant('cashStep.amount')},
            {label: this.translate.instant('cashStep.prepare')},
            {label: this.translate.instant('cashStep.card')},
            {label: this.translate.instant('cashStep.cash')},
        ];
    }
}
