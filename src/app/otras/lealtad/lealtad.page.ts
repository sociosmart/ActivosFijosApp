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
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-lealtad',
  templateUrl: './lealtad.page.html',
  styleUrls: ['./lealtad.page.scss'],
})
export class LealtadPage {
  CargaCombustible:any;
  movies: any;
  uuid: any;
  balance: any;
  Nivel:any;
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
  interval:any;
  Bomba: any;
  IngresaManual: any;
  IngresaQR: any;
  cargando: any;
  TipoCombustible: any;
  TipoCombustibleNombre:any;
  scanea: any;
  BloqueaInput:any;
  maxVal:any;
  TipoCantidadVolumenVal:any;
  foliocanje:any;
  vales:any;
  productoscanje:any;
  EsManualCaptura:any;
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
    private navctrl: NavController,private graphqlService: GraphqlService
  ) {}

  async ionViewWillEnter() {
    this.storage.create();
    this.EsManualCaptura = await this.storage.get('EsManualCaptura');
    if(this.EsManualCaptura==true){
      this.storage.set("EsManualCaptura",false);
      this.storage.remove('EsAcumulacionNumero');
      alert('Actualmente, Solo los clientes que son identificados via Qr pueden usar el plan lealtad');
      this.navCtrl.navigateRoot('/login');
    }else if(this.EsManualCaptura==false){
     // this.EsManualCaptura = await this.storage.get('EsAcumulacionNumero');//numero scaneado anteriormente   
      var tokenn = await this.storage.get('Token');
      var EsAcumulacionNumero = await this.storage.get('EsAcumulacionNumero');
      this.scannerData=EsAcumulacionNumero;
      this.storage.set("EsManualCaptura",false);      
      console.log('es: '+this.EsManualCaptura);
      console.log('es: '+EsAcumulacionNumero);
      console.log('01');
      if(EsAcumulacionNumero){
      this.getUsers(EsAcumulacionNumero,tokenn);  
      this.storage.remove('EsAcumulacionNumero');
      }else{
        console.log('No hace nada');
      }
    }

  
    this.TipoCantidadVolumenVal='P';
    this.CargaCombustible=false;
    this.BloqueaInput=true;
    this.IngresaManual = false;
    this.scanea = false;
  
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
    var tokenn = await this.storage.get('Token');
 // console.log('02');
 
 this.scannerData='6681037336';    
 this.getUsers('6681037336',tokenn);  
 this.BloqueaInput=false;
  
}

  bombaN(BombaN: any ) {
/*
    if (BombaN < 10) {
      this.Bomba = '0' + BombaN;
    } else {
      this.Bomba = BombaN.toString();
    }
*/
this.Bomba = BombaN;
    console.log('Elegiste ' + this.Bomba);
    const newStr = this.Bomba;   
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
  TipoCantidadVolumen(Tipo: any ) {
  this.TipoCantidadVolumenVal=Tipo;
    console.log('Elegiste '+this.TipoCantidadVolumenVal);
    var Litros = document.getElementById('Litros');    
      var Pesos = document.getElementById('Pesos');
         var Lleno = document.getElementById('Lleno');
      if(Pesos && Litros && Lleno){
        if(this.TipoCantidadVolumenVal=='L'){
        Pesos.style.borderColor = '';
        Pesos.style.borderStyle = 'solid';
        Pesos.style.opacity = '1';        
        Litros.style.borderColor ='#1d0caf';
        Litros.style.borderStyle = 'solid';
        Litros.style.opacity = '0.5';
        Litros.style.borderRadius = '20%';    
         Lleno.style.borderColor ='';
        Lleno.style.borderStyle = 'solid';
        Lleno.style.opacity = '1';
        Lleno.style.borderRadius = '20%';
        this.BloqueaInput=false;
        }
        else if(this.TipoCantidadVolumenVal=='P'){
          this.BloqueaInput=false;
        Litros.style.borderColor = '';
        Litros.style.borderStyle = 'solid';
        Litros.style.opacity = '1';        
        Pesos.style.borderColor ='#1d0caf';
        Pesos.style.borderStyle = 'solid';
        Pesos.style.opacity = '0.5';
        Pesos.style.borderRadius = '20%';
        Lleno.style.borderColor ='';
        Lleno.style.borderStyle = 'solid';
        Lleno.style.opacity = '1';
        Lleno.style.borderRadius = '20%';
        }else{
           this.BloqueaInput=true;
           this.toCharge='';
        Lleno.style.borderColor ='#1d0caf';
        Lleno.style.borderStyle = 'solid';
        Lleno.style.opacity = '0.5';
        Lleno.style.borderRadius = '20%';
         Litros.style.borderColor = '';
        Litros.style.borderStyle = 'solid';
        Litros.style.opacity = '1';
        Pesos.style.borderColor = '';
        Pesos.style.borderStyle = 'solid';
        Pesos.style.opacity = '1';  
 
        }

    }
  }
  Combustible(Tipo: any,valor:any) {
    const Regular = document.getElementById('Regular');
    var Premier = document.getElementById('Premier');
    var Diesel = document.getElementById('Diesel');
    if (Regular) {
      if (Regular && Tipo == 'Regular') {
        this.TipoCombustibleNombre=Tipo;
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
        this.TipoCombustibleNombre=Tipo;
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
        this.TipoCombustibleNombre=Tipo;
        Diesel.style.borderColor = '#3880ff';
        Diesel.style.borderStyle = 'solid';
        Diesel.style.opacity = '0.6';
      } else {
        Diesel.style.borderColor = '#797979';
        Diesel.style.borderStyle = 'solid';
        Diesel.style.opacity = '1';
      }
    }
    this.TipoCombustible = valor;
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
            console.log('03');
            await this.getUsers(this.scannerData, tokenn); //consulto el numero sociosmart scaneado
          
        } else if (cuenta == 16) {
          this.BloqueaInput=true;
          this.Codigo = result.content;       
          //Tarjeta de regalo
          // alert('código extraer tarjeta de regalo');
          var auxguion=this.Codigo.substr(0,4)+'-'+this.Codigo.substr(4,4)+'-'+this.Codigo.substr(8,4)+'-'+this.Codigo.substr(12,4)
          this.navCtrl.navigateRoot(`/cargacombustible?Tarjeta=${auxguion}`);
          //this.getGiftCardBalance(auxguion);
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
    this.cargando = true;
    console.log('Cliente a consultar en plan lealtad:'+this.scannerData);
    this.graphqlService.ObtenerClienteFrecuente(`${this.scannerData}`).subscribe(
      (response) => {
        console.log(response);
        this.IngresaQR = true;
        this.balance=response.data.gasDiscountByPhone.discount;
        this.Nivel=response.data.customerLevelByPhone.level.name;
        this.productoscanje=response.data.getActiveBenefitsByPhone.items;
        console.log(this.productoscanje);
        this.cargando = false;
        console.log(response);
      },
      (error) => {
        console.error('Error en la autenticación:', error);
      }
    );
  }
async  RedimirBeneficio($BeneficioId:any,$Estatus:any,RedimirBeneficio:any,benefitTicketId:any){
console.log(benefitTicketId);
  if($Estatus=='1'){
    let alert = this.alertCtrl.create({
      header: 'Válidación de operador',
      backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
      keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado  
      message:
      new IonicSafeString(
        '<br><b>Beneficio: </b><br>-'+RedimirBeneficio.name+       
        '<br>'),
      inputs: [
        {
          name: 'EMPLEADO',
          placeholder: '# EMPLEADO',
          type: 'number',
        },
        {
          name: 'NIP',
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
          text: 'CANJEAR',
          handler: async (data) => {
            if (data.EMPLEADO != '' && data.NIP != '') {
               console.log('login');              
              this.storage.get('PV').then((pv) => {
                this.storage.get('usercve').then((usercve) => {
                  this.storage.get('contrakey').then((contrakey) => {
                    this.storage.get('userkey').then((userkey) => {
                      this.storage.get('UUID').then((UUID) => {
                        this.storage.get('cve_Ciudad').then((ciudad) => {
                          this.storage.get('Token').then((token) => {
                            var empleado = data.EMPLEADO;
                            this.storage.set('user', empleado);                            
                            // console.log(data.NIP);
                            // console.log('Cupon normal sin quemar');
                            this.apirestService
                              .postValeop(
                                pv,
                                this.scannerData,
                                1,
                                $BeneficioId+',2',
                                userkey,
                                token,
                                ciudad,
                                UUID,
                                data.EMPLEADO,
                                data.NIP
                              )
                              .subscribe(async (data) => {                                
                                 console.log(data);
                                // console.log(data[0]['result']['Estatus']);
                                this.foliocanje = data[0]['result']['Folio'];
                                //var str=data[0].Mensaje
                                var Estado = data[0]['result']['Estatus'];
                                // console.log(Estado);
                                if (Estado == '1') {   
                                  this.quemabeneficiolealtad(benefitTicketId);
                                                           
                                  //this.CargandoModal();
                                  this.storage.get('puntoventa').then((PV1) => {
                                    this.storage
                                      .get('IpImpresora')
                                      .then((IpImpresora) => {
                                        this.storage
                                          .get('NombreImpresora')
                                          .then((NombreImpresora) => {
                                            this.storage
                                              .get('Puerto')
                                              .then((Puerto) => {
                                                this.storage
                                                  .get('TipoImpresora')
                                                  .then((TipoImpresora) => {
                                                    this.storage
                                                      .get('host')
                                                      .then((host) => {
                                                        //gasolinera
                                                        this.apirestService
                                                          .getValeCanjeGas(
                                                            this.foliocanje
                                                          )
                                                          .then(async (data) => {
                                                            this.vales = data;
                                                            let alert2 =
                                                              this.alertCtrl.create(
                                                                {
                                                                  header:
                                                                    'ATENCIÓN',
                                                                    backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
                                                                    keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado 
                                                                  message:
                                                                    'Se envió a imprimir Ticket, Presentar ticket en establecimiento.',
                                                                  buttons: [
                                                                    {
                                                                      text: 'Aceptar',
                                                                      role: 'cancel',
                                                                      handler: (
                                                                        data
                                                                      ) => {
                                                                        // console.log('Cancel clicked');
                                                                      },
                                                                    },
                                                                  ],
                                                                }
                                                              );
                                                            (await alert2).present();
                                                            this.vales =
                                                              this.generateArray(
                                                                data
                                                              );
                                                            this.foliocanje =
                                                              this.vales[0][
                                                              'FolioRedencion'
                                                              ];
                                                            this.apirestService
                                                              .ticket(
                                                                this.scannerData,
                                                                this.vales,
                                                                this.foliocanje,
                                                                pv,
                                                                0,
                                                                IpImpresora,
                                                                NombreImpresora,
                                                                host,
                                                                TipoImpresora,
                                                                Puerto,
                                                                PV1
                                                              )
                                                              .subscribe(
                                                                (dataa: any) => { }
                                                              );
                                                          });
                                                      });
                                                  });
                                              });
                                          });
                                      });
                                  });
                                } else if (Estado == '2') {
                                  let alert2 = this.alertCtrl.create({
                                    header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                                    
 message:'Verificación de 3 digitos inválida',
                                    buttons: [
                                      {
                                        text: 'Aceptar',
                                        role: 'cancel',
                                        handler: (data) => {
                                          // console.log('Cancel clicked');
                                        },
                                      },
                                    ],
                                  });
                                  (await alert2).present();
                                } else if (Estado == '3') {
                                  let alert2 = this.alertCtrl.create({
                                    header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                                    
 message:
                                      'Verificación de operador inválida',
                                    buttons: [
                                      {
                                        text: 'Aceptar',
                                        role: 'cancel',
                                        handler: (data) => {
                                          // console.log('Cancel clicked');
                                        },
                                      },
                                    ],
                                  });
                                  (await alert2).present();
                                } else if (Estado == '4') {
                                  let alert2 = this.alertCtrl.create({
                                    header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                                    message: 'Operación inválida',
                                    buttons: [
                                      {
                                        text: 'Aceptar',
                                        role: 'cancel',
                                        handler: (data) => {
                                          // console.log('Cancel clicked');
                                        },
                                      },
                                    ],
                                  });
                                  (await alert2).present();
                                } else if (Estado == '5') {
                                  let alert2 = this.alertCtrl.create({
                                    header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                                    
 message:
                                      'Puntos Insuficientes al momento de generar canje',
                                    buttons: [
                                      {
                                        text: 'Aceptar',
                                        role: 'cancel',
                                        handler: (data) => {
                                          // console.log('Cancel clicked');
                                        },
                                      },
                                    ],
                                  });
                                  (await alert2).present();
                                } else if (Estado == '6') {
                                  let alert2 = this.alertCtrl.create({
                                    header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                                    
 message:'Punto De venta No tiene Permisos para Canjear, Reinicia App',
                                    buttons: [
                                      {
                                        text: 'Aceptar',
                                        role: 'cancel',
                                        handler: (data) => {
                                          // console.log('Cancel clicked');
                                        },
                                      },
                                    ],
                                  });
                                  (await alert2).present();
                                } else {
                                }
                              });
                          });
                        });
                      });
                    });
                  });
                });
              });
            } else {
              let alert2 = this.alertCtrl.create({
                header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                message: 'Rellena los campos de autorización de operador',
                buttons: [
                  {
                    text: 'Aceptar',
                    role: 'cancel',
                    handler: (data) => {
                      // console.log('Cancel clicked');
                    },
                  },
                ],
              });
              (await alert2).present();
            }
          },
        },
      ],
    });
    (await alert).present();
  }
                        else if($Estatus=='13')
                        {
                          alert('Este beneficio actualmente esta agotado temporalmente, favor de reintentar mas tarde.');
                        }
                        else if($Estatus=='4')
                        {
                          alert('Este beneficio ya fué canjeado este periodo.');
                        }else{

                        }
    
  }
  CargarCombustibleBeneficio(){
    if(this.CargaCombustible==true)
    this.CargaCombustible=false;
  else
  this.CargaCombustible=true;
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
      this.navCtrl.navigateRoot(`/cargacombustible?Tarjeta=${auxguion}`);
      //this.getGiftCardBalance(auxguion);
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
 quemabeneficiolealtad(benefitTicketId:any){
console.log('Quemavale');
this.graphqlService.RedimeBeneficio(this.scannerData,benefitTicketId).subscribe(
  (response) => {
    console.log(response.data.redemptionByPhone.message); 
    if(response.data.redemptionByPhone.message=='Redeemed'){    
      this.getBalance();
    }
     console.log('Se quemó Beneficio');
   }                  
);
 
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
              this.sessionToken = this.users[0].TokenSesion;
              this.Nombre =this.users[0].Nombre +' ' +this.users[0].Ap_Paterno +' ' +this.users[0].Ap_Materno;          
              // Get

              await this.getBalance();             
              console.log('Nombre:'+this.Nombre);
              if ((this.Nombre == 'null null null'|| this.Nombre=='undefined undefined undefined')&&this.users[0].Estatus=='1') {
                alert(
                  'El cliente no ha completado su perfil, solo podrá acumular hasta completarlo'
                );               
                this.Nombre = 'Cliente sin completar perfil';
              //  this.navCtrl.navigateRoot('/login');
              }
              if (this.users[0].Estatus == '5') {
                alert('Tu cuenta de acceso es invalida');
                this.storage.clear();
                this.navCtrl.navigateRoot('/login');
              } else {
                console.log('Estatus regresado de cliente:' + this.users[0].Estatus);
              }
              if (this.users[0].Estatus == '4') {
                alert(
                  'Cliente no encontrado'
                ); 
                this.IngresaQR=false;
                this.CargaCombustible=true;
               // this.navCtrl.navigateRoot('/login');
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
    this.cargando = true;
    /*
    this.storage.set('DebitoBomba', this.Bomba);
    this.storage.set('DebitoTipoCombustible', this.TipoCombustible);
    this.storage.set('DebitoMonto', this.toCharge);
    this.storage.set('NCliente', this.scannerData);
    console.log(this.Bomba+' '+this.TipoCombustible+' '+this.toCharge+' '+this.scannerData);
    this.navCtrl.navigateRoot('/detalle-carga-lealtad');   
    */
   console.log(this.TipoCantidadVolumenVal);
   console.log(this.toCharge);
   if(this.TipoCantidadVolumenVal=='P'){
    if(this.toCharge>=10 && this.toCharge<=5000){
      if(this.TipoCombustible){
        if(this.Bomba){
          this.mandaraprefijar();
          }else{
            this.cargando = false;
            alert('Selcciona una posición');
             }
        }else{
            this.cargando = false;
            alert('Selcciona un tipo de combustible');
            }
        }else{
          this.cargando = false;
          alert('Cantidad solicitada es menor a $10.00 o superior a los 2,000.00');
        }
      }else{ 
       // console.log('Son Litros');
      }
      if(this.TipoCantidadVolumenVal=='L'){
         if(this.toCharge>=1 && this.toCharge<200 ){
          if(this.TipoCombustible){
            if(this.Bomba){
              this.mandaraprefijar();
              }else{
                this.cargando = false;
                alert('Selcciona una posición');
                 }
            }else{
                this.cargando = false;
                alert('Selcciona un tipo de combustible');
            }
          } else{
           this.cargando = false;
          alert('La cantidades aceptadas en litros son entres 1 y 100 litros por transacción.');
        }  
      }else{
      //  console.log('Son Pesos');
      }

          if(this.TipoCantidadVolumenVal=='LL'){
                  this.toCharge=5000; 
         if(this.toCharge>=1 && this.toCharge<=5000 ){
          if(this.TipoCombustible){
            if(this.Bomba){
              this.mandaraprefijar();
              }else{
                this.cargando = false;
                alert('Selcciona una posición');
                 }
            }else{
                this.cargando = false;
                alert('Selcciona un tipo de combustible');
            }
          } else{
           this.cargando = false;
          alert('La cantidades aceptadas en litros son entres 1 y 100 litros por transacción.');
        }  
      }else{
      //  console.log('Son Pesos');
      }
  }
 async mandaraprefijar(){
  if(this.TipoCantidadVolumenVal=='P'){
var mensaje='<br><center>Autorizarás</center><br><b>Cantidad: </b>' +
this.toCharge +
'.00<br><b>Combustible: </b>' +
this.TipoCombustibleNombre +
'<br><b>Bomba: </b>' +
this.Bomba +
'<br>';
  }else if(this.TipoCantidadVolumenVal=='LL'){
   
     this.toCharge='5000'; 
    this.TipoCantidadVolumenVal='P'
var mensaje='<br><center>Autorizarás</center><br><b>Cantidad: TANQUE LLENO</b>' +
'<br><b>Combustible: </b>' +
this.TipoCombustibleNombre +
'<br><b>Bomba: </b>' +
this.Bomba +
'<br>';
  
}else{
var mensaje='<br><center>Autorizarás</center><br><b>Cantidad: </b>' +
this.toCharge +
' Lts. <br><b>Combustible: </b>' +
this.TipoCombustibleNombre +
'<br><b>Bomba: </b>' +
this.Bomba +
'<br>';
}
    let alert2 = this.alertCtrl.create({
      header: 'Válidación de operador',
      message:mensaje,
      inputs: [
        {
          name: 'EMPLEADO3',
          placeholder: '# EMPLEADO SOCIOSMART',
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
           
            this.cargando = false;
          },
        },
        {
          text: 'CONFIRMAR',
          handler: async (data) => {
            this.cargando = true;
            if (data.EMPLEADO3 != '' && data.NIP3 != '') {
              this.storage.set('EmpleadoUser',data.EMPLEADO3);
              this.storage.get('puntoventa').then(($Cre) => {
                   this.storage.get('IdEstacion').then(($IdEstacion) => {
                    this.apirestService
                      .ValidaEmpleadoNipconEstacion(
                         data.EMPLEADO3,
                       data.NIP3,
                         $Cre,
                         $IdEstacion
                       )
                       .then(async (data) => {
                       //this.cargando = false;
                         let dataArray = this.generateArray(data);
                        // console.log(dataArray);
                         if (dataArray[0]['Estatus'] == '1') {
                          // this.cargando = false;
                          console.log(dataArray[0]);
                         // alert('Validacion correcta');
                          const fechaHoraMazatlan = this.getFechaHoraMazatlan();
                          var presetcode= `${fechaHoraMazatlan}-${this.scannerData}`;
                          this.storage.set('PresetCode', presetcode);
                      
                          const Hostgm= await this.storage.get('HostEstacion');
                          this.apirestService.EstatusBomba(this.Bomba,Hostgm)                
                            .subscribe((data) => {  
                              if(data.Estatus==0){
                                alert(data.Mensaje);
                              }
                              console.log(data.Data.estado_bomba); 
                              console.log(data.Data.mensaje);
                              if(data.Data.estado_bomba=='4'){   
                                this.cargando = false;      
                               alert(data.Data.mensaje +' Esperar a terminar de servir y/o Valida pistolas colgadas antes de proceder');
                              }else if(data.Data.estado_bomba=='2'){
                                this.cargando = false;
                                alert(data.Data.mensaje+' Sirve el Preset previo');
                              }else if(data.Data.estado_bomba=='1'){
                                this.cargando = false;
                                alert(data.Data.mensaje+' Reportar a Soporte técnico');
                              }else if(data.Data.estado_bomba=='3'){
                                console.log('Proceder con prefijar');

                                this.interval = setInterval(() => {
                                this.apirestService
                            .PrefijaBomba(this.toCharge,this.TipoCombustible, this.balance, this.Bomba,presetcode,this.TipoCantidadVolumenVal,Hostgm)
                            .pipe(
                              catchError((err) => {
                                clearInterval(this.interval)
                                console.log('error', err);
                                console.log( err);
                              
                                if (err.status == 500) {
                                  alert(
                                    'Error al intentar la bomba, por favor contacta a un supervisor para escalar este problema.'
                                  );
                                } else if (err.status == 401) {
                                  alert('Usted no tiene permisos para prefijar esta bomba');
                                } else if (err.status == 402) {
                                  alert('Saldo insuficiente');
                                } else if (err.status == 404) {                      
                                  alert('Bomba no encontrada/url de prefijado erroneo');
                                  alert('Bomba Capturada: '+this.Bomba);
                                }else {
                                  alert('Error en el servidor o internet intermitente.');
                                }
                                this.cargando = false;
                                throw err;
                              })
                            )
                            .subscribe((data) => {
                              console.log('data de prefijacion 01', data);             
                              if(data.Estatus==0){   
                                console.log('Prefijado correcto');
                                clearInterval(this.interval)          
                              //this.cargando = false;                              
                              this.storage.set('DebitoBomba', this.Bomba);
                              this.storage.set('DebitoTipoCombustible', this.TipoCombustible);
                              this.storage.set('DebitoMonto', this.toCharge);
                              this.storage.set('DebitoModalidad', this.TipoCantidadVolumenVal);
                              this.storage.set('NCliente', this.scannerData);
                              console.log(this.scannerData+' '+this.scannerData+' '+this.scannerData);
                            this.navCtrl.navigateRoot('/detalle-carga-lealtad');     
                          }else{
                            console.log('Reintentar prefijado');
                            //alert('Problemas para prefijar, reintete de nuevo');
                          }
                          });
                      }, 3000);
                          
                              }
                              else{
                                this.cargando = false;
                                alert('Problemas al solicitar disponibilidad en dispensario, Reportar a Sistemas, estatus fuera de los parámetros');
                              }
                            });

                          //this.navctrl.navigateRoot('/detalle-carga');
                        } else {
                           this.cargando = false;
                           alert('Datos ingresados incorrectos o no tienen permisos en esta estación'
                         );
                        }
                       });
                   });
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
  }
  getFechaHoraMazatlan(): string {
    const fecha = new Date();
  
    // Formatear la fecha y hora en la zona horaria de Mazatlán (México)
    return fecha.toLocaleString('es-MX', { 
      timeZone: 'America/Mazatlan',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Formato 24 horas
    });
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
