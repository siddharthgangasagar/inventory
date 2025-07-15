import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// ✅ हे सगळे components standalone आहेत, म्हणून imports मध्ये टाकतो
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent
  ],
  providers: [],
  bootstrap: [] // ✅ याला bootstrap करायला विसरू नको
})
export class AppModule {}
