import { Injectable } from '@angular/core';
import { TamagotchiController } from '../controller/tamagotchi.controller';
import { Subject } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { TamagotchisStates } from '../controller/redux/tamagotchi.state';

@Injectable({
  providedIn: 'root'
})
export class TamagotchiService {

  private controllers: { [name: string]: TamagotchiController } = { };

  tamagotchisNames = new Subject<string>();

  constructor(private ngRedux: NgRedux<TamagotchisStates>) {
    ngRedux.subscribe(() => {
      const tamagotchis = ngRedux.getState().tamagotchis;
      Object.keys(tamagotchis)
        .forEach(name => {
          const controller = this.controllers[name];
          if (controller) {
            controller.updateState(tamagotchis[name]);
          }
        });
    });
  }

  new(name: string) {
    this.controllers[name] = new TamagotchiController(name, this.ngRedux);
    this.tamagotchisNames.next(name);
  }

  get(name?: string): TamagotchiController {
    return this.controllers[name];
  }

}
