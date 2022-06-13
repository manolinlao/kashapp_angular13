import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {
    constructor(private navController: NavController) {}

    ngOnInit() {}

    go() {
        this.navController.navigateRoot('auth');
    }
}
