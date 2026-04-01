import { Component, NgZone } from '@angular/core';
import { AlertController,IonicSafeString,NavController} from '@ionic/angular';
import { ApirestService } from '../services/apirest.service';
import { Storage } from '@ionic/storage-angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OnDestroy } from   '@angular/core';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gasPump:any;
  botonacumulacion: any;
  PRE: any;
  Numero: any;
  Nombre: any;
  Mensaje: any;
  SaldoPuntosActual: any;
  Numero2: any;
  NoBomba: any;
  Nip: any;
  Estatus: any;
  TipoBd: any;
  TipoBds: any;
  Version: any;
  AcumulacionManual: any;
  AcumulacionNormal: any;
  validaigualdadnumero: any;
  alert: any;
  modalCtrl: any;
  users: any;
  EstatusChofer: any;
  puntosestacion: any;
  PuntosVerdes: any;
  Ultimos3Digitos: any;
  ImagenTipo: any;
  estatuskey: any;
  navParams: any;
  NomCliente: any;
  NomClienteAp: any;
  NomClienteMa: any;
  botonCanje: any;
  isenabled2: boolean = true;
  Cuenta: any;
  PuntosVerdesHabilitado: any;
  PuntosdeVentaCanje: any;
  tucargavale: any;
  scannerData: any;
  ClienteRecienRegistrado: any;
  soloacumulacion: any;
  banderaigualverificacion: any;
  empleado: any;
  Respuestass: any;
  Campana1: any;
  toastController: any;
  campana: any;
  sorteolocalvar: any;
  sorteolocal: any;
  solotaxistasorteo: any;
  EstatusTicketValeEstacion: any;
  tucargavalevar: any;
  cargando: any;
  CargandoselectSORTEO: any;
  ocultarselectcupon: any;
  Cargandoselect: any;
  cuponeslist: any;
  valorselect:any;
  costopuntos:any;
  valorselect1:any;
  costopuntos1:any;
  foliocanje:any;
  nombrecanje:any;
  costodinero:any;
  gamingcv:any;
  costopuntoscv1:any;
  costodinerocv1:any;
  valorselectcv1:any;
  gamingcv1:any;
  gaming: any;
  vales: any;
  gaming1:any;
  sorteolist:any;
  ocultarselectsorteo:any;
  
  ocultar1: boolean = false;
  ocultar2: boolean = false;
  ocultar3: boolean = false;
  ocultar4: boolean = false;
  ocultar5: boolean = false;
  config: boolean = false;
  costopuntoscv: any;
  valorselectcv: any;
  costodinerocv: any;
  FolioControl: any;
  CanjeManual: any;
  EstatusSorteoGas: any;
  MostrarSorteos: any;
  MostrarCanjes: any;
  CveCampania: any;
  campanias: any;
  puntoventa: any;
  tokenparacampania: any;
  uuidparacampania: any;
  MultiplicadoPuntosCampania: any;
  diadeep : any;
  fechadeep: any;
  celdeep: any;
  celyfecha: any;
  esdeeplink: any;
  diaactual: any;


  constructor(
    /*modalCtrl: ModalController,*/

    private navCtrl: NavController,
    public apirestService: ApirestService,
    // public scanner:BarcodeScanner,
    public storage: Storage,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
private ngZone:NgZone
  ) {
    this.storage.create();
    this.storage.get('base').then((val2) => {
      // console.log(val2);
      this.TipoBd=val2;
      if(this.TipoBd==1)
      {
        this.TipoBds=false;
      }
  else{this.TipoBds=true;}    
    });

    if(this.route.snapshot.paramMap.get('Celular')){
      this.esdeeplink=true;
      this.celyfecha = this.route.snapshot.paramMap.get('Celular');
      this.fechadeep=this.celyfecha.slice(10,12);
      // alert(this.fechadeep);
      this.diaactual = new Date().toISOString().slice(8,10);
       var diaactual = new Date().toISOString();
       console.log("diaactual "+diaactual);
      this.celdeep = this.celyfecha.slice(0,10);
      // alert(this.celdeep);
      // alert(this.diaactual);
      // console.log("D:"+this.diaactual);   
      // console.log("Dia parametro: ",this.fechadeep);
          this.Numero= this.celdeep;
          this.Numero2= this.celdeep;
          this.storage.set('recienregistrado1', this.celdeep);
          this.storage.set('recienregistrado2', this.celdeep);
          this.storage.set('NoBomba', this.route.snapshot.paramMap.get('Bomba'));
          this.storage.set('EstatusRegistro', false);
          console.log("this.diaactua l"+this.diaactual);
          console.log("this.fechadeep "+this.fechadeep);
          console.log("this.esdeeplink "+this.esdeeplink);
          if((this.esdeeplink) && (this.diaactual==this.fechadeep)){

            this.ingresoAutomatico();
          }else{
            alert("QR inválido, favor de refrescar pantalla en aplicación SocioSmart");
        }
      } else { 
        this.esdeeplink=false;
        this.ingresoAutomatico();
      }

  }
  
  async ionViewWillEnter() {

    this.storage.set("EsManualCaptura",false);

    this.MostrarCanjes = await this.storage.get('CanjeManual');
    console.log("Mostrar Canjes= ",this.MostrarCanjes)
    this.MostrarSorteos = await this.storage.get('EstatusSorteoGas');
    console.log("Mostrar Sorteos= ",this.MostrarSorteos)


    // this.Version = this.storage.get('Version')
    this.apirestService.cerrarlasdos$.subscribe(() => {
      this.cerrarlasdos();
    });
  
      this.NoBomba =  this.route.snapshot.paramMap.get('Bomba');
    
    //comprueba cuales ventanas deben mostrarse y verifica si venimos de registrar e inicia al usuario directamente
    

    this.storage.get('Version').then((Version) => {
      this.Version = Version;
    });
    this.storage.get('AcumulacionManual').then((AcumulacionManual) => {
      this.AcumulacionManual = AcumulacionManual;
    });
    this.storage.get('AcumulacionNormal').then((AcumulacionNormal) => {
      this.AcumulacionNormal = AcumulacionNormal;
    });
    this.storage.get('PuntosVerdes').then((PuntosVerdes) => {
      // console.log("Puntos verdes?: ",PuntosVerdes);
      this.PuntosVerdesHabilitado = PuntosVerdes;
    });

    this.storage.get('PuntosdeVentaCanje').then((PuntosdeVentaCanje) => {
      // console.log('PuntosdeVentaCanje:' + PuntosdeVentaCanje);
      this.PuntosdeVentaCanje = PuntosdeVentaCanje;
    });

    this.storage.get('UUID').then((val1) => {
      this.storage.get('Token').then((val2) => {
          this.apirestService.getCampana(val1, val2).subscribe((data) => {
          this.users = data;
          this.users = this.generateArray(data);
          this.campana = this.users;
          console.log(this.campana);
          this.storage.get('PV').then((pv) => {
            this.apirestService
              .sorteolocal(val1, val2, pv)
              .subscribe((data) => {
                this.users = data;
                console.log(data);
                this.users = this.generateArray(data);
                this.sorteolocalvar = this.users;
                console.log(this.users[0]['Estatus']);
                this.sorteolocal = this.users[0]['Estatus'];
                this.solotaxistasorteo = this.users[0]['SoloTaxista'];
                console.log(this.sorteolocal);
              });
          });
          this.storage.get('PV').then((pv) => {
            this.apirestService
              .TucargaVale(val1, val2, pv)
              .subscribe((data) => {
                this.users = data;
                this.users = this.generateArray(data);
                // console.log(this.users);
                this.tucargavalevar = this.users;
               //  console.log('TU CARGA VALE='+this.users[0]['Estatus']);
                this.tucargavale = this.users[0]['Estatus'];
             //   console.log(this.users);
              });
            });
          });
        });
      });


        

          
    }
    
  //
  //Hay que ver xq no registra al usuario caundo regresa
  //
    async ingresoAutomatico (){
      if(this.esdeeplink=false){
        this.Numero = await this.storage.get('recienregistrado1');
        this.Numero2 = await this.storage.get('recienregistrado2');
      } else{
        if (await this.storage.get('recienregistrado1') && await this.storage.get("EstatusRegistro") === false){
          this.verificar();
        }
    }

    }


  scan() {
    this.storage.set("EsManualCaptura",false);
    this.PRE = false;
    this.Numero = '';
    this.Numero2 = '';
    this.NoBomba = '';
    this.Nip = '';
    this.SaldoPuntosActual = '';
    var options = {
      prompt: 'scanear',
    };
 
    this.IniciaQr();
    this.ocultar1 = false;
    this.ocultar2 = false;
    this.ocultar3 = false;
    this.ocultar4 = false;
    
  }

  reset() {
    this.botonacumulacion = true;
    this.PRE = false;
    this.ocultar1 = false;
    this.ocultar2 = false;
    this.ocultar3 = false;
    this.ocultar4 = false;
    this.Numero = '';
    this.Nombre = '';
    this.Mensaje = '';
    this.SaldoPuntosActual = '';
    this.Numero2 = '';
    this.NoBomba = '';
    this.Nip = '';
    this.Estatus = '';
    this.navCtrl.navigateRoot('/login');
  }



