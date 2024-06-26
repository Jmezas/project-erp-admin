import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    document: string;
    phone: string;
    password: string;
    roles: number[] | string | number;
    warehouses: number[] | string | number;
}


export function matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.parent && reverse) {
            const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
            if (c) {
                c.updateValueAndValidity();
            }
            return null;
        }
        return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
            ? null
            : {matching: true};
    };
}
