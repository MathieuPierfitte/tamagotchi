import { TestBed, inject } from '@angular/core/testing';

import { TamagotchiService } from './tamagotchi.service';

describe('TamagotchiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TamagotchiService]
    });
  });

  it('should be created', inject([TamagotchiService], (service: TamagotchiService) => {
    expect(service).toBeTruthy();
  }));
});
