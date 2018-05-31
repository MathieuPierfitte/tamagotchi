import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { TamagotchiService } from '../../services/tamagotchi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  form: FormGroup;

  get nameControl(): FormControl {
    return this.form.controls['name'] as FormControl;
  }

  constructor(
    fb: FormBuilder,
    private tamagotchiService: TamagotchiService,
    private router: Router
  ) {
    this.form = fb.group({
      name: [null, [Validators.required, this.acceptableCharactersValidator(), this.nameAvailableValidator()]]
    });
  }

  private acceptableCharactersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value && (control.value as string).trim().length === 0) {
        return { invalid: true };
      } else {
        return { };
      }
    };
  }

  private nameAvailableValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return this.tamagotchiService.get(control.value) == null ? { } : { conflict: true };
    };
  }

  onSubmit() {
    const name = this.nameControl.value;
    this.tamagotchiService.new(name);
    this.router.navigate([`/${name}`]);
  }

}
