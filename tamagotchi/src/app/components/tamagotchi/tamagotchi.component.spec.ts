import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamagotchiComponent } from './tamagotchi.component';

describe('TamagotchiComponent', () => {
  let component: TamagotchiComponent;
  let fixture: ComponentFixture<TamagotchiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamagotchiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamagotchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
