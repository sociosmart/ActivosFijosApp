import { Component } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { ToastController,LoadingController  } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private toast: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    
      this.router.navigate(['/alta-activo']);
  }
    


async login() {

  if (!this.email || !this.password) {
    this.showToast('Completa los campos');
    return;
  }

  const loading = await this.loadingCtrl.create({
    message: 'Iniciando sesión...',
    spinner: 'crescent'
  });

  await loading.present();

  this.auth.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: async (res) => {

      await loading.dismiss(); // 👈 IMPORTANTE cerrar loader

      console.log(res);

      await this.auth.setToken(res.token);

      this.showToast('Login correcto');

      const token = await this.auth.getToken();
      console.log('TOKEN GUARDADO:', token);

      this.router.navigateByUrl('/alta-activo', { replaceUrl: true });
    },
    error: async (err) => {

      await loading.dismiss(); // 👈 cerrar loader también en error

      console.log(err);

      if (!navigator.onLine) {
        this.showToast('Sin conexión a internet');
      } else {
        this.showToast('Credenciales incorrectas o error del servidor');
      }
    }
  });
}

  async showToast(msg: string) {
    const t = await this.toast.create({
      message: msg,
      duration: 2000
    });
    t.present();
  }
}