import { AbstractControl } from "@angular/forms";
import { validatorCnpj } from "./valida-cnpj.validator";
import { validatorCpf } from "./valida-cpf.validator";

export function validatorCpfAndCnpj(control: AbstractControl) {
	const value = control.value as string;
	if (value == null) {
		return null;
	}

	if (value.length !== 11 && value.length !== 14) {
		return { invalido: true };
	}

	if (validatorCnpj({ value } as AbstractControl)?.invalido && validatorCpf({ value } as AbstractControl)?.invalido) return { invalido: true };

	return null;
}
