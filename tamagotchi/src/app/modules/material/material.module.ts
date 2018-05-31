import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule
  ]
})
export class MaterialModule { }
