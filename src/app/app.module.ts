import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { SignupComponent } from './signup/signup.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { LoginComponent } from './login/login.component';
import { ContentsComponent } from './contents/contents.component';
import { AddComponent } from './add/add.component';
import { list } from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire/compat';



import { environment } from'../environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { SpinnerComponent } from './shared/spinner.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AContentComponent } from './contents/a-content/a-content.component';
import { ContentDetailsComponent } from './contents/content-details/content-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ContentsComponent,
    AddComponent,
    SpinnerComponent,
    ProfileComponent,
    AContentComponent,
    ContentDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    HttpClientModule,
    MatCardModule,
    MatGridListModule,
AngularFireModule.initializeApp(environment.firebase),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage())
  ],
  providers: [{
    provide: MatDialogRef,
    useValue: {}
  },
  { provide: HTTP_INTERCEPTORS, useClass:AuthInterceptorService , multi:true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