async MANUAL() {
  //Comprobar si hay algo en NumeroARegistrar en storage
// else {
    console.log('Entrando primera vez');
   
    this.storage.set("EstatusRegistro", true);
    this.storage.set("EsManualCaptura",true);
    // this.Numero = '6681037335';
    // this.Numero2= '6681037335';
    // this.Numero = '6681489075';
    // this.Numero2= '6681489075';

    this.NoBomba = '';
    // }
    this.PRE = false;

    this.Nip = '';

    if (this.ocultar1 == true) {
      this.ocultar1 = false;
    } else {
      this.ocultar1 = true;
    }
    this.ocultar2 = false;
    this.ocultar3 = false;
    this.ocultar4 = false;
  }


  verificar() {

    if (this.verificar10digi()) {
    } else {
      this.Verificarigualdad();
           

      if (this.validaigualdadnumero == true) {
        this.ocultar2 = true;
        this.storage.get('Nconta').then(async (val1) => {
          var cuenta = parseInt(val1 + 1);
          if (cuenta >= 10) {
          //  this.verificarkey();
           // this.getUsers(this.Numero);           
            console.log('entra a valida key');
            cuenta = 0;
            var tokenn = await this.storage.get('Token');
            console.log(tokenn);
            this.getUsers(this.Numero, tokenn);
            console.log('menos');
          } else {
            var tokenn = await this.storage.get('Token');
            console.log(tokenn);
            this.getUsers(this.Numero, tokenn);
            console.log('menos');
          }
          this.storage.set('Nconta', cuenta);
        });

        this.ocultar1 = false;
  
      } else {
        alert('Verifica igualdad en los campos');
      }
    }
  }

  Verificarigualdad() {
    if (this.Numero == this.Numero2) {
      console.log('Numeros 1 y 2 iguales');
      this.validaigualdadnumero = true;
    } else {
      console.log('diferentes');
      this.validaigualdadnumero = false;
    }
  }

  async verificarkey() {
    /*Version 2.- llevar token a verificar */
    console.log("NUNCA ENTRA A CERIFICARKEY ZZZZZZZZZZZZZZZZZZZZZZZ");
    this.storage.get('userkey').then((userkey) => {
      this.storage.get('contrakey').then((contrakey) => {
      this.storage.get('Token').then((Token) => {
        console.log(userkey + '  ' + contrakey);
        this.apirestService.getEstatus(userkey, contrakey, Token ).subscribe((data: any) => {
          // this.Cuenta = data;
          this.Cuenta = this.generateArray(data);
          console.log('Estatus es:' + this.Cuenta[0]['Estatus']);
          console.log('Token es:' + this.Cuenta[0]['Token']);
          if (this.Cuenta[0]['Estatus'] == '1') {
            
            console.log("entra a lalal");
            this.storage.set('Token', this.Cuenta[0]['Token']);
            this.getUsers(this.Numero, this.Cuenta[0]['Token']);
          } else {
            alert('Tu cuenta de acceso está inactiva');
            this.storage.clear();
            this.navCtrl.navigateRoot('/config');
          }
        });
      });
    });
    });
  }

  async getUsers($id: any, $token: any) {
    //this.CargandoModal();
    // var tokenn = await this.storage.get('Token');

      this.storage.get('userkey').then((val1) => {
        this.storage.get('contrakey').then((val2) => {
          this.storage.get('PV').then((pv) => {
            this.SaldoPuntosActual = '';
            this.Nombre = '';
            this.Mensaje = '';
            this.apirestService
              .getUsers($id, val1, val2, pv, $token)
              .subscribe((data: any) => {
                // this.users = data;
                console.log("Lo que viene en data de getUsers: ",data);
                this.users = this.generateArray(data);
                console.log(this.users);
                console.log('el cve es:' + this.users[0].Cve_Usuario);
                this.storage.set('usercve', this.users[0].Cve_Usuario);
                this.Nombre = '';
                this.Mensaje = '';
                this.SaldoPuntosActual = '';
                console.log('CHOFERR:' + this.users[0].EstatusChofer);
                this.EstatusChofer = this.users[0].EstatusChofer;
                this.puntosestacion = this.users[0].puntosestacion;
                this.PuntosVerdes = this.users[0].PuntosVerdes;
                this.Ultimos3Digitos = this.users[0].Ultimos3Digitos;
                console.log(this.Ultimos3Digitos);
                this.ImagenTipo = this.users[0].Imagen;
                this.estatuskey = this.users[0].Estatus;
                this.Mensaje = this.users[0].Mensaje;
                this.Nombre =
                  this.users[0].Nombre +
                  ' ' +
                  this.users[0].Ap_Paterno +
                  ' ' +
                  this.users[0].Ap_Materno;
                /* if(this.navParams.get('Vuelta')){
                 this.NoBomba=this.navParams.get('Bomba');
                 console.log('Bomba'+this.NoBomba);
                 console.log('Bomba: '+this.navParams.get('Bomba'));
               }*/
                this.NomCliente = this.users[0]['Nombre'];
                this.NomClienteAp = this.users[0]['Ap_Paterno'];
                this.NomClienteMa = this.users[0]['Ap_Materno'];
                this.SaldoPuntosActual = this.users[0].SaldoPuntosActual;
                this.storage.get('CanjeManual').then((CanjeManual) => {
                  if (
                    this.users[0].SaldoPuntosActual >= 10 &&
                    CanjeManual == 1
                  ) {
                    console.log('es true');
                    this.botonCanje = true;
                    //  if(this.users[0].SaldoPuntosActual>=15)
                    //alert('Cuenta con puntos suficientes para canje');
                  } else {
                    console.log('es false');
                    this.botonCanje = false;
                  }
                  if (this.Nombre == 'null null null') {
                    this.ocultar2=true;
                    this.storage.remove('NumeroARegistrar');
                    alert(
                      'El cliente no ha completado su perfil, solo podrá acumular hasta completarlo'
                    );
                    this.botonCanje = false;
                    this.EstatusChofer = 0;
                    this.NomCliente = 'Cliente';
                    this.NomClienteAp = 'sin completar';
                    this.NomClienteMa = 'perfil';
                    this.Nombre = 'Cliente sin completar perfil';
                  }
                });
                if (this.users[0].Estatus == '5') {
                  alert('Tu cuenta de acceso es invalida');
                  this.isenabled2 = false;
                  this.storage.clear();
                  this.navCtrl.navigateRoot('/login');
                } else {
                  this.isenabled2 = true;
                }
                if (this.users[0].Estatus == '4') {

                  this.storage.set('NumeroARegistrar', this.Numero);

                  console.log(this.Numero);
                  //aqui quiero imprimier el numero antes de mandarlo a ver si si lo cacha bien

                  // alert("Número no registrado, Imprime ticket de invitacion.");
                  // this.isenabled2=true;
                  // this. ocultar1= false;
                  // this.ocultar2= false;
                  // this.ocultar3 = false;
                  // this.ocultar4=false;

                  //mandar numero a registrar

                  this.navCtrl.navigateRoot('/registro');
                }

                console.log(this.users);
              });
          });
        });
      });
  }

  irARegistro() { 
    

  }


  generateArray(obj: any) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  CargandoModal() {
    // this.alert = this.modalCtrl.create(CargandoPage);
    // this.alert.present();
  }

  verificar10digi() {
 
    console.log(this.Numero.toString().length);
    if (this.Numero.toString().length != 10) {
      alert('Campo de teléfono no tiene 10 digitos');
      return true;
    }
    if (this.Numero2.toString().length != 10) {
      alert('Campo de Confirmar teléfono no tiene 10 digitos');
      return true;
    }
    return false;
  }

  async reciclaje() {
    this.storage.set("PuntosActuales",this.PuntosVerdes);  
    this.storage.set("Cliente",this.Numero);
    this.storage.set("Nombre",this.Nombre);

    this.navCtrl.navigateRoot('/reciclaje');
  }

  async CanjearSorteoLocal(){
    console.log('sorteo1');
    console.log(this.sorteolocalvar[0]["CostoPuntos"]);
   this.costopuntoscv1=this.sorteolocalvar[0]["CostoPuntos"];
   this.valorselectcv1=this.sorteolocalvar[0]["Nombre"];
   this.gamingcv1=this.sorteolocalvar[0]["Cve_Sorteo"];
  
    console.log(this.valorselectcv1);//nombre producto
    //this.costopuntos='';
   // this.costodinero=preciod;
  
   if(parseFloat(this.puntosestacion)>=parseFloat(this.costopuntoscv1)){
   let alert = this.alertCtrl.create({
    header: 'AUTORIZACIÓN',
    message: '<b>Cupón: </b>'+this.valorselectcv1+'.<br><br><b>Precio Puntos:</b> '+this.costopuntoscv1+'(en estación).<br><br>',
    inputs: [
      {
        name: 'EMPLEADO3',
        placeholder: '# EMPLEADO',
        type: 'number'
      },
      {
        name: 'NIP3',
        placeholder: 'NIP',
        type: 'number'
      }
    ],
    buttons: [
      {
        text: 'CANCELAR',
        role: 'cancel',
        handler: data => {
          // console.log('Cancel clicked');
        }
      },
      {
        text: 'CANJEAR',
        handler: async data => {     
          if(data.EMPLEADO3!='' && data.NIP3!=''){ 
          // console.log("login");
          this.storage.get('PV').then((pv)=>{
          this.storage.get('usercve').then((usercve)=>{  
          this.storage.get('contrakey').then((contrakey)=>{
            this.storage.get('userkey').then((userkey) => {
              this.storage.get('Token').then((token) => {
              var empleado=data.EMPLEADO3;
             // var contra=data.NIP;
          this.storage.set("user",empleado);
          this.CargandoModal();
          // console.log(data.NIP3);
       
        this.apirestService.PostSorteo(this.Numero,this.gamingcv1,token,data.EMPLEADO3,data.NIP3,pv,contrakey,1)
        .then(async (data) => {
          let dataArray =this.generateArray(data);
          // console.log(dataArray);
          if(dataArray[0]["Estatus"]=='1')
            //  console.log(dataArray[0]["Estatus"]);
           this.foliocanje=dataArray[0]["Mensaje"];
             //var str=data[0].Mensaje
             var Estado=dataArray[0]["Estatus"];
            //  console.log(Estado);
             if(Estado=="1"){     
              this.puntosestacion=this.puntosestacion-this.costopuntoscv1;
      let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado        message: 'Se generó el Folio para participar en el sorteo, el cliente podrá verlo en su app en boletos generados.',          
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            handler: data => {
              // console.log('Cancel clicked');
            }
          },]
      });
      (await alert2).present();
      }else if(Estado=="3"){
       
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Puntos insuficientes',          
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
    
  
      }else if(Estado=="2"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Verificación de operador inválida',          
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else if(Estado=="4"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Operación inválida',          
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else if(Estado=="5"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Puntos Insuficientes al momento de generar canje',          
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }  else if(Estado=="6"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Punto De venta No tiene Permisos para Canjear, Reinicia App',          
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else{
      }});           
            });  
          });          
          }); 
        }); 
      });
          }else{    
            let alert2 = this.alertCtrl.create({
              header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado            message: 'Rellena los campos de autorización de operador',          
            buttons: [
              {
                text: 'Aceptar',
                role: 'cancel',
                handler: data => {
                  // console.log('Cancel clicked');
                }
              },]
          });
          (await alert2).present();}
        }
        }
            ]
          });
        
          (await alert).present();
        }else{
          let alert2 = this.alertCtrl.create({
            header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado            message: 'Puntos Insuficientes',          
            buttons: [
              {
                text: 'Aceptar',
                role: 'cancel',
                handler: data => {
                  // console.log('Cancel clicked');
                }
              },]
          });
          (await alert2).present();
        }

  }
  async cargavale(){
    
  console.log(this.tucargavalevar[0]["CostoDeRedencionPuntos"]);
  this.costopuntoscv=this.tucargavalevar[0]["CostoDeRedencionPuntos"];
  this.costodinerocv=this.tucargavalevar[0]["CostoDeRedencionDinero"];
  this.valorselectcv=this.tucargavalevar[0]["NombreProducto"];
  this.gamingcv=this.tucargavalevar[0]["Cve_ProductoRedimir"];
 
  // console.log('Costo'+this.costopuntoscv);
  // console.log('Puntos'+this.SaldoPuntosActual);
  //  console.log(this.valorselectcv);//nombre producto
   if(parseFloat(this.SaldoPuntosActual)>=parseFloat (this.costopuntoscv)){
   //this.costopuntos='';
  // this.costodinero=preciod;
  let alert = this.alertCtrl.create({
   header: 'AUTORIZACIÓN',
   message: '<b>Cupón: </b>'+this.valorselectcv+'.<br><br><b>Precio Puntos:</b> '+this.costopuntoscv+'.<br><b>Precio Efectivo: </b>'+this.costodinerocv+'.<br><br>',
   inputs: [
     {
       name: 'EMPLEADO',
       placeholder: '# EMPLEADO',
       type: 'number'
     },
     {
       name: 'NIP',
       placeholder: 'NIP',
       type: 'number'
     }
   ],
   buttons: [
     {
       text: 'CANCELAR',
       role: 'cancel',
       handler: data => {
        //  console.log('Cancel clicked');
       }
     },
     {
       text: 'CANJEAR',
       handler: async data => {     
         if(data.EMPLEADO!='' && data.NIP!=''){
        //  console.log("login");
         this.storage.get('PV').then((pv)=>{
         this.storage.get('usercve').then((usercve)=>{  
         this.storage.get('cve_Ciudad').then((cve_Ciudad)=>{
         this.storage.get('UUID').then((UUID)=>{
         this.storage.get('userkey').then((userkey) => {
         this.storage.get('Token').then((token) => {
             var empleado=data.EMPLEADO;
             this.storage.set("user",empleado);            
         this.CargandoModal();
        //  console.log(data.NIP);
       this.apirestService.postValeop(pv,this.Numero,1,this.gamingcv,userkey,token,cve_Ciudad,UUID,data.EMPLEADO,data.NIP)
       .subscribe(async (data) => {
            // console.log(data);
            this.FolioControl=data[0]["result"]["Folio"];
            // console.log(data[0]["result"]["Estatus"]);
          this.foliocanje=data[0]["result"]["Folio"];
          
            //var str=data[0].Mensaje
            var Estado=data[0]["result"]["Estatus"];
            // console.log(Estado);
            if(Estado=="1"){
             this.SaldoPuntosActual=this.SaldoPuntosActual-this.costopuntoscv;
             this.apirestService.postTraepremio(this.foliocanje+'R',this.Numero,pv)
             .subscribe(data => {
              //  console.log(data);
               this.CargandoModal();          
               this.storage.get('puntoventa').then((PV1) => {
               this.storage.get('IpImpresora').then((IpImpresora) => {
               this.storage.get('NombreImpresora').then((NombreImpresora) => {
               this.storage.get('Puerto').then((Puerto) => {
               this.storage.get('TipoImpresora').then((TipoImpresora) => {
               this.storage.get('host').then(async (host) => { //gasolinera 
                //  console.log('GANO: '+data['info']['data']['codigoPremio']);
                //  console.log('GANO: '+data['info']['data']['descripcionPremio']);
                //  console.log(data);
                 var premio=data['info']['data']['descripcionPremio'];
    //  console.log('ESTADO PREMIO: '+data['info']['typeAward']);
     if(data['info']['typeAward']!='Previo'){
                 this.apirestService.getValeCanjeGasCargaVale(data['info']['data']['codigoPremio'])
     .then(async data => {  
       this.vales = data;
       this.vales[0]["Nombre"]=this.NomCliente;
       this.vales[0]["Ap_Paterno"]=this.NomClienteAp;
       this.vales[0]["Ap_Materno"]=this.NomClienteMa;
      //this.vales[0]["FolioRedencion"]=this.FolioControl;
       this.vales[0]["FK_Cve_Cliente"]=usercve;
      //  console.log(this.vales);
       let alert2 = this.alertCtrl.create({
        header: '¡GANASTE!',
         message: premio,          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();
       this.vales=this.generateArray(data); 
       this.foliocanje=this.vales[0]["FolioRedencion"];
              this.apirestService.ticket(this.Numero,this.vales,this.foliocanje,pv,0,IpImpresora,NombreImpresora,host,TipoImpresora,Puerto,PV1).subscribe(dataa=> {
               });
             }); 
           }else{
             let alert2 = this.alertCtrl.create({
              header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado               message: 'PROBLEMAS AL OBTENER UN PREMIO, REINTENTE DE NUEVO',          
               buttons: [
                 {
                   text: 'Aceptar',
                   role: 'cancel',
                   handler: data => {
                    //  console.log('Cancel clicked');
                   }
                 },]
             });
             (await alert2).present();
           }
 
           }); 
            
           });
               });
             });
           });
         
         });
             });
             
         
            
     }else if(Estado=="2"){
       let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado         message: 'Verificación de 3 digitos inválida',          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();
   
 
     }else if(Estado=="3"){
       let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado         message: 'Verificación de operador inválida',          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();
     }else if(Estado=="4"){
       let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado         message: 'Operación inválida',          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();
     }else if(Estado=="5"){
       let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado         message: 'Puntos Insuficientes al momento de generar canje',          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();
     }  else if(Estado=="6"){
       let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado         message: 'Punto De venta No tiene Permisos para Canjear, Reinicia App',          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();
     }else{
     }});           
           });  
         });          
         }); 
       }); 
     });
   });
         }else{    
           let alert2 = this.alertCtrl.create({
            header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado           message: 'Rellena los campos de autorización de operador',          
           buttons: [
             {
               text: 'Aceptar',
               role: 'cancel',
               handler: data => {
                //  console.log('Cancel clicked');
               }
             },]
         });
         (await alert2).present();}
       }
       
       
       }
           ]
         });
         (await alert).present();
       }else{
          
         let alert2 = this.alertCtrl.create({
         header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado         message: 'Puntos insuficientes',          
         buttons: [
           {
             text: 'Aceptar',
             role: 'cancel',
             handler: data => {
              //  console.log('Cancel clicked');
             }
           },]
       });
       (await alert2).present();}
  }

  SORTEOS(){
    this.Cargandoselect=false;
  this.storage.get('cve_Ciudad').then((Ciudad) => {
    
    this.apirestService.TraeSorteoVigente(Ciudad)
    .subscribe((data: any) => {
    // console.log('ya cargo');
    // console.log(data);
    this.sorteolist = data;   
    this.sorteolist=this.generateArray(data); 
    this.CargandoselectSORTEO=true;
    });
  });
  this.ocultarselectsorteo=true;
  }
  onChangelistasorteo(){
    // console.log(this.gaming1);
    var valor=null;
    var precio=null;
    
    for (let index = 0; index < this.sorteolist.length; index++) {
     if(this.sorteolist[index].Cve_Sorteo==this.gaming1){
     valor=this.sorteolist[index].Nombre;
     precio=this.sorteolist[index].CostoPuntos;
     }
    }
    this.valorselect1=valor;
    this.costopuntos1=precio;
  
    // console.log(valor);
  }
  async CanjearBoletoSorteo(){
    if(parseFloat(this.SaldoPuntosActual)>=parseFloat(this.costopuntos1)){
    let alert = this.alertCtrl.create({
     header: 'AUTORIZACIÓN',
     message: '<b>Sorteo:</b> '+this.valorselect1+'.<br><br><b>Precio Puntos: </b>'+this.costopuntos1+'.<br><br>',
     inputs: [
       {
         name: 'EMPLEADO1',
         placeholder: '# EMPLEADO',
         type: 'number'
       },
       {
         name: 'NIP1',
         placeholder: 'NIP',
         type: 'number'
       }
     ],
     buttons: [
       {
         text: 'CANCELAR',
         role: 'cancel',
         handler: data => {
          //  console.log('Cancel clicked');
         }
       },
       {
         text: 'CANJEAR',
         handler: async data => {  
           if(data.EMPLEADO1!='' && data.NIP1!=''){ 
          //  console.log("Entra a generar sorteo");
           this.storage.get('PV').then((pv)=>{
           this.storage.get('usercve').then((usercve)=>{  
           this.storage.get('contrakey').then((contrakey)=>{
           this.storage.get('userkey').then((userkey) => {
           this.storage.get('Token').then((token) => {
           let empleado=data.EMPLEADO1;
           // var contra=data.NIP;
           this.storage.set("user",empleado);            
           this.CargandoModal();
          //  console.log(data.NIP1);     
          //  console.log(usercve);   
         this.apirestService.PostSorteo(usercve,this.gaming1,token,data.EMPLEADO1,data.NIP1,pv,contrakey,0)
         .then(async (data) => {
              let dataArray =this.generateArray(data);
              console.log(dataArray);
              if(dataArray[0]["Estatus"]=='1')
              {   this.SaldoPuntosActual=this.SaldoPuntosActual-this.costopuntos1;}
              let alert1 = this.alertCtrl.create({
                header: 'ATENCIÓN  ',
                message:dataArray[0]["Mensaje"],
                buttons: [
                  {
                    text: 'Aceptar',
                    role: 'cancel',
                    handler: data => {
                      // console.log('Cancel clicked');
                    }}],
              });
              (await alert1).present();  
            this.foliocanje=dataArray[0]["Folio"];
              let str=dataArray[0].Mensaje
              let Estado=dataArray[0]["Estatus"];
              // console.log(Estado);
             }); }); }); }); });  });
          
            }else{
              let alert1 = this.alertCtrl.create({
                header: 'ATENCIÓN  ',
                message: 'Rellena los campos de autorización de operador',
                buttons: [
                  {
                    text: 'Aceptar',
                    role: 'cancel',
                    handler: data => {
                      // console.log('Cancel clicked');
                    }}],
              });
              (await alert1).present();  
            }
            }
          }]
        });
        (await alert).present();
      }else{
        let alert1 = this.alertCtrl.create({
          header: 'ATENCIÓN  ',
          message: 'Puntos Insuficientes',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }}],
        });
        (await alert1).present(); 
      }
      }
  async Canje($varlor:any,$prod:any) {
  let alert = this.alertCtrl.create({
    header: 'AUTORIZACIÓN',
    message: 'Canjear Cupon por: $'+$varlor+' pesos.<br><br><br><img src="../assets/imagen/'+this.ImagenTipo+'" alt="g-maps" style="border-radius: 2px"><br>Captura los últimos 3 caracteres del código verificador del vehículo',
    inputs: [
      {
        name: 'CODIGO',
        placeholder: 'CÓDIGO',
        type: 'password'
      },
      {
        name: 'EMPLEADO',
        placeholder: '# EMPLEADO',
        type: 'number',
      },
      {
        name: 'NIP',
        placeholder: 'NIP',
        type: 'number',
      }
    ],
    buttons: [
      {
        text: 'CANCELAR',
        role: 'cancel',
        handler: data => {
          // console.log('Cancel clicked');
        }
      },
      {
        text: 'CANJEAR',
        handler: async data => {
          if(this.Ultimos3Digitos.toUpperCase()==data.CODIGO.toUpperCase()){
          // console.log("login");
          this.storage.get('PV').then((pv)=>{
          this.storage.get('cve_Ciudad').then((cve_Ciudad)=>{
          this.storage.get('UUID').then((UUID)=>{
            this.storage.get('userkey').then((userkey) => {
              this.storage.get('Token').then((token) => {
              var empleado=data.EMPLEADO;
             // var contra=data.NIP;
              this.storage.set("user",empleado);
          this.CargandoModal();
          // console.log(data.NIP);
        this.apirestService.postValeopTaxi(pv,this.Numero,1,$prod,1,token,cve_Ciudad,UUID,data.EMPLEADO,data.NIP)
        .subscribe(async data => {
            //  console.log(data);
             let dataArray =this.generateArray(data);
            //  console.log(dataArray);

            //  console.log(dataArray[0]["status"]);
           this.foliocanje=dataArray[0]["result"]["Folio"];
          //  console.log(dataArray[0]["result"]["Folio"]);
             //var str=data[0].Mensaje
             var Estado=dataArray[0]["result"]["Estatus"];
            //  console.log(Estado);
             if(Estado=="1"){
               this.SaldoPuntosActual=this.SaldoPuntosActual-$varlor;
              this.CargandoModal();
              this.storage.get('puntoventa').then((PV1) => {
              this.storage.get('IpImpresora').then((IpImpresora) => {
              this.storage.get('NombreImpresora').then((NombreImpresora) => {
              this.storage.get('Puerto').then((Puerto) => {
              this.storage.get('TipoImpresora').then((TipoImpresora) => {
              this.storage.get('host').then((host) => { //gasolinera
                this.apirestService.getValeCanjeGas(this.foliocanje)
    .then(async (data: any) => {
      this.vales = data;
      let alert2 = this.alertCtrl.create({
        header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado        message: 'Se envió a imprimir Ticket, Cliente debe Firmar y operador quedarse con el.',
        buttons: [
          {
            text: 'Aceptar',
            role: 'cancel',
            handler: data => {
              // console.log('Cancel clicked');
            }
          },]
      });
      (await alert2).present();
      this.vales=this.generateArray(data);
      this.foliocanje=this.vales[0]["FolioRedencion"];
             this.apirestService.ticket(this.Numero,this.vales,this.foliocanje,pv,0,IpImpresora,NombreImpresora,host,TipoImpresora,Puerto,PV1).subscribe(dataa=> {
              });
            });
          });
          });
              });
            });
          });
        });
      }else if(Estado=="2"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Verificación de 3 digitos inválida',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                this.botonacumulacion=true;
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else if(Estado=="3"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Verificación de 3 digitos inválida',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else if(Estado=="4"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Verificación de 3 digitos inválida',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else if(Estado=="5"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Puntos Insuficientes al momento de generar canje',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }  else if(Estado=="6"){
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Punto De venta No tiene Permisos para Canjear, Reinicia App',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }else{
         let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message:dataArray[0]["result"]["Respuesta"],
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: data => {
                // console.log('Cancel clicked');
              }
            },]
        });
        (await alert2).present();
      }});
            });
          });
          });
        });
      });
          }else{
            let alert2 = this.alertCtrl.create({
              header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado              message: 'Verificación de 3 digitos inválida',
              buttons: [
                {
                  text: 'Aceptar',
                  role: 'cancel',
                  handler: data => {
                    // console.log('Cancel clicked');
                  }
                },]
            });
            (await alert2).present();
          }}}
            ]
          });
          (await alert).present();
  }

  async cerrarlasdos() {
    this.ocultar1 = false;
    this.ocultar2 = false;
    this.ocultar4 = false;
    this.botonacumulacion = true;
    this.ocultar3 = true;

    this.puntoventa = await this.storage.get('PV');
    var tokenn = await this.storage.get('Token');
    var UUIDD =  await this.storage.get('UUID');
    console.log("token al presionar acumular: ",tokenn);
    this.apirestService.GetCampanias(this.puntoventa, tokenn, UUIDD).subscribe(
        (res) => {           
              console.log("Respuesta sin procesar: ", res);       
              this.campanias=this.generateArray(res);
              console.log("campanias: ", this.campanias);       
             });

  }

  isAlertOpen = false;
  public alertButtons = ['OK'];

  async cerrarlastrespv() {
    this.botonacumulacion = false;

    if (this.EstatusChofer == '1') {
      let alert9 = this.alertCtrl.create({
        header: 'AUTORIZACIÓN',
        message:
          '<img src="../assets/imagen/' +
          this.ImagenTipo +
          '" alt="g-maps" style="border-radius: 2px"><br>Captura los últimos 3 caracteres del código verificador del vehículo',
        inputs: [
          {
            name: 'CODIGO',
            placeholder: 'CÓDIGO',
            type: 'password',
          },
        ],
        buttons: [
          {
            text: 'CANCELAR',
            role: 'cancel',
            handler: (data) => {
              this.botonacumulacion = true;
              // console.log('Cancel clicked');
            },
          },
          {
            text: 'CONTINUAR',
            handler: async (data) => {
              if (
                this.Ultimos3Digitos.toUpperCase() == data.CODIGO.toUpperCase()
              ) {
                // console.log('Entra verificado');
                this.acumulanormal();
              } else {
                let alert2 = this.alertCtrl.create({
                  header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                  message: 'Verificación de 3 digitos inválida',
                  buttons: [
                    {
                      text: 'Aceptar',
                      role: 'cancel',
                      handler: (data) => {
                        this.botonacumulacion = true;
                        // console.log('Cancel clicked');
                      },
                    },
                  ],
                });
                (await alert2).present();
                this.banderaigualverificacion = false;
              }
            },
          },
        ],
      });
      (await alert9).present();
    } else {
      this.acumulanormal();
    }
  }
  EnviarAAcumular(){
    console.log('Acumular');
    this.storage.set("EsAcumulacionNumero",this.Numero);

    this.navCtrl.navigateRoot('/lealtad');
  }

  acumulanormal() {
    if (this.empleado != '' && this.Nip != '' && this.NoBomba != '') {
      // console.log('no chofer');
      // console.log('entra a cerrarlas tres pv');
      this.Verificarigualdad();
      // console.log('sale a cerrarlas tres pv');
      this.ocultar1 = false;
      this.ocultar2 = false;
      // console.log(this.TipoBd);
      if (this.TipoBd == 2) {
        this.storage.get('puntoventa').then((val1) => {
          // console.log('entra a calida usuario');
          // console.log(this.empleado + '-' + this.Nip + '-' + val1);
          this.storage.get('GRUPO').then((GRUPO) => {
            this.apirestService
              .Validausuario(this.empleado, this.Nip, val1, GRUPO)
              .subscribe((data) => {
                this.users = data;
                this.users = this.generateArray(data);
                this.botonacumulacion = true;
                this.Respuestass = this.Respuestass + '\n' + this.users;
                if (this.users[0].Estatus == '1') {
                  this.ocultar5 = true;
                  // console.log('ir a insertar');
                  this.hacerinsersion(1);
                } else if (this.users[0].Estatus == '2') {
                  // console.log(this.users[0].Estatus);
                  alert('Contraseña invalida / Cuenta desactivada');
                } else {
                  // console.log('Estatus del usuario: ', this.users[0].Estatus);
                  alert('# de Empledo no existe');
                }
              });
          });
        });
      } else {
        // console.log('Conectad a base de datos local');
        //base de datos local
      }

    } else {
      this.botonacumulacion = true;
      alert('Completa los campos');
    }
  }

  hacerinsersion(Estatususuariodespacho: number) {
    // console.log('entra hacer insersion');
    this.storage.get('NToken').then((val1) => {
      if (val1 >= 5) {
        this.storage.get('Token').then((valor) => {
          this.apirestService.Refrescatoken(valor).then((data) => {
            this.users = data;
            this.users = this.generateArray(this.users);
            // console.log(this.users);
            if (this.users[0].Estatus == 1) {
              this.storage.set('Token', this.users[0].Token);
              this.storage.set('NToken', 0);
              this.VALIDA();
            } else {
              alert(
                'Error al refrescar token reintente de nuevo ó contacte a soporte para configurar App'
              );
            }
          });
        });
      } else {
        var cuenta = parseInt(val1 + 1);
        this.storage.set('NToken', cuenta);
        // console.log('Token valido: ' + val1);
        this.VALIDA();
      }
    });
  }

  VALIDA() {
    this.cargando = true;
    this.CargandoModal();
    this.ocultar3 = false;
    this.storage.get('puntoventa').then((val1) => {
      // console.log(this.NoBomba, this.Numero, val1);
      this.apirestService
        .Vertabla(this.NoBomba, this.Numero, val1)
        .then((data) => {
          // console.log('Josué');

          this.users = data;
          this.ocultar5 = false;
          if (this.users == '1') {
            this.ocultar3 = true;
            this.Respuestass = this.Respuestass + '\n' + data;
            alert(
              'Problemas al obtener despacho, reintente de nuevo, si el problema persiste contacta a soporte'
            );
          } else {
            this.users = this.generateArray(data);
            // console.log(this.users);
            this.Respuestass = this.Respuestass + '\n' + this.users;
            if (this.users[0].Estatus == '1') {
              // console.log(this.TipoBd);
              this.CargandoModal();
              this.storage.get('apisociosmart').then((apiSocioSmart) => {
                // console.log('CAMPANA:' + this.Campana1);
                if (
                  this.Campana1 == undefined ||
                  this.Campana1 == '' ||
                  this.Campana1 == null ||
                  this.Campana1 == 'null'
                ) {
                  this.Campana1 = 0;
                }
                // console.log('CAMPANA:' + this.Campana1);

                this.apirestService
                  .tablainsertar(data,this.empleado,this.TipoBd, apiSocioSmart,this.Campana1
                  )

                  .subscribe((data) => {
                    this.cargando = false;
                    this.users = data;
                    // console.log(this.users);
                    this.Respuestass = this.Respuestass + '\n' + this.users;
                    this.users = this.generateArray(data);
                    // console.log(this.users);
                    if (this.users) {
                      this.Estatus =
                        'Se registró la carga, informa al cliente que refresque su inicio para ver los puntos actualizados ';
                        if(this.route.snapshot.paramMap.get('Celular')){
                          this.Estatus =
                          'Se registró la carga, informa al cliente que refresque su inicio para ver los puntos actualizados, la app se cerrará en 7 segundos. ';
                          setTimeout(function(){
                            App.exitApp();
                        }, 7000);
                       // App.exitApp();
                        }
                        
                      this.ocultar3 = false;
                      this.ocultar4 = true;
                    }
                  });
              });
            } else {
              alert('No existe despachos en esta bomba con este # de cliente');
              this.Estatus = 'Verifica Los Valores y reintente de nuevo';
            }
            // console.log(this.users);
          }
        });
    });
  }

