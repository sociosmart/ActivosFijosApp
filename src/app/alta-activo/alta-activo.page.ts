import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-alta-activo',
  templateUrl: './alta-activo.page.html',
  styleUrls: ['./alta-activo.page.scss'],
})
export class AltaActivoPage {

  activoId = '';
  nombreActivo = '';
  ubicacion = '';
  compania = '';
  selectedFile: File | null = null;

  // Token generado tras login
  private accessToken: string = '';

  constructor(
    private platform: Platform,
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions,
    private toastController: ToastController,
    private http: HttpClient,
  ) {}

  // ===================== LOGIN =====================
  async loginApi() {
    
    const url = 'http://172.16.64.136:80/api_activos_v2/public/?auth&action=login';
    const body = {
      email: 'admin@test.com',
      password: '123456'
    };

    try {
      const response: any = await this.http.post(url, body).toPromise();
      this.accessToken = response.access || '';
      console.log('Token obtenido:', this.accessToken);
      return true;
    } catch (err) {
      const toast = await this.toastController.create({
        message: 'Error al iniciar sesión en la API ❌',
        duration: 5000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
      console.error('Error login API:', err);
      return false;
    }
  }

  // ===================== GUARDAR Y OBTENER ID =====================
 async guardarActivoYImprimir() {

  // ===== Validación =====
  if (!this.nombreActivo) {
    const toast = await this.toastController.create({
      message: 'Nombre es obligatorio',
      duration: 3000,
      color: 'warning',
      position: 'bottom'
    });
    toast.present();
    return;
  }

  // ===== Login si no hay token =====
  if (!this.accessToken) {
    const loggedIn = await this.loginApi();
    if (!loggedIn) return;
  }

  // ===== URL correcta =====
  const url = 'http://172.16.64.136:80/api_activos_v2/public/';

  const formData = new FormData();

  // ===== Campos =====
  formData.append('nombre', this.nombreActivo);
  formData.append('ubicacion', this.ubicacion || '');
  formData.append('compania', this.compania || '');

  // ✅ Fecha correcta (YYYY-MM-DD)
  const fecha = new Date().toISOString().split('T')[0];
  formData.append('fecha', fecha);
/*
  // ✅ Método override requerido por tu API
  formData.append('_method', 'PUT');
  formData.append('id', '0');
*/
  // ===== Imagen =====
  if (this.selectedFile) {
    formData.append('fotografia', this.selectedFile, this.selectedFile.name);
  }

  // ===== Headers con token =====
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.accessToken}`
  });

  try {
    const response: any = await this.http.post(url, formData, { headers }).toPromise();

    console.log('Respuesta API:', response);

    // ✅ Ajusta según cómo regrese tu API
    this.activoId = response?.id || response?.data?.id || '';

    if (!this.activoId) {
      throw new Error('No se recibió ID del activo');
    }

    const toast = await this.toastController.create({
      message: 'Activo guardado correctamente ✅',
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();

    // ===== Imprimir con ID REAL =====
    await this.imprimirTicket();

  } catch (err) {

    console.error('Error API:', err);

    const toast = await this.toastController.create({
      message: 'Error al guardar activo ❌',
      duration: 5000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();
  }
}

  // ===================== IMPRIMIR TICKET =====================
  private async imprimirTicket() {
    if (!this.platform.is('cordova')) {
      const toast = await this.toastController.create({message:'Solo funciona en dispositivo real', duration:3000,color:'warning',position:'bottom'});
      toast.present();
      return;
    }

    const permisos = await this.pedirPermisos();
    if (!permisos) return;

    try {
      const devices: any[] = await this.bluetoothSerial.list();
      const impresora = devices.find(d => d.name && d.name.includes('Printer'));
      if (!impresora) { 
        const toast = await this.toastController.create({message:'No se encontró impresora', duration:3000,color:'warning',position:'bottom'}); 
        toast.present();
        return; 
      }
const d = new Date();
const fecha = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
      this.bluetoothSerial.connect(impresora.id).subscribe({
        next: async () => {
          const ESC = 0x1B;
          const GS = 0x1D;
          const cmds: number[] = [];
          const encoder = new TextEncoder();

          cmds.push(ESC, 0x40);
          cmds.push(ESC, 0x61, 0x01); 
          cmds.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, 0x08);
          cmds.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x30);
          const dataBytes = encoder.encode(this.activoId);
          const len = dataBytes.length + 3;
          const pL = len & 0xFF;
          const pH = (len >> 8) & 0xFF;
          cmds.push(GS, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30, ...dataBytes);
          cmds.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30);

          cmds.push(ESC, 0x61, 0x00);
          cmds.push(0x0A);
  cmds.push(ESC, 0x40); // init
cmds.push(...this.textoABytes(`ID: ${this.activoId}\n`));
cmds.push(...this.textoABytes(`Nombre: ${this.nombreActivo}\n`));
cmds.push(...this.textoABytes(`Ubicación: ${this.ubicacion}\n`));
cmds.push(...this.textoABytes(`Compañía: ${this.compania}\n`));
cmds.push(...this.textoABytes(`Fecha: ${fecha}\n`));
          cmds.push(0x0A,0x0A,0x0A,0x0A,0x0A,0x0A);
          cmds.push(GS, 0x56, 0x00);

          const buffer = new Uint8Array(cmds).buffer;
          await this.bluetoothSerial.write(buffer as any);
          this.bluetoothSerial.disconnect();

          const toast = await this.toastController.create({
            message: 'Ticket impreso ✅',
            duration: 5000,
            color: 'success',
            position: 'bottom'
          });
          toast.present();
        },
        error: async err => {
          console.error('Error conectando a impresora', err);
          const toast = await this.toastController.create({
            message: 'Error conectando a impresora ❌',
            duration: 5000,
            color: 'danger',
            position: 'bottom'
          });
          toast.present();
        }
      });

    } catch (err) {
      console.error('Error listando dispositivos BT:', err);
      const toast = await this.toastController.create({
        message: 'Error listando dispositivos BT ❌',
        duration: 5000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
    }
  }

  private async pedirPermisos(): Promise<boolean> {
    try {
      await this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
        this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      ]);
      const hasConnect = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT);
      return hasConnect.hasPermission;
    } catch (err) {
      console.error('Error solicitando permisos', err);
      return false;
    }
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
      .replace(/á/g,'a').replace(/Á/g,'A')
      .replace(/é/g,'e').replace(/É/g,'E')
      .replace(/í/g,'i').replace(/Í/g,'I')
      .replace(/ó/g,'o').replace(/Ó/g,'O')
      .replace(/ú/g,'u').replace(/Ú/g,'U');
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
  private textoABytes(texto: string): number[] {
  const mapa: any = {
    'á': 160, 'é': 130, 'í': 161, 'ó': 162, 'ú': 163,
    'Á': 181, 'É': 144, 'Í': 214, 'Ó': 224, 'Ú': 233,
    'ñ': 164, 'Ñ': 165,
    'ü': 129, 'Ü': 154
  };

  const bytes: number[] = [];

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i];
    if (mapa[char]) {
      bytes.push(mapa[char]);
    } else {
      bytes.push(texto.charCodeAt(i));
    }
  }

  return bytes;
}
}