/* eslint-disable no-console */
import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {TraceService} from '../../../services/trace.service';
import {NavController} from '@ionic/angular';

interface Product {
    name: string;
    icon: string;
    navigate: string;
}

@Component({
    selector: 'app-mop-main',
    templateUrl: './mop-main.component.html',
    styleUrls: ['./mop-main.component.css'],
})
export class MopMainComponent implements OnInit {
    responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
            numScroll: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 2,
            numScroll: 2,
        },
    ];

    products: Product[] = [
        {
            name: 'mop.menu.status',
            icon: 'pi pi-cog',
            navigate: 'status',
        },
        {
            name: 'mop.menu.setStorage',
            icon: 'pi pi-server',
            navigate: 'set-storage',
        },
        {
            name: 'mop.menu.config',
            icon: 'pi pi-bell',
            navigate: 'none',
        },
        {
            name: 'mop.menu.lights',
            icon: 'pi pi-video',
            navigate: 'none',
        },
        {
            name: 'mop.menu.user',
            icon: 'pi pi-user',
            navigate: 'none',
        },
    ];
    productsOnlyStatus: Product[] = [
        {
            name: 'mop.menu.status',
            icon: 'pi pi-cog',
            navigate: 'status',
        },
        {
            name: 'mop.menu.config',
            icon: 'pi pi-bell',
            navigate: 'none',
        },
        {
            name: 'mop.menu.lights',
            icon: 'pi pi-video',
            navigate: 'none',
        },
        {
            name: 'mop.menu.user',
            icon: 'pi pi-user',
            navigate: 'none',
        },
    ];
    nameProductSelected: string = 'mop.menu.status';

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        history.pushState(null, '');
    }

    constructor(private navController: NavController, private userService: UserService, private trace: TraceService) {}

    ngOnInit(): void {
        this.trace.write('mop-main', 'init');

        if (this.userService.getTypeUser() === 'operator') {
            this.nameProductSelected = 'mop.menu.setStorage';
        } else {
            this.nameProductSelected = 'mop.menu.status';
            this.products = [...this.productsOnlyStatus];
        }
    }

    optionClicked(nav: string, name: string) {
        console.log('optionclicked', name);
        this.nameProductSelected = this.getNameProductSelected(name);

        this.navController.navigateRoot([`mop/${nav}`]);
    }

    getNameProductSelected(name: string): string {
        for (let ind = 0; ind < this.products.length; ind++) {
            if (this.products[ind].name === name) {
                return name;
            }
        }

        return 'mop.menu.status';
    }

    getClassProduct(name: string): string {
        if (name === this.nameProductSelected) {
            return 'product-item-selected';
        }

        return 'product-item';
    }
}