async CUPONES() {
  this.CargandoselectSORTEO = false;

  const cve_Ciudad = await this.storage.get('cve_Ciudad');

  const data = await this.apirestService.getcupones(cve_Ciudad, 1, this.SaldoPuntosActual);
  console.log('ya cargó los cupones');
  this.cuponeslist = this.generateArray(data);
  if (this.cuponeslist && this.cuponeslist.length > 0) {
    console.log(this.cuponeslist);
    this.Cargandoselect = true;
  } else {
    this.Cargandoselect = false;
    const alert2 = await this.alertCtrl.create({
      header: 'ATENCIÓN',
      message: 'No se cuentan con cupones disponibles para canje consulte más tarde.',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: (data) => {
            // Acción opcional al cerrar el alert
          },
        },
      ],
    });

    await alert2.present();
  }

  this.ocultarselectcupon = true;
}


  //CuponesAppNormales
  async Canjearcupon() {
    // console.log(this.valorselect); //nombre producto
    //this.costopuntos='';
    // this.costodinero=preciod;
    let alert = this.alertCtrl.create({
      header: 'AUTORIZACIÓN',
      message:
      new IonicSafeString(
        '<b>Cupón: </b>' +
        this.valorselect +
        '.<br><br><b>Precio Puntos:</b> ' +
        this.costopuntos +
        '.<br><b>Precio Efectivo: </b>' +
        this.costodinero +
        '<br><br>'),
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
              // console.log('login');
              
              this.storage.get('PV').then((pv) => {
                this.storage.get('usercve').then((usercve) => {
                  this.storage.get('contrakey').then((contrakey) => {
                    this.storage.get('userkey').then((userkey) => {
                      this.storage.get('UUID').then((UUID) => {
                        this.storage.get('cve_Ciudad').then((ciudad) => {
                          this.storage.get('Token').then((token) => {
                            var empleado = data.EMPLEADO;
                            this.storage.set('user', empleado);
                            this.CargandoModal();
                            // console.log(data.NIP);
                            // console.log('Cupon normal sin quemar');
                            this.apirestService
                              .postValeop(
                                pv,
                                this.Numero,
                                1,
                                this.gaming,
                                userkey,
                                token,
                                ciudad,
                                UUID,
                                data.EMPLEADO,
                                data.NIP
                              )
                              .subscribe(async (data) => {
                                
                                // console.log(data);
                                // console.log(data[0]['result']['Estatus']);
                                this.foliocanje = data[0]['result']['Folio'];
                                //var str=data[0].Mensaje
                                var Estado = data[0]['result']['Estatus'];
                                // console.log(Estado);
                                if (Estado == '1') {
                                  this.SaldoPuntosActual =
                                    this.SaldoPuntosActual - this.costopuntos;
                                  this.CargandoModal();
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
                                                                this.Numero,
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
  message:
                                      'Verificación de 3 digitos inválida',
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
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado                                    
 message: 'Operación inválida',
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
 message:
                                      'Punto De venta No tiene Permisos para Canjear, Reinicia App',
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

  onChangelista(){
    // console.log(this.cuponeslist);
    // console.log(this.gaming);
    var valor=null;
    var precio=null;
    var preciod=null;
    for (let index = 0; index < this.cuponeslist.length; index++) {
     if(this.cuponeslist[index].Cve_ProductoRedimir==this.gaming){
     valor=this.cuponeslist[index].NombreProducto;
     precio=this.cuponeslist[index].CostoDeRedencionPuntos;
     preciod=this.cuponeslist[index].CostoDeRedencionDinero;   
     }
    }
    this.valorselect=valor;
    this.costopuntos=precio;
    this.costodinero=preciod;
   
    }

    // onChangelistaCampania(){
    //   console.log(this.campanias[0].Nombre);
    //   this.CveCampania= this.Campana1.Cve;
    //   this.MultiplicadoPuntosCampania=this.campanias.Puntos;
    //   // console.log(this.campanias[this.Campania]);
    //   console.log("Campaña seleccionada: ", this.campanias.Nombre);
    //   console.log("Cve sorteo seleccionado: ",this.CveCampania);
    //   console.log("Multiplicador: ",this.MultiplicadoPuntosCampania);
      
    // }

    onChangelistaCampania(){
      console.log(this.Campana1);

      /*SOLO OCUPAS ESA CLAVE*/
      /*
   console.log(this.cuponeslist);
    console.log(this.gaming);
   var CveCampania=null;
    var Nombre=null;
    var Multip=null;
    for (let index = 0; index < this.campanias.length; index++) {
     if(this.campanias[index].Cve_ProductoRedimir==this.gaming){
      CveCampania=this.campanias[index].Cve;
     Nombre=this.campanias[index].Nombre;
     Multip=this.campanias[index].Puntos;   
     }
    }
    */
   /* this.valorselect=valor;
    this.costopuntos=precio;
    this.costodinero=preciod;
    */
  }

  
  async IniciaQr() { 
    
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      // the user granted permission    
      (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
     // alert(result.content);
      let scannedData = JSON.parse(result.content);
  
           var d = new Date().toISOString().slice(8, 10);
        console.log('D:' + d);
        this.scannerData=result.hasContent;
        var scannerData = this.scannerData;
        console.log('result.content:'+ result.content);
        console.log('result.hasContent:'+result.hasContent);
        console.log(' this.scannerData:'+ this.scannerData);
        console.log('scannerData:'+scannerData);

        scannerData = result.content.substring(10, 12);
        console.log('SCANNER:' + result.content);
        console.log('scannerData:'+scannerData);
        if (d == scannerData) {
          this.scannerData = result.content.substring(0, 10);
          console.log('SCANNER:' + this.scannerData );
          console.log('ABUSCAR:' + this.scannerData);
          this.Numero = this.scannerData;
          this.Numero2 = this.scannerData;
          var tokenn = await this.storage.get('Token');
          this.getUsers(this.scannerData, tokenn);
          this.validaigualdadnumero = true;
          this.ocultar1 = false;
          this.ocultar2 = true;
          this.ocultar3 = false;
          this.ocultar4 = false;
        } else {
          alert(
            'El codigo QR es invalido, solicitar a cliente ingresar sesion de nuevo en la app sociosmart y reintenta de nuevo'
          );
          this.reset();
        }
      this.ngZone.run(() => {
        this.gasPump = scannedData["gas_pump_id"];
       console.log(this.gasPump);
      });
    
      console.log(result.content);
      BarcodeScanner.showBackground();
BarcodeScanner.stopScan();
    }
  }else{
  const c = confirm('Debes permitir permisos en camara, serás redireccionado a los ajustes.');
  if (c) {
    BarcodeScanner.openAppSettings();
  }
  }
}



ionViewDidLeave(){
  this.gasPump="";
  (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');

  BarcodeScanner.showBackground();
  BarcodeScanner.stopScan();
}  
  
ngOnDestroy() {
  (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');

  this.gasPump="";
  BarcodeScanner.showBackground();
BarcodeScanner.stopScan();
}
}



