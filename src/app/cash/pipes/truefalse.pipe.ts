import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truefalse',
})
export class TrueFalsePipe implements PipeTransform {
    transform(value: boolean): string {
        if (value) {
            return 'Yes';
        }

        return 'No';
    }
}
