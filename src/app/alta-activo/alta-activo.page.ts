import { Component } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.services';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ConfiguracionModalComponent } from '../modals/configuracion-modal/configuracion-modal.component';

@Component({
  selector: 'app-alta-activo',
  templateUrl: './alta-activo.page.html',
  styleUrls: ['./alta-activo.page.scss'],
})
export class AltaActivoPage {

  // ================= CONFIG =================
  config = {
    imprimirTicket: true,
    nomenclaturaAutomatica: false
  };
  private CONFIG_KEY = 'app_config_activos';

  // ================= CACHE =================
  private CACHE_KEYS = {
    categorias: 'cache_categorias',
    companias: 'cache_companias',
    analiticas: 'cache_analiticas'
  };

  isLoading = true;

  // ================= DATA =================
  nombreActivo = '';
  ubicacion = '';
  referencia = '';
  descripcion = '';
  value = 0;

  categorias: any[] = [];
  categoriaId: number | null = null;

  companias: any[] = [];
  companiaId: number | null = null;

  analiticas: any[] = [];
  analiticaId: number | null = null;

  selectedFile: File | null = null;
  previewImage: string | null = null;

  ultimoTicket: any = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.cargarConfiguracionLocal();
    this.initCatalogos();
  }

  // ================= INIT CACHE + API =================
  async initCatalogos() {

    const cat = this.getCache(this.CACHE_KEYS.categorias);
    const com = this.getCache(this.CACHE_KEYS.companias);
    const ana = this.getCache(this.CACHE_KEYS.analiticas);

    if (cat) this.categorias = cat;
    if (com) this.companias = com;
    if (ana) this.analiticas = ana;

    // si hay cache → quita loading
    if (cat && com && ana) {
      this.isLoading = false;
    }

    // refresh en background
    this.refreshCategorias();
    this.refreshCompanias();
    this.refreshAnaliticas();
  }

  private getCache(key: string): any[] | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setCache(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ================= REFRESH =================
  async refreshCategorias() {
    const token = await this.auth.getToken();

    this.http.get<any>(
      'http://172.16.64.120:8080/api_activos_v2/public/holos/categorias',
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(resp => {
      if (resp.status === 'success') {
        if (JSON.stringify(this.categorias) !== JSON.stringify(resp.data)) {
          this.categorias = resp.data;
          this.setCache(this.CACHE_KEYS.categorias, resp.data);
        }
      }
      this.isLoading = false;
    });
  }

  async refreshCompanias() {
    const token = await this.auth.getToken();

    this.http.get<any>(
      'http://172.16.64.120:8080/api_activos_v2/public/holos/companias',
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(resp => {
      if (resp.status === 'success') {
        if (JSON.stringify(this.companias) !== JSON.stringify(resp.data)) {
          this.companias = resp.data;
          this.setCache(this.CACHE_KEYS.companias, resp.data);
        }
      }
    });
  }

  async refreshAnaliticas() {
    const token = await this.auth.getToken();

    this.http.get<any>(
      'http://172.16.64.120:8080/api_activos_v2/public/holos/analitica',
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(resp => {
      if (resp.status === 'success') {
        if (JSON.stringify(this.analiticas) !== JSON.stringify(resp.data)) {
          this.analiticas = resp.data;
          this.setCache(this.CACHE_KEYS.analiticas, resp.data);
        }
      }
    });
  }

  // ================= CONFIG =================
  cargarConfiguracionLocal() {
    const data = localStorage.getItem(this.CONFIG_KEY);
    if (data) this.config = JSON.parse(data);
  }

  async abrirConfiguracion() {
    const modal = await this.modalCtrl.create({
      component: ConfiguracionModalComponent,
      componentProps: { config: { ...this.config } }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.config = data;
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(data));
    }
  }

  // ================= SCANNER =================
  async abrirScanner() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (!status.granted) return;

    BarcodeScanner.hideBackground();
    document.body.classList.add('scanner-active');

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      this.referencia = result.content;
      await Haptics.impact({ style: ImpactStyle.Medium });
    }

    this.cerrarScanner();
  }

  cerrarScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.body.classList.remove('scanner-active');
  }

  // ================= FOTO =================
  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    if (!image?.dataUrl) return;

    this.previewImage = image.dataUrl;
    this.selectedFile = this.base64ToFile(image.dataUrl, 'foto.jpg');
  }

  // ================= GUARDAR =================
  async guardarActivoYImprimir() {
    if (!this.nombreActivo) {
      return this.showToast('Nombre requerido', 'warning');
    }

    if (!this.selectedFile) {
      return this.showToast('Debe tomar foto', 'warning');
    }

    const gps = await Geolocation.getCurrentPosition();

    const formData = new FormData();
    formData.append('nombre', this.nombreActivo);
    formData.append('ubicacion', this.ubicacion);
    formData.append('referencia', this.referencia);
    formData.append('value', String(this.value));
    formData.append('fotografia', this.selectedFile);

    formData.append('latitud', String(gps.coords.latitude));
    formData.append('longitud', String(gps.coords.longitude));

    this.http.post('http://172.16.64.120:8080/api_activos_v2/public/activos', formData)
      .subscribe(async (resp: any) => {

        const dataPrint = {
          id: resp.id,
          nombre: this.nombreActivo,
          ubicacion: this.ubicacion,
          fecha: new Date().toLocaleDateString()
        };

        this.ultimoTicket = dataPrint;

        this.showToast('Guardado', 'success');

        this.limpiar();
      });
  }

  // ================= REIMPRESIÓN =================
  async reimprimirTicket() {
    if (!this.ultimoTicket) {
      return this.showToast('No hay ticket', 'warning');
    }
  }

  // ================= UTIL =================
  limpiar() {
    this.nombreActivo = '';
    this.ubicacion = '';
    this.referencia = '';
    this.previewImage = null;
    this.selectedFile = null;
  }

  base64ToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color
    });
    toast.present();
  }
}