import { Component } from '@angular/core';
import { ApirestService } from '../services/apirest.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-detalle-carga',
  templateUrl: './detalle-carga.page.html',
  styleUrls: ['./detalle-carga.page.scss'],
})
export class DetalleCargaPage  {
  Combustible:any;
  bomba:any;
  total:any;
  RecuperaDespacho:any;
  detalle:any;
  cargando:any;
  interval:any;
  transaccionaux:any;
  monto:any;
  iddebito:any;
  constructor(public apirestService: ApirestService,  private navCtrl: NavController,
    
    // public scanner:BarcodeScanner,
    public storage: Storage) { 
     
    }

  async ionViewWillEnter() {
    this.storage.create();
    this.cargando=true;
    this.RecuperaDespacho=false;
    this.Combustible=localStorage.getItem('DebitoTipoCombustible');
    this.bomba=localStorage.getItem('DebitoBomba');
    this.monto=localStorage.getItem('DebitoMonto');
    this.iddebito=localStorage.getItem('iddebito');
    this.total=0;
    console.log(this.Combustible);
   
    this.Recuperadespacho();
  }
  async Recuperadespacho(){
    const Hostgm=await this.storage.get('HostEstacion');
    this.cargando=true; 
      // console.log(this.NoBomba, this.Numero, val1);
      this.storage.get('puntoventa').then((val1) => {
        const str = this.bomba;
        console.log(this.bomba);
        if(str<10){
        const newStr = str.slice(1);
        this.bomba=newStr;       
      }
      console.log(this.bomba);              
        this.apirestService.Vertabla(this.bomba, '123', val1)
    .then((data) => {
       console.log(data[0]);
      // this.cargando=false;
        this.transaccionaux=data[0];
       //console.log(this.detalle);
       this.transaccionaux=this.transaccionaux['N_Transaccion'];   
       this.interval = setInterval(() => {
          // Have some code to do something          
       this.apirestService.Vertabla(this.bomba, '123', val1)
       .then((data) => {       
        this.detalle=data[0];
        console.log(this.detalle);   
        console.log('Monto'+this.detalle['Monto']);   
          if(this.transaccionaux!=this.detalle['N_Transaccion']){ 
            console.log('Pausado');
            console.log('Insertar aquí Cambio de Forma de pago');
            clearInterval(this.interval);
            /* let body: any = {
              "amount_charged": parseFloat(this.detalle['Monto']),
              "type": "served",                           
                          };*/           
                          this.apirestService
                            .QuemaPayment(this.iddebito,parseFloat(this.detalle['Monto']))
                              .pipe(
                                              catchError((err) => {
                                                console.log('error', err);
                                                if (err.status == 500) {
                                                  alert(
                                                    'Error al quemar saldo en centa sociosmart, por favor contacta a un supervisor para escalar este problema. id:'+this.iddebito
                                                  );
                                                } else if (err.status == 401) {
                                                  //alert('Usted no tiene permisos para prefijar esta bomba');
                                                } else if (err.status == 402) {
                                                 // alert('Saldo insuficiente');
                                                } else if (err.status == 404) {
                                                  
                                                 // alert('Bomba no encontrada');
                                                 // alert('Bomba Capturada: '+this.Bomba);
                                                } else if (err.status == 406) {
                                               //   alert('No se puede prefijar este tipo de combustible en esta bomba');
                                                } else if (err.status == 409) {
                                                  //alert('Esta tarjeta de regalo esta siendo usada.');
                                                } else {
                                                 // alert('Error en el servidor o internet intermitente.');
                                                }
                                                this.cargando = false;
                                                throw err;
                                              })
                                            )
                                            .subscribe((data) => {
                                              console.log('data de insersión', data);                                          
                                            });
          

            this.apirestService.CambiaFormaDePago(this.bomba,Hostgm,'6')                
            .subscribe((data) => {  
              console.log(data);
             console.log(data.Estatus); 
            // this.Finaliza();
             // console.log(data.Data.mensaje);
            });
            console.log(this.detalle);            
            this.cargando=false;
            this.RecuperaDespacho=true;
           
          }
        });
        }, 3000);

        })
    });

      
      
  }
  async consultadespacho(){
    this.storage.get('puntoventa').then((val1) => {
     this.apirestService.Vertabla(this.bomba, '123', val1)
    .then((data) => {
      
    });
  });
  
  }
  Finaliza(){
    clearInterval(this.interval);
    localStorage.removeItem('DebitoTipoCombustible');
    localStorage.removeItem('DebitoBomba');
    localStorage.removeItem('DebitoMonto');
    localStorage.removeItem('iddebito');
    this.navCtrl.navigateRoot('/login', { replaceUrl: true });
  }
  ionViewDidLeave() {
    clearInterval(this.interval);
    console.log('Home page did leave');
  }
  ionViewWillLeave() {
    if (this.interval) {
      clearInterval(this.interval);
      console.log('Intervalo detenido en ionViewWillLeave');
    }
  }
  ngOnDestroy(){
    if (this.interval) {
      clearInterval(this.interval);
      console.log('Intervalo destruido en ngOnDestroy');
    }
  }
  
   
}
