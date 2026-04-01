import { Component } from '@angular/core';
import { ApirestService } from '../services/apirest.service';
import { AlertController, NavController ,IonicSafeString} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-detalle-carga-lealtad',
  templateUrl: './detalle-carga-lealtad.page.html',
  styleUrls: ['./detalle-carga-lealtad.page.scss'],
})

export class DetalleCargaLealtadPage  {

  Combustible:any;
  bomba:any;
  total:any;
  RecuperaDespacho:any;
  detalle:any;
  cont:any;
  cargando:any;
  interval:any;
  transaccionaux:any;
  monto:any;
  Despues30intentos:any;
  users:any;
  TipoCAntidadVolumenVal:any;
  selectedOption:any;
  Formasdepago:any;
  productoscanje:any;
  scannerData:any;
  foliocanje:any;
  vales:any;
  ImprimeTicket:any;

  dataSocioSmartPendiente :any;
  EmpleadoUser: any;
  apiSocioSmart: any;
  uuidToken: any;
  correoFact: any;
  enlaceFact: any;
    
  constructor(public apirestService: ApirestService,  private navCtrl: NavController,
    private graphqlService: GraphqlService, public storage: Storage,private alertCtrl: AlertController) { 

  }
  
  async ionViewWillEnter() {
    // this.Generaticket();
    this.storage.create();
    this.Traeformasdepago();
    this.Despues30intentos=false;
    this.cont=1;
    this.cargando=true;
    this.RecuperaDespacho=false;
    this.Combustible=localStorage.getItem('DebitoTipoCombustible');    
    this.bomba= await this.storage.get('DebitoBomba');
    this.monto=await this.storage.get('DebitoMonto');
    this.scannerData=await this.storage.get('NCliente');      
    this.TipoCAntidadVolumenVal=await this.storage.get('DebitoModalidad');
    this.total=0;
    console.log(this.Combustible);
    
    this.Recuperadespacho();
  }

  async Recuperadespacho(){
    const pv = await this.storage.get('PV');

    this.EmpleadoUser=await this.storage.get('EmpleadoUser');
    this.apiSocioSmart=await this.storage.get('host');

    const EmpleadoUser1=await this.storage.get('EmpleadoUser');
    const NCliente=await this.storage.get('NCliente');
    const apiSocioSmart1=await this.storage.get('host');
    const Hostgm=await this.storage.get('HostEstacion');
    const puntoventa=await this.storage.get('puntoventa');
    var ContDespues30intentos=0;
    this.cargando=true;
    this.RecuperaDespacho=false;    

    this.storage.get('puntoventa').then((val1) => {
      if(this.cont==1){
        const str = this.bomba;
        console.log(this.bomba);
        if(str<10){
          const newStr = str;
          this.bomba=newStr;       
        }
        console.log(this.bomba);
        this.cont=2;
      } 

      console.log('Obtengo despacho de posicion INICIAL');        
      this.apirestService.Vertabla(this.bomba, NCliente, val1)
        .then((data) => {
          console.log(data);
          this.transaccionaux=data[0];
          this.transaccionaux=this.transaccionaux['N_Transaccion']; 

          this.interval = setInterval(() => {
            console.log('Transaccion Base: '+this.transaccionaux+' Intento: '+ContDespues30intentos); 
            // Have some code to do something  

            console.log('Obtengo despacho de posicion: '+this.bomba+ ' en intervalos');      
            //this.bomba=3;  
            this.apirestService.Vertabla(this.bomba, NCliente, val1)
              .then((data2) => { 
                ContDespues30intentos=ContDespues30intentos+1;
                this.detalle=data2[0];
                console.log(this.detalle);

                if(this.transaccionaux!=this.detalle['N_Transaccion']){               
                  console.log('Pausado');      
                  
                  console.log('Guardo en el payload los datos para acumulación con Sociosmart');
                  
                  this.dataSocioSmartPendiente = this.generateArray(data2);
                  console.log(this.dataSocioSmartPendiente);

                  console.log("Empleado user", EmpleadoUser1);
                  console.log("api Socio Smart", apiSocioSmart1);

                  // console.log('Insertar aquí Acumulacion con Sociosmart');
                  // this.apirestService.tablainsertar(data2,EmpleadoUser,"2", apiSocioSmart,0)
                  //   .subscribe((data) => {
                  //     // this.cargando = false;
                  //     this.users = data;                                                                
                  //     this.users = this.generateArray(data);
                  //     console.log(this.users);
                  //     if (this.users) {
                  //       console.log('Se registró la carga, informa al cliente que refresque su inicio para ver los puntos actualizados ');
                  //     }
                  //   });
                      
                  console.log('Insertar aquí Acumulacion con Plan de lealtad');    
                  var producto='gas_regular';         
                  if(this.detalle['Id_Producto']=='445'){
                    producto='gas_premium';                    
                  }                
                  this.graphqlService.Acumulacion(NCliente,pv,this.detalle['Monto'],producto).subscribe(      
                    /*   this.graphqlService.Acumulacion('6681037335',pv,'400','gas_regular').subscribe(*/
                    (response) => {
                      console.log(response);              
                      if(response.data.accumulate){
                      console.log('Acumuló Plan de lealtad');
                      this.productoscanje=response.data.accumulate.benefits;
                      this.Generaticket();
                      console.log(response.data.accumulate.benefits);
                      }                  
                    }                  
                  );

                  console.log('Insertar aquí Si hay un premio extra por entregar');        
                  console.log(this.detalle);            
                  this.cargando=false;
                  this.RecuperaDespacho=true;
                  clearInterval(this.interval);
                  //  })
                }      
              });  
          }, 2000);  
        })  
    });      
  }

