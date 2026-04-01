import { Component, Host, OnInit } from '@angular/core';
import { NavController,AlertController } from '@ionic/angular';
import { ApirestService} from '../services/apirest.service'
import { Device } from '@capacitor/device';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  estacion : any;
  IpImpresora : any;
  apiSociosmart : any;
  configurado:any;
  cont:number=0;
  alert:any;
  Cuenta:any;
  intervalo:any;
  version:any;
  PuntosVerdes:any;
  apisociosmart:any;
  NombreComercial:any;
  config:boolean=false;
  respuestaimpresion:any;
  contadorClear: number=0;
  EstadoPrepago:any;
  toastController: any;
  
  constructor(private toastCtrl: ToastController, private http: HttpClient, private navctrl:NavController,private storage: Storage, private ApirestService: ApirestService,private alertCtrl: AlertController) {

  }
  
  async ngOnInit() {    
    this.storage.create();
    try {
    const data1 = await this.ApirestService.Validaservicio();
    console.log(data1);
    if(data1!='Activo'){
    this.alert( 'Error al validar servicio sociosmart, validar si no hubo campos en pc o cambios en red');
    this.configurado=false;
  }else{
  
    //const celular= await this.storage.get('recienregistrado1');
    //this.alert(celular);   
    this.BorrarNumeroARegistrar();
    this.storage.get('configurado').then(configurado => {
      this.configurado=configurado;
      if (configurado ){
      Device.getInfo().then(data => {
        console.log(data.platform);
        var valorplataforma = data.platform.toString();
        // this.apiSociosmart = environment.baseUrl;
        //hay que meterle la URL default de enviroments en apisociosmart vvvv
        
        this.storage.get('PV').then(PV => {   
          this.storage.get('uuid').then(uuid => { 
            this.ApirestService.GetVersionActual(PV,'0.1.6', uuid).subscribe(
              (data1) => {    
      // this.Cuenta = data;
      this.Cuenta= this.generateArray(data1);
  console.log(this.Cuenta);
  if(this.Cuenta!=null && this.Cuenta!="" && this.Cuenta!=undefined &&  this.Cuenta[1].ValorReferencia != undefined){
    console.log(this.Cuenta);              
    if (valorplataforma == 'ios') {
      // this.alert.dismiss();
      if(this.Cuenta[1].ValorReferencia=='0.1.8'){
        this.storage.set('sininternet', "0");
        this.storage.set('Version', "0.1.8");
        console.log(this.Cuenta[1].ValorReferencia);        
        this.storage.set('acerca', this.Cuenta[1].ValorReferencia);
        this.storage.set('AcumulacionManual', this.Cuenta[0].AcumulacionManual);
          this.storage.set('AcumulacionNormal', this.Cuenta[0].AcumulacionNormal);
          this.storage.set('CanjeManual', this.Cuenta[0].CanjeManual);
          this.storage.set('CanjeNormal', this.Cuenta[0].CanjeNormal);
          this.storage.set('Preregistros', this.Cuenta[0].Preregistros);
          this.storage.set('PuntosdeVentaCanje', this.Cuenta[1].PuntosdeVentaCanje);
          this.NombreComercial=this.Cuenta[0].NombreComercial;
          this.storage.set('PuntosVerdes', this.Cuenta[0].CanjePuntosVerdes); 
          this.PuntosVerdes=this.Cuenta[0].CanjePuntosVerdes;            
          this.storage.set('acerca', this.Cuenta[1].ValorReferencia);    
          // this.storage.set('Estadoprepago', this.Cuenta[3].Descripcion); 
           console.log('descr'+this.Cuenta[3].Descripcion);
            console.log('valor'+this.Cuenta[3].Valor);
            this.storage.set('Estadoprepago', this.Cuenta[3].Valor); 
            this.EstadoPrepago=this.Cuenta[3].Valor;                    
          this.version=1;
        }else{
          this.version=0;
          // this.alert.dismiss(); 
          alert("Existe una nueva versión por favor actualiza");
          console.log(this.Cuenta[1].Enlace);
          location.href =this.Cuenta[1].Enlace;                    
        }
      }        
      if(valorplataforma == 'web'|| valorplataforma == 'android'){
        console.log('version: '+this.Cuenta[0].ValorReferencia);
        if(this.Cuenta[0].ValorReferencia=='0.1.7' || this.Cuenta[0].ValorReferencia=='0.1.7'){
          // this.alert.dismiss();
          console.log('texto'+this.Cuenta[0].ValorReferencia);
          this.storage.set('sininternet', "0");
          this.storage.set('Version', "0.1.8");
          this.storage.set('acerca', this.Cuenta[0].ValorReferencia);               
          this.storage.set('AcumulacionManual', this.Cuenta[0].AcumulacionManual);
          this.storage.set('AcumulacionNormal', this.Cuenta[0].AcumulacionNormal);
          this.storage.set('CanjeManual', this.Cuenta[0].CanjeManual);
          this.storage.set('CanjeNormal', this.Cuenta[0].CanjeNormal);
          this.storage.set('Preregistros', this.Cuenta[0].Preregistros);
          this.storage.set('PuntosdeVentaCanje', this.Cuenta[0].PuntosdeVentaCanje);   
          this.NombreComercial=  this.Cuenta[0].NombreComercial;  
          this.storage.set('PuntosVerdes', this.Cuenta[0].CanjePuntosVerdes); 
          this.PuntosVerdes=this.Cuenta[0].CanjePuntosVerdes;
          console.log( this.PuntosVerdes);  

          this.version=1;
          this.storage.set('Inv-Titulo',this.Cuenta[0].Titulo);
          this.storage.set('Inv-Qr',this.Cuenta[0].Qr);
          this.storage.set('Inv-Mensaje',this.Cuenta[0].Mensaje); 
          this.storage.set('Inv-Footer',this.Cuenta[0].Footer);
           // this.storage.set('Estadoprepago', this.Cuenta[3].Descripcion); 
           console.log('descr'+this.Cuenta[3].Descripcion);
            console.log('valor'+this.Cuenta[3].Valor);
            this.storage.set('Estadoprepago', this.Cuenta[3].Valor);  
            this.EstadoPrepago=this.Cuenta[3].Valor;    
        }else{
          this.version=0;
          this.alert.dismiss();
          
          alert("Existe una nueva actualización, por favor acude con tu jefe de estación para llevar a cabo la actualización");
          
          location.href =this.Cuenta[0].Enlace;
          
        }         
      }
      if(this.Cuenta[2].Valor=="1"){
        this.modal(this.Cuenta[2].img,this.Cuenta[2].Estatus,this.Cuenta[2].ValorReferencia);
      }
      
    }else{
      this.version=0;
      this.storage.set('sininternet', "1");
      this.alert.dismiss();
      alert("No se pudo conectar a la red");     }  
      
      
      
      
  
    });
  
  });
  
  
  this.storage.get('IdEstacion').then((IdEstacion) => {
    this.storage.get('puntoventa').then((val1) => {
      this.storage.get('estacion').then((estacion) => {
        this.storage.get('IpImpresora').then((IpImpresora) => {
          this.estacion = estacion;
          this.IpImpresora = IpImpresora;
          
          console.log('Estacion guardada:'+IdEstacion);
          console.log('Estacion Nombre guardada:'+estacion);
          console.log('estacion:'+estacion);
          
        });
        
      });
});
  });  
  }); 
});
} else {
  alert("No se encuentra configurada la app ");
  this.Config();
}
});

  }
  } catch (error) {
    this.configurado=false;
    alert('Error al validar servicio sociosmart, validar si no hubo campos en pc o cambios en red');
  }
}
//Termina el ngOnInit
CargarDeCombustible(){  
  console.log('Redirecciona a cargar combustible');
  this.validacion();
 
}
  Home(){
    // console.log('Entra a host method');
    //this.navctrl.navigateForward('/host');
    //this.navctrl.navigateBack('/host');
    this.navctrl.navigateRoot('/home');
  }
  Config(){
    console.log('Entra a host method');
    //this.navctrl.navigateForward('/host');
    //this.navctrl.navigateBack('/host');
    this.navctrl.navigateRoot('/config');
  }
  async Clear(){
    console.log('Se limpió el storage');
    this.contadorClear=0;
    await this.storage.clear();

  }

  generateArray(obj:any) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }
  
  async modal(Valor:any,Estatus:any,ValorReferencia:any){
    var imagen="";
        console.log(Valor);
        if(Estatus!="0"){
       if(Valor!=null && Valor!="")
       {
      imagen='<br> <br><img  src='+Valor+' width="100%" />';
       }else{
         imagen="";
       }
      let alert = await this.alertCtrl.create({
        //title: 'Notificación',
        message:ValorReferencia+imagen,
        buttons: ['Aceptar']
      });
      await alert.present();
    }
    }

