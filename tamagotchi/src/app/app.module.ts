import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { MaterialModule } from './modules/material/material.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TamagotchiComponent } from './components/tamagotchi/tamagotchi.component';
import { HomeComponent } from './components/home/home.component';
import { TamagotchiState, TamagotchisStates, InitialTamagotchisStates } from './controller/redux/tamagotchi.state';
import { tamagotchiReducer } from './controller/redux/tamagotchi.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TamagotchiComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: ':name', component: TamagotchiComponent },
      { path: '**', redirectTo: '/' }
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<TamagotchisStates>) {
    ngRedux.configureStore(tamagotchiReducer, new InitialTamagotchisStates());
  }
}