  async Generaticket(){
    let alert2 = this.alertCtrl.create({
      header: 'Ticket',
      backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
      keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado
      message:
        'Deseas generar ticket físico',
      buttons: [
        {
          text: 'Si',
          role: 'cancel',
          handler: (data) => {
            console.log('Cancel clicked');
            alert("Genera el ticket desde la app ticket de Gasomarshal");
            this.ImprimeTicket=true;
          },
        },
        {
          text: 'No',
          role: 'confirm',
          handler: (data) => {
          this.ImprimeTicket=false;
            console.log('Cancel clicked');
          },
        },
      ],
    });
    (await alert2).present();
  }

  generateArray(obj: any) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }
  
  async consultadespacho(){
    const NCliente=await this.storage.get('NCliente');
    const puntoventa=await this.storage.get('puntoventa');
      this.apirestService.Vertabla(this.bomba, NCliente, puntoventa)
    .then((data) => {        
    });    
  }

  private limpiarYSalir() {
    clearInterval(this.interval);
    this.storage.remove('DebitoTipoCombustible');    
    this.storage.remove('DebitoBomba');
    this.storage.remove('DebitoMonto');
    this.storage.remove('NCliente');      
    this.storage.remove('DebitoModalidad');
    this.navCtrl.navigateRoot('/login', { replaceUrl: true });
  }

  Finaliza(){
    if (this.dataSocioSmartPendiente) {
      // Combinar payload con uuid, correo y enlace
      const payloadSocioSmart = {
        ...this.dataSocioSmartPendiente[0],
        Token: this.uuidToken ?? null,
        Correo: this.correoFact ?? null,
        Enlace: this.enlaceFact ?? null
      };

      console.log("datos a acumular en SocioSmart:");
      console.table(payloadSocioSmart);

      this.ejecutarAcumulacionSocioSmart([payloadSocioSmart])
        ?.subscribe({
          next: (data) => {
            this.users = this.generateArray(data);
            console.log('Acumulación SocioSmart OK');
          },
          error: (err) => {
            console.error('Error Acumulación SocioSmart', err);
          },
          complete: () => {
            this.dataSocioSmartPendiente = null;
            this.limpiarYSalir();
          }
        });
    } else {
      this.limpiarYSalir();
    }
  }

  private ejecutarAcumulacionSocioSmart(data2: any) {
    /*
    if (!this.EmpleadoUser || !this.apiSocioSmart) {
      console.error('SocioSmart no inicializado');
      return null;
    }
    */
    console.log("Empleado acum user: ", this.EmpleadoUser);
    console.log("api sociosmart acum: ", this.apiSocioSmart);

    console.log('Insertar aquí Acumulacion con Sociosmart');

    return this.apirestService
    .tablainsertar(data2, this.EmpleadoUser, "2", this.apiSocioSmart, 0);
  }

  async CambioFormadePago() {
    if (this.selectedOption) {
      const Hostgm=await this.storage.get('HostEstacion');
      
      console.log('Acción ejecutada con:', this.selectedOption+' posicion: '+this.bomba);
      // Lógica de acción basada en la opción seleccionada        
      this.apirestService.CambiaFormaDePago(this.bomba,Hostgm,this.selectedOption)                
      .subscribe((data) => {  
        console.log(data);
        console.log(data.Estatus); 

        const ticket = data?.Data?.Ticket?.[0];

        console.log("token pr:", ticket?.token);
        
        // Obtener campos para acumulacion SocioSmart
        this.uuidToken  = ticket?.token;
        this.correoFact = ticket?.contacto;
        this.enlaceFact = ticket?.enlace;

        console.log('Token:', this.uuidToken);

        this.Finaliza();
        // console.log(data.Data.mensaje);
      });
    } else {
      console.log('Seleccione una opción antes de ejecutar la acción');
    }
  }
   
  async RedimirBeneficio($BeneficioId:any,$Estatus:any,RedimirBeneficio:any,benefitTicketId:any,index:any){
    console.log(benefitTicketId);
    if($Estatus=='1'){
      let alert = this.alertCtrl.create({
        header: 'Válidación de operador',
        backdropDismiss: false, // ⛔ No permite cerrar tocando fuera del alert
        keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado
        message:
        new IonicSafeString(
          '<br><b>Beneficio: </b><br>-'+RedimirBeneficio+       
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
                                      this.productoscanje.splice(index, 1); 
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
                    keyboardClose: false,   // ⛔ No se cierra automáticamente al cerrar el teclado   
                    message: 'Rellena los campos de autorización de operador',
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

  async Traeformasdepago(){
    const Hostgm=await this.storage.get('HostEstacion');
    this.apirestService.TraeFormaDePago(Hostgm)
    .then((data) => {
    console.log(data.Data);
    data=this.generateArray(data.Data);
    this.Formasdepago=data;
    const defaultOption = this.Formasdepago.find((FDP:any) => FDP.Cod === '1');
    if (defaultOption) {
      this.selectedOption = defaultOption.Cod;
    }
    });
  }

  quemabeneficiolealtad(benefitTicketId:any){
    console.log('Quemavale');
    this.graphqlService.RedimeBeneficio(this.scannerData,benefitTicketId).subscribe(
      (response) => {
        console.log(response.data.redemptionByPhone.message); 
        if(response.data.redemptionByPhone.message=='Redeemed'){    
        //  this.getBalance();
        }
        console.log('Se quemó Beneficio');
      }                  
    );
  }

  ngOnDestroy(){
    if (this.interval) {
      clearInterval(this.interval);
      console.log('Intervalo destruido en ngOnDestroy');
    }
  }

}
  
