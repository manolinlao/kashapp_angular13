import {NgModule} from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {FieldsetModule} from 'primeng/fieldset';
import {StepsModule} from 'primeng/steps';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DividerModule} from 'primeng/divider';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {TagModule} from 'primeng/tag';
import {ToastModule} from 'primeng/toast';

@NgModule({
    declarations: [],
    exports: [
        DropdownModule,
        TableModule,
        FieldsetModule,
        StepsModule,
        ProgressSpinnerModule,
        DividerModule,
        CardModule,
        CarouselModule,
        TagModule,
        ToastModule,
    ],
})
export class PrimengModule {}
