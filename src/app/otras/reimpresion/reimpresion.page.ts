import { Component, OnInit } from '@angular/core';
import { ApirestService } from '../services/apirest.service';
import { NavController,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'





@Component({
  selector: 'app-reimpresion',
  templateUrl: './reimpresion.page.html',
  styleUrls: ['./reimpresion.page.scss'],
})
export class ReimpresionPage implements OnInit {
  vales:any;
  grupo:any;
  shownGroup:any;
  valesi:any;

  constructor(private navctrl:NavController, public apirestService: ApirestService, private storage: Storage, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.storage.create();
    console.log('ionViewDidLoad ReimpresionPage');
    this.storage.get('PV').then((pv) => {
    this.apirestService.getValepv(pv)
    .then(data => {     
      this.vales = data;
      this.vales=this.generateArray(data);
      console.log(this.vales);});
    });
  }

  async Reimpresion(Detalle: any)
  {
    let pv = await this.storage.get('PV');
    let IpImpresora = await this.storage.get('IpImpresora');
    let PV = await this.storage.get('puntoventa');
    let NombreImpresora = await this.storage.get('NombreImpresora');
    let Puerto = await this.storage.get('Puerto');
    let TipoImpresora = await this.storage.get('TipoImpresora');
    let host = await this.storage.get('host');
    let grupo = await this.storage.get('GRUPO');
        console.log(Detalle.FolioRedencion);       
    this.valesi=Detalle;
    
  console.log(grupo);
    if(grupo=='48'){//ControlGas  Gasomarshal
      let result = JSON.stringify([{          
        "Ap_Materno":this.valesi["Ap_Materno"],
        "Ap_Paterno":this.valesi["Ap_Paterno"],
        "Articulo":this.valesi["Articulo"],
        "Cantidad":this.valesi["Cantidad"],
        "Direccion":this.valesi["Direccion"],
        "Estatus":this.valesi["Estatus"],
        "FK_Cve_Cliente":this.valesi["FK_Cve_Cliente"],
        "F_Expiracion":this.valesi["F_Expiracion"],
        "Folio":this.valesi["Folio"],
        "FolioRedencion":this.valesi["FolioRedencion"],
        "H_Expiracion":this.valesi["H_Expiracion"],
        "ImportePesos":this.valesi["ImportePesos"],
        "ImportePuntos":this.valesi["ImportePuntos"],
        "Nombre":this.valesi["Nombre"],
        "NombreFotografia":this.valesi["NombreFotografia"],
        "NombreProducto":this.valesi["NombreProducto"],
        "Telefono":this.valesi["Telefono"],
        "TotalVale":this.valesi["TotalVale"],
        "checked": false
        }])

this.valesi=result;

      this.reimpresion1(Detalle.FK_Cve_Cliente,this.valesi,Detalle.FolioRedencion,pv,2,IpImpresora,NombreImpresora,host,TipoImpresora,Puerto,PV)
  
              }else{//Radec
                console.log("Es radec Impresion");
                console.log(this.valesi);
                console.log('Cliente: '+Detalle.FK_Cve_Cliente);
                console.log('FolioRedencion: '+Detalle.FolioRedencion);
                console.log('pv: '+pv);
                this.reimpresionEscoserra(this.valesi,Detalle.FK_Cve_Cliente,Detalle.FolioRedencion,pv,2,IpImpresora,NombreImpresora,host,TipoImpresora,Puerto,PV)
              
    console.log(Detalle);
  }
}



  toggleGroup(group: any) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };

  async reimpresion1($1: any, $2: any, $3: any, $4: any, $5: any, IpImpresora: any, NombreImpresora: any, host: any, tipo: any, puerto: any, PV: any ){
    

    this.apirestService.ticket($1,$2,$3,$4,$5,IpImpresora,NombreImpresora,host,tipo,puerto,PV).subscribe(data => {   
    
     });
  
     let alert = this.alertCtrl.create({
      header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false, // ⛔ No se cierra automáticamente al cerrar el teclado      
 message: 'REIMPRIMIR DE NUEVO',
      buttons: [
        {
          text: 'CERRAR',
          role: 'cancel',
          handler: () => {
            this.navctrl.navigateRoot('/login');
          }
        },
        {
          text: 'ACEPTAR',
          handler: () => {
           this.reimpresion1($1,$2,$3,$4,$5,IpImpresora,NombreImpresora,host,tipo,puerto,PV);
          }
        }
      ]
    });
    (await alert).present();
  }


  async reimpresionEscoserra($body: any, $cliente: any, $foliovale: any, $pv: any, IpImpresora: any, tipoticket: any, NombreImpresora: any, host: any, tipo: any, puerto: any, PV: any ){



    this.apirestService.reimpresionticketEscoserra($body,$cliente,$foliovale,$pv,tipoticket,IpImpresora,NombreImpresora,host,tipo,puerto,PV).subscribe(data => {   
    
     });
  
     let alert = this.alertCtrl.create({
      header: 'ATENCIÓN',
 backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
 keyboardClose: false,     // ⛔ No se cierra automáticamente al cerrar el teclado      
 message: 'REIMPRIMIR DE NUEVO',
      buttons: [
        {
          text: 'CERRAR',
          role: 'cancel',
          handler: () => {
            this.navctrl.navigateRoot('/login');
          }
        },
        {
          text: 'ACEPTAR',
          handler: () => {
           this.reimpresionEscoserra($body,$cliente,$foliovale,$pv,tipoticket,IpImpresora,NombreImpresora,host,tipo,puerto,PV);
          }
        }
      ]
    });
    (await alert).present();

  }

  
  isGroupShown(group: any) {
    return this.shownGroup === group;
  };
  generateArray(obj: any) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }

}
