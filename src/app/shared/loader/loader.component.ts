import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
})
export class LoaderComponent {
    @Input() txtLoading: string = 'Validating user...';
    @Input() txtWait: string = '';
}
