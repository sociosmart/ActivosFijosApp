import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ApirestService } from '../services/apirest.service';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home.page';
import { CargandoPage } from '../cargando/cargando.page';

@Component({
  selector: 'app-reciclaje',
  templateUrl: './reciclaje.page.html',
  styleUrls: ['./reciclaje.page.scss'],
})
export class ReciclajePage implements OnInit {
  PuntosRedimir:any;
  PuntosFeria:any;
  empleado:any;
  Nip:any;
  PuntosActuales:any;
  Cliente:any;
  alert:any;
  passwordTypeInput  =  'password';

  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public ApirestService: ApirestService, public storage: Storage) { }
  ngOnInit() {
    this.storage.create();
    
    console.log('ionViewDidLoad ReciclajePage');
    this.obtenerPuntosactuales();


    //this.PuntosActuales= '347.4';
  }
  
   async obtenerPuntosactuales(){
    this.storage.create();
     this.PuntosActuales = await this.storage.get('PuntosActuales');
    this.Cliente = await this.storage.get('Cliente');
    console.log("Puntos: ",this.PuntosActuales, "Cliente: ",this.Cliente);
  }

  CambioGramos(){
    this.PuntosFeria=parseFloat(this.PuntosActuales)-parseFloat(this.PuntosRedimir);
    if(this.PuntosFeria<=0){
      this.PuntosFeria=0;
    }
    this.PuntosFeria.toFixed(2);
   
  }
  LimpiaCampo(){
    this.PuntosRedimir='';
  }
  
  async reciclaje()
  {
    if(parseFloat(this.PuntosFeria)>=0 && (parseFloat(this.PuntosActuales)>=parseFloat(this.PuntosRedimir)) && (this.PuntosRedimir>0))
    {
      if(this.empleado && this.Nip)
        {
          
          console.log('Canjea');
          this.storage.get('PV').then((pv)=>{
            this.storage.get('Token').then((token) => {
              this.storage.get('userkey').then((userkey) => {
                this.storage.get('usercve').then((usercve)=>{  
          this.ApirestService.postCanjeReciclaje(pv,this.Cliente,this.PuntosRedimir,token,this.empleado,this.Nip,userkey,usercve)
          .subscribe(async data => {
           console.log(data);
           console.log(data[0]["Estatus"]);                     
           var Estado=data[0]["Estatus"];
           console.log(Estado);
           if(Estado=="1"){
            var Folio=data[0]["Fk"]
            var Despachador=data[0]["Despachador"]

            let nombreCliente = await this.storage.get('NombreCliente');


        this.ApirestService.ImprimirTicket(Folio,nombreCliente,this.PuntosRedimir,Despachador,this.Cliente)
      .then(data => {
       var users;
      users = data;   
      users=this.generateArray(data); 
      console.log(users)
      console.log('el cve es:'+users[0].Estatus);
      this.alert.dismiss();
      alert('Se Redimío correctamente');
            this.navCtrl.navigateRoot('/reciclaje');
            // Actualizar saldo al redireccionar
    alert('Se Redimío correctamente');
     this.storage.set('recienregistrado1', this.Cliente);
     this.storage.set('recienregistrado2', this.Cliente);
     this.storage.set("EstatusRegistro", false);
     this.navCtrl.navigateRoot('/home');


      }); 
           }else{
            // this.alert.dismiss();
            alert('Num. Empleado o nip incorrecto, Verifica y reintenta');
           }
          })})})})})
        }else{ 
          alert('Completa todos los campos');
        }
      }else{ 
        alert('El Minimo a canjear es 1');



    }
  
  }
  generateArray(obj: any) {
    return Object.keys(obj).map((key) => { return obj[key] });
  }
  
  
  changeQuantity(value: any){
    //manually launch change detection
    this.PuntosRedimir.detectChanges();
    if(value.indexOf('.') !== -1)
    {
      this.PuntosRedimir = value.substr(0, value.indexOf('.')+3);
    } else {
      this.PuntosRedimir = value.length > 4 ? value.substring(0,4) : value;
    }
  }
  
  CargandoModal() {
    // this.alert = this.modalCtrl.create(CargandoPage);
    // this.alert.present();
  }
  
  async volverahome(){
    await this.storage.set('recienregistrado1', this.Cliente);
    await this.storage.set('recienregistrado2', this.Cliente);
    await this.storage.set("EstatusRegistro", false);
    console.log("recienregistrado1: ", await this.storage.get('recienregistrado1'));
    console.log("EstatusRegistro: ",await this.storage.get('EstatusRegistro'));

    this.navCtrl.navigateRoot('/home');
  }



}
