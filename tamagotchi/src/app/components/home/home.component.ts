import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TamagotchiService } from '../../services/tamagotchi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form: FormGroup;

  get nameControl(): FormControl {
    return this.form.controls['name'] as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private tamagotchiService: TamagotchiService,
    private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: []
    });
  }

  onSubmit() {
    const name = this.nameControl.value;
    this.tamagotchiService.new(name);
    this.router.navigate([`/${name}`]);
  }

}
