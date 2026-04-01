import { Component } from '@angular/core';
import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-alta-activo',
  templateUrl: './alta-activo.page.html',
  styleUrls: ['./alta-activo.page.scss'],
})
export class AltaActivoPage {

  // ================= VARIABLES =================
  activoId = '';
  nombreActivo = '';
  ubicacion = '';
  compania = '';
  selectedFile: File | null = null;

  // Token JWT obtenido del login
  private accessToken: string = '';

  constructor(
    private platform: Platform,
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions,
    private toastController: ToastController,
    private http: HttpClient,
    private loadingController: LoadingController,
  ) {}

  // ================= LOGIN API =================
  async loginApi() {

    const url = 'http://172.16.64.136:80/api_activos_v2/public/?auth&action=login';

    try {
      const response: any = await this.http.post(url, {
        email: 'admin@test.com',
        password: '123456'
      }).toPromise();

      // 🔥 Guardamos token correctamente
      this.accessToken = response?.access || '';

      console.log('Token:', this.accessToken);

      return !!this.accessToken;

    } catch (err) {
      console.error('Error login:', err);
      this.showToast('Error login API ❌', 'danger');
      return false;
    }
  }

  // ================= GUARDAR ACTIVO =================
  async guardarActivoYImprimir() {

    // 🔴 Validación básica
    if (!this.nombreActivo) {
      this.showToast('Nombre es obligatorio', 'warning');
      return;
    }

    // 🔐 Login si no hay token
    if (!this.accessToken) {
      const ok = await this.loginApi();
      if (!ok) return;
    }

    const url = 'http://172.16.64.136:80/api_activos_v2/public/';
    const formData = new FormData();

    // 📌 Campos principales
    formData.append('nombre', this.nombreActivo);
    formData.append('ubicacion', this.ubicacion || '');
    formData.append('compania', this.compania || '');

    // 📅 Fecha en formato correcto
    const fecha = new Date().toISOString().split('T')[0];
    formData.append('fecha', fecha);

    // 🖼️ Imagen
    if (this.selectedFile) {
      formData.append('fotografia', this.selectedFile, this.selectedFile.name);
    }

    // ================= GPS =================
    const gps = await this.obtenerUbicacion();

    // 🔥 EVITA NULL POINTER EN ANDROID
    formData.append('latitud', gps?.lat ? gps.lat.toString() : '');
    formData.append('longitud', gps?.lng ? gps.lng.toString() : '');

    // ================= HEADERS =================
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });

    try {
      const response: any = await this.http.post(url, formData, { headers }).toPromise();

      console.log('Respuesta API:', response);

      // 🔥 Tu API no regresa ID → generamos fallback
      this.activoId = response?.id || response?.data?.id || 'TEMP-' + Date.now();

      this.showToast('Activo guardado ✅', 'success');

      // 🖨️ Imprimir ticket
      await this.imprimirTicket();

    } catch (err) {
      console.error('Error API:', err);
      this.showToast('Error al guardar ❌', 'danger');
    }
  }

  // ================= IMPRIMIR =================
  private async imprimirTicket() {

    // 🔴 Solo dispositivo real
    if (!this.platform.is('cordova')) {
      this.showToast('Solo en dispositivo real', 'warning');
      return;
    }

    // 🔐 Permisos Android
    const permisos = await this.pedirPermisos();
    if (!permisos) return;

    try {
      const devices: any[] = await this.bluetoothSerial.list();
      console.log('Dispositivos BT:', devices);

      // 🔥 Selección segura (evita null)
      const impresora = devices.find(d =>
        d && typeof d.id === 'string' && d.id.length > 0
      );

      if (!impresora) {
        this.showToast('No hay impresora válida ❌', 'danger');
        return;
      }

      // 🔥 Evita null en QR
      const idSeguro = this.activoId ? this.activoId.toString() : '0';

      this.bluetoothSerial.connect(impresora.id).subscribe({

        next: async () => {

          const ESC = 0x1B;
          const GS = 0x1D;
          const cmds: number[] = [];
          const encoder = new TextEncoder();

          const dataBytes = encoder.encode(idSeguro);
          const len = dataBytes.length + 3;

          // 🔹 Inicializar impresora
          cmds.push(ESC, 0x40);

          // 🔹 Centrar QR
          cmds.push(ESC, 0x61, 0x01);

          // 🔹 Config QR
          cmds.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, 0x08);
          cmds.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30);

          // 🔹 Datos QR
          cmds.push(
            GS, 0x28, 0x6B,
            len & 0xFF,
            (len >> 8) & 0xFF,
            0x31, 0x50, 0x30,
            ...dataBytes
          );

          // 🔹 Imprimir QR
          cmds.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30);

          // 🔹 Texto
          cmds.push(ESC, 0x61, 0x00);
          cmds.push(0x0A);

          const d = new Date();
          const fecha = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

          cmds.push(...this.textoABytes(`ID: ${idSeguro}\n`));
          cmds.push(...this.textoABytes(`Nombre: ${this.nombreActivo || ''}\n`));
          cmds.push(...this.textoABytes(`Ubicación: ${this.ubicacion || ''}\n`));
          cmds.push(...this.textoABytes(`Compañía: ${this.compania || ''}\n`));
          cmds.push(...this.textoABytes(`Fecha: ${fecha}\n`));

          // 🔹 Espacio + corte
          cmds.push(ESC, 0x64, 0x05); // Avanza 5 líneas
          await new Promise(res => setTimeout(res, 100));
          cmds.push(GS, 0x56, 0x00);  // Corte

          // 🔹 Enviar a impresora
          await this.bluetoothSerial.write(new Uint8Array(cmds).buffer);
          this.bluetoothSerial.disconnect();

          this.showToast('Ticket impreso ✅', 'success');
        },

        error: err => {
          console.error(err);
          this.showToast('Error conectando impresora ❌', 'danger');
        }
      });

    } catch (err) {
      console.error(err);
      this.showToast('Error Bluetooth ❌', 'danger');
    }
  }

  // ================= PERMISOS =================
  private async pedirPermisos(): Promise<boolean> {
    try {
      await this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
        this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      ]);

      const res = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT
      );

      return res.hasPermission;

    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // ================= GPS =================
  async obtenerUbicacion() {

    const loading = await this.loadingController.create({
      message: '📍 Obteniendo ubicación...'
    });

    await loading.present();

    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      await loading.dismiss();

      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

    } catch (err) {
      await loading.dismiss();
      console.error('GPS error:', err);

      this.showToast('No se pudo obtener ubicación ⚠️', 'warning');

      return null;
    }
  }

  // ================= TEXTO (acentos impresora) =================
  private textoABytes(texto: string): number[] {
    const mapa: any = {
      'á':160,'é':130,'í':161,'ó':162,'ú':163,
      'ñ':164,'Ñ':165
    };

    return Array.from(texto).map(c => mapa[c] || c.charCodeAt(0));
  }

  // ================= TOAST =================
  private async showToast(msg: string, color: string) {
    const t = await this.toastController.create({
      message: msg,
      duration: 3000,
      color
    });
    t.present();
  }

  // ================= FILE =================
  onFileChange(event: any) {
    if (event.target.files?.length) {
      this.selectedFile = event.target.files[0];
    }
  }
}