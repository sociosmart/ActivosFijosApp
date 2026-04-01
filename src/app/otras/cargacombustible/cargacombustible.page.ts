import { Component, OnInit } from '@angular/core';
import { ApirestService } from '../services/apirest.service';
import {
  InfiniteScrollCustomEvent,
  LoadingController,
  NavController,
  NavParams,
} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { NgZone } from '@angular/core';
import { AlertController, IonicSafeString } from '@ionic/angular';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { App } from '@capacitor/app';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-cargacombustible',
  templateUrl: './cargacombustible.page.html',
  styleUrls: ['./cargacombustible.page.scss'],
})
export class CargacombustiblePage {
  movies: any;
  uuid: any;
  balance: any;
  IdUsuario: string = '';
  sessionToken: string = '';
  toCharge: any;
  estaciones: any;
  estacionSeleccionada: any;
  info1: any;
  plataforma: any;
  modelo: any;
  estaciones1: any;
  chargeType: string = 'customer';
  currentPage = 1;
  cveestacion: any;
  imageBaseUrl = environment.baseUrl;
  CanjeManual: any;
  EstatusSorteoGas: any;
  scannerData: any;
  Numero: any;
  users: any;
  Nombre: any;
  Codigo: any;
  Mensaje: any;
  SaldoPuntosActual: any;
  NomCliente: any;
  NomClienteAp: any;
  NomClienteMa: any;
  Bomba: any;
  IngresaManual: any;
  IngresaQR: any;
  cargando: any;
  TipoCombustible: any;
  scanea: any;
  BloqueaInput:any;
  maxVal:any;
  interval:any;
  constructor(
    private navCtrl: NavController,
    public apirestService: ApirestService,
    // public scanner:BarcodeScanner,
    public storage: Storage,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private loadingCtrl: LoadingController,
    private navctrl: NavController
  ) {}

