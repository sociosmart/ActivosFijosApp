import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Storage } from '@ionic/storage-angular';
// import { ApirestService } from '../app/services/apirest.service';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private zone: NgZone,
    private storage: Storage,
   
    // ,private apirestService: ApirestService
  ) {
    this.initializeApp();
  }

  initializeApp() {
  }
}