async validacion(){
  this.navctrl.navigateRoot('/cargacombustible');
/*
  console.log('ee');   
        let alert2 = this.alertCtrl.create({
          header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado          message: 'Ingresa la contraseña exclusiva para testeo',
             inputs: [
            
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
              text: 'CONFIRMAR',
              handler: async data => {   
               
                if(data.NIP3=='2025'){ 
                  this.navctrl.navigateRoot('/cargacombustible');
                  }else{
                    alert('Contraseña incorrecta, modulo solo disponible para testing');                  
                 
                    
                  }}
        }]});
        (await alert2).present();
      */
}

Rasca(){
  alert('Esto es solo una prueba de componentes, no tiene validez');
  this.navctrl.navigateForward('/rasca-ygana');
}
async Lealtad(){
  this.navctrl.navigateForward('/lealtad');
  /*
  let alert2 = this.alertCtrl.create({
    header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado    message: 'Ingresa la contraseña exclusiva para testeo',
       inputs: [
      
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
        text: 'CONFIRMAR',
        handler: async data => {   
         
          if(data.NIP3=='2025'){ 
            this.navctrl.navigateForward('/lealtad');
            }else{
              alert('Contraseña incorrecta, modulo solo disponible para testing');                  
           
              
            }}
  }]});
  (await alert2).present();
  */
 
}
      async GeneraImpresion() {
  console.log('Genera Impresion');

  // Pedir número de impresiones con un alert input
  const alert = await this.alertCtrl.create({
    header: 'Número de impresiones',
    inputs: [
      {
        name: 'copias',
        type: 'number',
        min: 1,
        max: 50,
        value: 10,
        placeholder: 'Ingresa cuántas copias imprimir',
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Enviar',
        handler: (data) => {
          const numCopias = parseInt(data.copias, 10);
          if (!numCopias || numCopias < 1) {
            // Si no es válido, no hacemos nada o mostramos error
            this.presentToast('Por favor ingresa un número válido de copias.');
            return false; // Evita cerrar el alert
          } else {
            this.imprimirNVeces(numCopias);
            return true; // Cierra el alert
          }
        },
      },
    ],
  });

  await alert.present();
}