  async ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
    const tarjeta = params['Tarjeta'];
    if(tarjeta){
    console.log('Tarjeta:', tarjeta);
   // alert('Tarjeta:'+ tarjeta);
     this.getGiftCardBalance(tarjeta);
          this.Codigo =tarjeta;
          this.Nombre = 'Tarjeta de regalo';        
          this.IngresaManual = false;
    }
  });
    this.BloqueaInput=true;
    this.IngresaManual = false;
    this.scanea = false;
    this.storage.create();
    this.uuid = Device.getId().then((data) => {
      console.log(data);
      this.uuid = data.identifier;
      Device.getInfo().then((data) => {
        this.storage.set('modelo', data.model);
        this.modelo = data.model;
        this.storage.set('plataforma', data.platform);
        this.plataforma = data.platform;
      });
      this.storage.set('uuid', this.uuid);
    });
    this.IngresaQR = false;
    this.cargando = false;
    /*
    var tokenn = await this.storage.get('Token');
    this.getUsers('6681037336',tokenn);
    this.BloqueaInput=false;
    */
  }

  bombaN(BombaN: any ) {
    if (BombaN < 10) {
      this.Bomba = '0' + BombaN;
    } else {
      this.Bomba = BombaN.toString();
    }
    console.log('Elegiste ' + this.Bomba);
    const newStr = this.Bomba.slice(1);       
    var auxpos='P'+newStr;
    var posicion = document.getElementById(auxpos);
    for (var  i = 0; i <=11; i++) {
      var Parametro='P'+i;
      var posicion1 = document.getElementById(Parametro);
      if(posicion1){
        posicion1.style.borderColor = '';
        posicion1.style.borderStyle = 'solid';
        posicion1.style.opacity = '1';
     
        
      }
    }
    if(posicion){
      posicion.style.borderColor ='#1d0caf';
      posicion.style.borderStyle = 'solid';
      posicion.style.opacity = '0.5';
      posicion.style.borderRadius = '20%';
      
    }
  }
  Combustible(Tipo: any) {
    const Regular = document.getElementById('Regular');
    var Premier = document.getElementById('Premier');
    var Diesel = document.getElementById('Diesel');
    if (Regular) {
      if (Regular && Tipo == 'Regular') {
        Regular.style.borderColor = '#3880ff';
        Regular.style.borderStyle = 'solid';
        Regular.style.opacity = '0.6';
      } else {
        Regular.style.borderColor = '#797979';
        Regular.style.borderStyle = 'solid';
        Regular.style.opacity = '1';
      }
    }
    if (Premier) {
      if (Premier && Tipo == 'Premier') {
        Premier.style.borderColor = '#3880ff';
        Premier.style.borderStyle = 'solid';
        Premier.style.opacity = '0.6';
      } else {
        Premier.style.borderColor = '#797979';
        Premier.style.borderStyle = 'solid';
        Premier.style.opacity = '1';
      }
    }
    if (Diesel) {
      if (Diesel && Tipo == 'Diesel') {
        Diesel.style.borderColor = '#3880ff';
        Diesel.style.borderStyle = 'solid';
        Diesel.style.opacity = '0.6';
      } else {
        Diesel.style.borderColor = '#797979';
        Diesel.style.borderStyle = 'solid';
        Diesel.style.opacity = '1';
      }
    }
    this.TipoCombustible = Tipo;
    console.log('Elegiste' + this.TipoCombustible);
  }
  async scanTarjeta() {
    this.scanea = true;
    this.IngresaManual=false;
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      // the user granted permission
      (window.document.querySelector('ion-app') as HTMLElement).classList.add(
        'cameraView'
      );
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        // alert(result.content);
        var cuenta = result.content.toString().length; //Longitud de QR
        if (cuenta == 12) {
          //Cliente frecuente conformado a 10 digitos telefono mas 2 para dia actual y validarlo
          var diaactual = new Date().toISOString().slice(8, 10); //obtengo el dia actual de la tpv
          console.log('Dia de QR:' + diaactual);
          this.scannerData = result.hasContent; //valor de scanner
          var scannerData = this.scannerData;
          scannerData = result.content.substring(10, 12); //extraigo dia del qr
          this.BloqueaInput=false;
            //comparo dia actual de la tpv con el de qr
            this.scannerData = result.content.substring(0, 10); //extraigo el numero sociosmart a 10 digitos
            var tokenn = await this.storage.get('Token'); //Token para endpoint
            await this.getUsers(this.scannerData, tokenn); //consulto el numero sociosmart scaneado
          
        } else if (cuenta == 16) {
          this.BloqueaInput=true;
          this.Codigo = result.content;       
          //Tarjeta de regalo
          // alert('código extraer tarjeta de regalo');
          var auxguion=this.Codigo.substr(0,4)+'-'+this.Codigo.substr(4,4)+'-'+this.Codigo.substr(8,4)+'-'+this.Codigo.substr(12,4)
          this.getGiftCardBalance(auxguion);
          this.Codigo =auxguion;
          this.Nombre = 'Tarjeta de regalo';        
          this.IngresaManual = false;
        } else {
          alert('Ingresa un QR válido');
        }
        BarcodeScanner.showBackground();
        this.scanea = false;
        BarcodeScanner.stopScan();
      }
    } else {
      this.scanea = false;
      const c = confirm(
        'Debes permitir permisos en camara, serás redireccionado a los ajustes.'
      );
      if (c) {
        this.scanea = false;
        BarcodeScanner.openAppSettings();
      }
    }
    this.scanea = false;
  }

  Manual() {
    //Abre y cierra input de captura manual
    if (this.IngresaManual == false) {
      this.IngresaManual = true;
      this.IngresaQR = false;
    } else {
      this.IngresaManual = false;
    }
  }

  async getGiftCardBalance(cardKey: string) {
    let pv = await this.storage.get('PV');
    this.cargando = true;
    this.chargeType = 'card_key';
    this.apirestService
      .GetGiftCardBalance(cardKey, pv)
      .pipe(
        catchError((err) => {
          if (err.status == 404) {
            this.IngresaQR = false;
            alert('Tarjeta de regalo no encontrada, expirada o ya usada.');
          } else if (err.status == 409) {
            this.IngresaQR = false;
            alert('Esta tarjeta de regalo no puede ser usada en esta estacion');
          } else if (err.status == 500) {
            this.IngresaQR=false;
            alert(
              'Problemas para consultar información, reintente mas tarde'
            );
          }
          this.Codigo='';
          this.Codigo='';
          this.cargando = false;
          throw err;
        })
      )
      .subscribe((data) => {
        this.cargando = false;
        this.IngresaQR = true;
        this.IngresaManual = false;
        this.balance = data.amount.toFixed(2);
        this.toCharge = data.amount;
      });
  }
  async getBalance() {
    let stacion = await this.storage.get('PV');
    this.cargando = true;
    this.apirestService
      .GetBalance(this.sessionToken, stacion)
      .pipe(
        catchError((err) => {
          alert('Error con el sistema de puntos, favor de intentar mas tarde');
          this.cargando = false;
          throw err;
        })
      )
      .subscribe((data) => {
        this.balance = data.total.toFixed(2);
        this.cargando = false;
      });
  }
  async Validamanual() {
    //valida el codigo manual
    var cuenta = this.Codigo.toString().length; //Longitud de codigo capturado
    console.log(cuenta);
    if (cuenta == 10) {
      this.IngresaQR = false;
     // this.BloqueaInput=true;
      //valida si es de 10 digitos para cliente frecuente
      console.log('Cliente frecuente');
      alert('La captura de números sociosmart solo está disponible solo con lector de Qr');
    /*  var tokenn = await this.storage.get('Token'); //token sociosmart
      await this.getUsers(this.Codigo, tokenn); //consulto cliente frecuente
      this.IngresaManual = false; //cierro modal de captura de numkero
      */
    } else if (cuenta == 16) {
      this.BloqueaInput=true;
      console.log(this.Codigo);
      this.Codigo.toString();
      console.log(this.Codigo.toString().substr(0,4));
      console.log(this.Codigo.toString().substr(4,4));
      console.log(this.Codigo.toString().substr(8,4));
      console.log(this.Codigo.toString().substr(12,4));
      var auxguion=this.Codigo.toString().substr(0,4)+'-'+this.Codigo.toString().substr(4,4)+'-'+this.Codigo.toString().substr(8,4)+'-'+this.Codigo.toString().substr(12,4)
      this.getGiftCardBalance(auxguion);
      this.Codigo =auxguion;
      this.Nombre = 'Tarjeta de regalo';
      this.IngresaQR = true;
      this.IngresaManual = false;
    } else {
      alert(
        'Ingresa un número sociosmart a 10 digitos o una tarjeta de regalo a 16 dígitos sin espacios)'
      );
    }
  }

  change(){
    //manually launch change detection
 console.log(this.Codigo.toString().length);
 if(this.Codigo.toString().length==16){
   this.Validamanual();
 }
   
  }
  async getUsers($id: any, $token: any) {
    //consulta informacion de cliente frecuente y trae datos
    this.chargeType = 'customer';
    this.cargando = true;
    this.storage.get('userkey').then((userkey) => {
      this.storage.get('contrakey').then((contrakey) => {
        this.storage.get('PV').then((pv) => {
          this.apirestService
            .getUsers($id, userkey, contrakey, pv, $token)
            .subscribe(async (data: any) => {
              console.log('data', data);
              console.log('Lo que viene en data de getUsers: ', data);
              this.users = this.generateArray(data);
              console.log(this.users);
              console.log('el cve es:' + this.users[0].Cve_Usuario);
              this.IdUsuario = this.users[0].Cve_Usuario;
              this.Nombre = '';
              this.Mensaje = '';
              this.SaldoPuntosActual = '';
              this.Mensaje = this.users[0].Mensaje;
              this.sessionToken = this.users[0].TokenSesion;
              console.log('sesion', this.sessionToken);
              this.Nombre =
                this.users[0].Nombre +
                ' ' +
                this.users[0].Ap_Paterno +
                ' ' +
                this.users[0].Ap_Materno;
              this.NomCliente = this.users[0]['Nombre'];
              this.NomClienteAp = this.users[0]['Ap_Paterno'];
              this.NomClienteMa = this.users[0]['Ap_Materno'];
              this.SaldoPuntosActual = '800';
              // Get
              await this.getBalance();
              this.IngresaQR = true;
              this.cargando = false;
              if (this.Nombre == 'null null null') {
                alert(
                  'El cliente no ha completado su perfil, solo podrá acumular hasta completarlo'
                );
                this.NomCliente = 'Cliente';
                this.NomClienteAp = 'sin completar';
                this.NomClienteMa = 'perfil';
                this.Nombre = 'Cliente sin completar perfil';
              }
              if (this.users[0].Estatus == '5') {
                alert('Tu cuenta de acceso es invalida');
                this.storage.clear();
                this.navCtrl.navigateRoot('/login');
              } else {
                console.log('ee' + this.users[0].Estatus);
              }
              if (this.users[0].Estatus == '4') {
                console.log('Código invalido');
              }
            });
        });
      });
    });
  }

  isEstatustrue(value: any) {
    return value.Estatus == 1;
  }

  generateArray(obj: any) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }
  async CargarCombustible() {
    if(this.balance>=this.toCharge && this.balance>0 && this.toCharge>=10){
      
   // console.log('ee');
   
    let alert2 = this.alertCtrl.create({
      header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado      
 message:
        'Válidación de operador.<br><br>Autorizarás<br><b>Cantidad:$</b>' +
        this.toCharge +
        '<br><b>Combustible: </b>' +
        this.TipoCombustible +
        '<br><b>Bomba: </b>' +
        this.Bomba +
        '<br>',
      inputs: [
        {
          name: 'EMPLEADO3',
          placeholder: '# EMPLEADO',
          type: 'number',
        },
        {
          name: 'NIP3',
          placeholder: 'NIP',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: (data) => {
            // console.log('Cancel clicked');
          },
        },
        {
          text: 'CONFIRMAR',
          handler: async (data) => {
            this.cargando = true;
            if (data.EMPLEADO3 != '' && data.NIP3 != '') {
              //   this.storage.get('puntoventa').then(($Cre) => {
              //     this.storage.get('IdEstacion').then(($IdEstacion) => {
              //       this.apirestService
              //         .ValidaEmpleadoNipconEstacion(
              //           data.EMPLEADO3,
              //           data.NIP3,
              //           $Cre,
              //           $IdEstacion
              //         )
              //         .then(async (data) => {
              //           this.cargando = false;
              //           let dataArray = this.generateArray(data);
              //           // console.log(dataArray);
              //           if (dataArray[0]['Estatus'] == '1') {
              //             this.cargando = false;
              //             console.log(dataArray[0]);
              //             alert('Validacion correcta');
              //             this.navctrl.navigateRoot('/detalle-carga');
              //           } else {
              //             this.cargando = false;
              //             alert(
              //               'Datos ingresados incorrectos o no tienen permisos en esta estación'
              //             );
              //           }
              //         });
              //     });
              //   });
              let fuelType = this.TipoCombustible.toLowerCase();
              if (fuelType == 'premier') {
                fuelType = 'premium';
              }
              let body: any = {
                amount: Number(this.toCharge),
                fuel_type: fuelType,
                pump_number: this.Bomba,
                charge_type: this.chargeType,
              };

              if (this.chargeType == 'customer') {
                body['external_customer_id'] = this.IdUsuario;
              } else {
                body['card_key'] = this.Codigo;
              }
              let pv = await this.storage.get('PV');
              this.apirestService
                .MakePayment(pv, data.EMPLEADO3, data.NIP3, body)
                .pipe(
                  catchError((err) => {
                    console.log('error', err);
                    if (err.status == 500) {
                      alert(
                        'Error al intentar la bomba, por favor contacta a un supervisor para escalar este problema.'
                      );
                    } else if (err.status == 401) {
                      alert('Usted no tiene permisos para prefijar esta bomba');
                    } else if (err.status == 402) {
                      alert('Saldo insuficiente');
                    } else if (err.status == 404) {
                      
                      alert('Bomba no encontrada');
                      alert('Bomba Capturada: '+this.Bomba);
                    } else if (err.status == 406) {
                      alert(
                        'No se puede prefijar este tipo de combustible en esta bomba'
                      );
                    } else if (err.status == 409) {
                      alert('Esta tarjeta de regalo esta siendo usada.');
                    } else {
                      alert('Error en el servidor o internet intermitente.');
                    }
                    this.cargando = false;
                    throw err;
                  })
                )
                .subscribe((data) => {
               
                  this.interval =    setInterval(() => {
                    console.log('data de prefijacion', data);
                    console.log(data.id);     
                    localStorage.setItem('iddebito',String(data.id));
                    this.cargando = false;
                    localStorage.setItem('DebitoBomba', this.Bomba);
                    localStorage.setItem('DebitoTipoCombustible', this.TipoCombustible);
                    localStorage.setItem('DebitoMonto', this.toCharge);
                  clearInterval(this.interval);      
                  this.navCtrl.navigateRoot('/detalle-carga');
                }, 5000);
                });
            } else {
              console.log('Completa datos');
              this.cargando = false;
              alert('Ingresa un # de empleado y nip de sociosmart válido');
            }
          },
        },
      ],
    });
    (await alert2).present();
  }else{
    alert('Cantidas solicitada insuficiente o es menor a $5.00');
  
  
  }
  }

  ionViewDidLeave() {
    this.scanea = false;
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove(
      'cameraView'
    );

    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }
}
