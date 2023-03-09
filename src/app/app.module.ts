import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AddDocumentComponent } from './add-document/add-document.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DragDropFileDirective } from './directives/drag-drop-file.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AddDocumentComponent,
    DragDropFileDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