// Función para imprimir N veces
imprimirNVeces(numCopias: number) {
  this.storage.get('PV').then((pv) => {
    this.storage.get('puntoventa').then((PV1) => {
      this.storage.get('IpImpresora').then((IpImpresora) => {
        this.storage.get('NombreImpresora').then((NombreImpresora) => {
          this.storage.get('Puerto').then((Puerto) => {
            this.storage.get('TipoImpresora').then((TipoImpresora) => {
              this.storage.get('host').then((host) => {
                this.storage.get('GRUPO').then(async (GRUPO) => {
                  this.Cuenta[0].Titulo = this.Cuenta[0].Titulo.replace('\\n', '\n');
                  this.Cuenta[0].Qr = this.Cuenta[0].Qr.replace('\/\/', '//');

                  for (let i = 0; i < numCopias; i++) {
                    if (GRUPO != '54') {
                      await this.ApirestService
                        .ticketInvitacion(
                          pv,
                          IpImpresora,
                          NombreImpresora,
                          host,
                          TipoImpresora,
                          Puerto,
                          PV1,
                          this.Cuenta[0].Titulo,
                          this.Cuenta[0].Qr,
                          this.Cuenta[0].Mensaje,
                          this.Cuenta[0].Footer
                        )
                        .toPromise();
                    } else {
                      var splitr = PV1.split(['/']);
                      if (this.Cuenta[0].Mensaje == null) this.Cuenta[0].Mensaje = 'null';
                      if (this.Cuenta[0].Titulo == null) this.Cuenta[0].Titulo = 'null';
                      if (this.Cuenta[0].Qr == null) this.Cuenta[0].Qr = 'null';
                      if (this.Cuenta[0].Footer == null) this.Cuenta[0].Footer = 'null';

                      await this.ApirestService
                        .ticketInvitacionEs(
                          pv,
                          IpImpresora,
                          NombreImpresora,
                          host,
                          TipoImpresora,
                          Puerto,
                          PV1,
                          this.Cuenta[0].Titulo,
                          this.Cuenta[0].Qr,
                          this.Cuenta[0].Mensaje,
                          this.Cuenta[0].Footer
                        )
                        .toPromise();
                    }
                  }

                  // Mostrar alerta de confirmación al final
                  this.alertCtrl
                    .create({
                      header: 'Impresión de ticket',
                      message: `Se enviaron ${numCopias} impresión(es) de ticket.`,
                      buttons: ['OK'],
                    })
                    .then((alert) => alert.present());
                });
              });
            });
          });
        });
      });
    });
  });
}

// Método para mostrar toast (opcional)
async presentToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 2000,
    position: 'bottom',
  });
  await toast.present();
}

    reimpresion(){
      this.navctrl.navigateForward('/reimpresion');
    }

    BorrarNumeroARegistrar(){
      this.storage.remove('NumeroARegistrar');
      this.storage.remove('NoBomba');
      this.storage.set("EstatusRegistro", true);
      console.log("Numero a preregistrar borrado");
    }
    ClearOn(){
    this.contadorClear = this.contadorClear + 1;
    console.log(this.contadorClear);
    }
  }
  
