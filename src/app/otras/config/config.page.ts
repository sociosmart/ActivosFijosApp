import { Component, OnInit } from '@angular/core';
import { ApirestService } from '../services/apirest.service';
import { InfiniteScrollCustomEvent, LoadingController, NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  movies: any;
  uuid: any;
  estaciones: any;
  estacionSeleccionada: any;
  info1: any;
  plataforma: any;
  modelo: any;
  estaciones1: any;
  currentPage = 1;
  cveestacion: any;
  imageBaseUrl = environment.baseUrl;
  CanjeManual: any;
  EstatusSorteoGas: any;
  constructor(private storage: Storage, private apirestService: ApirestService, private loadingCtrl: LoadingController, private navctrl: NavController) {

  }

  async ngOnInit() {
    this.storage.create();
    this.loadMovies();
    this.uuid = Device.getId().then(data => {
      console.log(data);      
      this.uuid = data.identifier;
     // this.uuid = "7ab68dcd72131c99";
      console.log(data.identifier);      
      Device.getInfo().then(data => {
        this.storage.set('modelo', (data.model));
        this.modelo = data.model;
   //this.modelo = "P2-A11";
        this.storage.set('plataforma', (data.platform));
        this.plataforma = data.platform;
  // this.plataforma = "ANDROID";
      });
      this.storage.set('uuid', this.uuid);
    })
    this.apirestService.GetEstaciones().subscribe(
      (res) => {
        console.log("Array de estaciones: ", this.generateArray(res));
        this.estaciones = this.generateArray(res);

      });
  }

  isEstatustrue(value: any) {
    return value.Estatus == 1;
  }

  generateArray(obj: any) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }
  async loadMovies(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.apirestService.getTopRatedMovies(this.currentPage).subscribe(
      (res) => {
        loading.dismiss();
        console.log(this.generateArray(res));
        this.movies = this.generateArray(res);
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  guardarEstacion() {
    this.cveestacion = this.estaciones[this.estacionSeleccionada].Cve_PuntoDeVenta;
    console.log(this.estaciones[this.estacionSeleccionada]);
    console.log("estacion seleccionada: ", this.estaciones[this.estacionSeleccionada].Cve_PuntoDeVenta);
    console.log("estacion seleccionada: ", this.estaciones[this.estacionSeleccionada].NombreComercial);
    //esto no jala, me da error
    this.storage.set('IdEstacion', this.estaciones[this.estacionSeleccionada].Cve_PuntoDeVenta);
    this.storage.set('estacion', this.estaciones[this.estacionSeleccionada].NombreComercial);
    /*
    this.storage.get('estacion').then((estacion) => {
      this.storage.get('IdEstacion').then((IdEstacion) => {
      console.log('Estacion guardada:'+IdEstacion);
      console.log('Estacion Nombre guardada:'+estacion);
    });  });

    */

  }




  ConfigPage() {
    if (this.uuid && this.modelo && this.plataforma && this.cveestacion) {
      this.apirestService.obtenerconfiguuid1(this.uuid, this.modelo, this.plataforma, this.cveestacion).subscribe(
        (res) => {

          console.log(this.generateArray(res));
          this.estaciones1 = this.generateArray(res);
          console.log(this.estaciones1);
if(this.estaciones1[0].FK_Cve_Grupo){
          this.storage.set('puntoventa', this.estaciones1[0].Fk_Cve_PuntoDeVenta);
          this.storage.set('userkey', this.estaciones1[0].Usuario);
          this.storage.set('contrakey', this.estaciones1[0].KeyApi);
          this.storage.set('UUID', this.uuid);
          this.storage.set('PV', this.estaciones1[0].pv);
          this.storage.set('GRUPO', this.estaciones1[0].FK_Cve_Grupo);
          this.storage.set('configurado', "true");
          this.storage.set('Token', this.estaciones1[0].Token);
           localStorage.setItem('Token',this.estaciones1[0].Token);
           
          this.storage.set('base', this.estaciones1[0].Bd);
          this.storage.set('NToken', 0);
          this.storage.set('IpImpresora', this.estaciones1[0].IpImpresora);
          this.storage.set('NombreImpresora', this.estaciones1[0].NombreImpresora);
          this.storage.set('Ciudad', this.estaciones1[0].Ciudad);
          this.storage.set('cve_Ciudad', this.estaciones1[0].fk_cve_Ciudad);
          console.log('pves:' + this.estaciones1[0].fk_cve_Ciudad);
          this.storage.set('Puerto', this.estaciones1[0].Puerto);
          this.storage.set('TipoImpresora', this.estaciones1[0].TipoConexion);
          this.storage.set('host', this.estaciones1[0].Enlace);
          this.storage.set('tipocliente', 1);
          this.storage.set('Fechainicio', new Date());
          this.storage.set('CanjeManual', this.estaciones1[0].CanjeManual);
          this.storage.set('EstatusSorteoGas', this.estaciones1[0].EstatusSorteoGas);
          this.storage.set('HostEstacion', this.estaciones1[0].Host);

          alert('Configuración encontrada');
          this.navctrl.navigateRoot('/login');
}else{
  alert('Los datos de esta tpv no estan registrados');
}
        });

      //consumir config1
    } else {
      alert('Debe seleccionar una estación');

    }
  }

}
