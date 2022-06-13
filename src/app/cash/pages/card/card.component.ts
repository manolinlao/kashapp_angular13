import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    constructor(private navController: NavController) {}

    ngOnInit() {
        setTimeout(() => {
            this.navController.navigateRoot(['cash/money']);
        }, 2000);
    }
}
