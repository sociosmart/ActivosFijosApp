import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.services';
import { CanActivate, Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage  {

  constructor(private platform: Platform,
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions,
    private toastController: ToastController,
    private http: HttpClient,
    private auth: AuthService,private router:Router) { }

 
    async logout() {
  try {
    await this.auth.logout();

    this.showToast('Sesión cerrada 👋', 'success');

 
    this.router.navigate(['/login']); // o la ruta inicial
  } catch (e) {
    console.error(e);
    this.showToast('Error al cerrar sesión ❌', 'danger');
  }
}
// ================= TOAST =================
  private async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      color
    });
    toast.present();
  }
}
