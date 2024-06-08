//TODO: Validar input del formulario
import {UntypedFormGroup} from '@angular/forms';

export function FieldInvalid(fieldName: string, form: UntypedFormGroup): boolean {
    const field = form.get(fieldName);
    return field.invalid && field.touched;
}
