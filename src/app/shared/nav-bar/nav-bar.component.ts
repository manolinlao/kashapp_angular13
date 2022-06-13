/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Input() showHeaderData: boolean = false;
  @Input() showHome: boolean = false;
  @Input() showLogout: boolean = true;

  constructor(private authService: AuthService, private navController: NavController) {}

  get userName() {
    return this.authService.auth.name;
  }

  ngOnInit() {}

  logout() {
    console.log('logout');

    /*
    if (this.router.url.includes('entrance')) {
      this.signalingService.removeUser(
        this.userService.getTypeUser(),
        this.userService.getAtmName(),
        this.userService.getUserName()
      );
    }
    */

    // this.router.navigate(['/auth'], { replaceUrl: true });
    this.navController.navigateRoot(['auth']);
  }

  goHome() {
    this.navController.navigateRoot(['entrance']);
  }
}
