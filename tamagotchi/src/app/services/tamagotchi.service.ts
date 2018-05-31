import { Injectable } from '@angular/core';
import { TamagotchiController } from './tamagotchi.controller';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TamagotchiService {

  private controllers: { [name: string]: TamagotchiController } = { };

  tamagotchisNames = new Subject<string>();

  constructor() { }

  new(name: string) {
    this.controllers[name] = new TamagotchiController(name);
    this.tamagotchisNames.next(name);
  }

  get(name?: string): TamagotchiController {
    return this.controllers[name];
  }

}
