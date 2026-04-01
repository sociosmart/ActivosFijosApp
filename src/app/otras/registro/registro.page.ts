import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import {
  ModalController,
  NavController,
  AlertController,
} from '@ionic/angular';
import { ApiResult, ApirestService } from '../services/apirest.service';
import { CargandoPage } from '../cargando/cargando.page';
import { Storage } from '@ionic/storage';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
emailInvalido: boolean = false;
empleadoInvalido: boolean = false;
nipInvalido: boolean = false;

  Cliente: any;
  email: any;
  empleado: any;
  Nip: any;
  contrasena: any;
  alert: any;
  passwordTypeInput = 'password';
  IpImpresora: any;
  estacion: any;
  version: any;
  Cuenta: any;
  configurado: any;
  NombreComercial: any;
  PuntosVerdes: any;
  respuestaimpresion: any;

  constructor(
    private apirest: ApirestService,
    private storage: Storage,
    private navCtrl: NavController,
    private alertCtrl: AlertController,  private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.storage.create();
    this.storage.get('configurado').then((configurado) => {
      this.configurado = configurado;
      if (configurado) {
        Device.getInfo().then((data) => {
          console.log(data.platform);
          var valorplataforma = data.platform.toString();

          // this.apiSociosmart = environment.baseUrl;
          //hay que meterle la URL default de enviroments en apisociosmart vvvv

          this.storage.get('PV').then((PV) => {
            this.storage.get('uuid').then((uuid) => {
              this.apirest
                .GetVersionActual(PV, '0.1.6', uuid)
                .subscribe((data1) => {
                  // this.Cuenta = data;
                  this.Cuenta = this.generateArray(data1);
                  console.log(this.Cuenta);
                  if (
                    this.Cuenta != null &&
                    this.Cuenta != '' &&
                    this.Cuenta != undefined &&
                    this.Cuenta[1].ValorReferencia != undefined
                  ) {
                    console.log(this.Cuenta);
                    if (valorplataforma == 'ios') {
                      // this.alert.dismiss();
                      if (this.Cuenta[1].ValorReferencia == '0.1.8') {
                        this.storage.set('sininternet', '0');
                        this.storage.set('Version', '0.1.8');
                        console.log(this.Cuenta[1].ValorReferencia);
                        this.storage.set(
                          'acerca',
                          this.Cuenta[1].ValorReferencia
                        );
                        this.storage.set(
                          'AcumulacionManual',
                          this.Cuenta[0].AcumulacionManual
                        );
                        this.storage.set(
                          'AcumulacionNormal',
                          this.Cuenta[0].AcumulacionNormal
                        );
                        this.storage.set(
                          'CanjeManual',
                          this.Cuenta[0].CanjeManual
                        );
                        this.storage.set(
                          'CanjeNormal',
                          this.Cuenta[0].CanjeNormal
                        );
                        this.storage.set(
                          'Preregistros',
                          this.Cuenta[0].Preregistros
                        );
                        this.storage.set(
                          'PuntosdeVentaCanje',
                          this.Cuenta[1].PuntosdeVentaCanje
                        );
                        this.NombreComercial = this.Cuenta[0].NombreComercial;
                        this.storage.set(
                          'PuntosVerdes',
                          this.Cuenta[0].CanjePuntosVerdes
                        );
                        this.PuntosVerdes = this.Cuenta[0].CanjePuntosVerdes;
                        this.storage.set(
                          'acerca',
                          this.Cuenta[1].ValorReferencia
                        );
                        this.version = 1;
                      } else {
                        this.version = 0;
                        // this.alert.dismiss();
                        alert('Existe una nueva versión por favor actualiza');
                        console.log(this.Cuenta[1].Enlace);
                        location.href = this.Cuenta[1].Enlace;
                      }
                    }
                    if (
                      valorplataforma == 'web' ||
                      valorplataforma == 'android'
                    ) {
                      console.log('version: ' + this.Cuenta[0].ValorReferencia);
                      if (
                        this.Cuenta[0].ValorReferencia == '0.1.7' ||
                        this.Cuenta[0].ValorReferencia == '0.1.7'
                      ) {
                        // this.alert.dismiss();
                        console.log('texto' + this.Cuenta[0].ValorReferencia);
                        this.storage.set('sininternet', '0');
                        this.storage.set('Version', '0.1.8');
                        this.storage.set(
                          'acerca',
                          this.Cuenta[0].ValorReferencia
                        );
                        this.storage.set(
                          'AcumulacionManual',
                          this.Cuenta[0].AcumulacionManual
                        );
                        this.storage.set(
                          'AcumulacionNormal',
                          this.Cuenta[0].AcumulacionNormal
                        );
                        this.storage.set(
                          'CanjeManual',
                          this.Cuenta[0].CanjeManual
                        );
                        this.storage.set(
                          'CanjeNormal',
                          this.Cuenta[0].CanjeNormal
                        );
                        this.storage.set(
                          'Preregistros',
                          this.Cuenta[0].Preregistros
                        );
                        this.storage.set(
                          'PuntosdeVentaCanje',
                          this.Cuenta[0].PuntosdeVentaCanje
                        );
                        this.NombreComercial = this.Cuenta[0].NombreComercial;
                        this.storage.set(
                          'PuntosVerdes',
                          this.Cuenta[0].CanjePuntosVerdes
                        );
                        this.PuntosVerdes = this.Cuenta[0].CanjePuntosVerdes;
                        console.log(this.PuntosVerdes);

                        this.version = 1;
                        this.storage.set('Inv-Titulo', this.Cuenta[0].Titulo);
                        this.storage.set('Inv-Qr', this.Cuenta[0].Qr);
                        this.storage.set('Inv-Mensaje', this.Cuenta[0].Mensaje);
                        this.storage.set('Inv-Footer', this.Cuenta[0].Footer);
                      } else {
                        this.version = 0;
                        this.alert.dismiss();

                        alert(
                          'Existe una nueva actualización, por favor acude con tu jefe de estación para llevar a cabo la actualización'
                        );

                        location.href = this.Cuenta[0].Enlace;
                      }
                    }
                    if (this.Cuenta[2].Valor == '1') {
                      this.modal(
                        this.Cuenta[2].img,
                        this.Cuenta[2].Estatus,
                        this.Cuenta[2].ValorReferencia
                      );
                    }
                  } else {
                    this.version = 0;
                    this.storage.set('sininternet', '1');
                    this.alert.dismiss();
                    alert('No se pudo conectar a la red');
                  }
                });
            });

            this.storage.get('IdEstacion').then((IdEstacion) => {
              this.storage.get('puntoventa').then((val1) => {
                this.storage.get('estacion').then((estacion) => {
                  this.storage.get('IpImpresora').then((IpImpresora) => {
                    this.estacion = estacion;
                    this.IpImpresora = IpImpresora;

                    console.log('Estacion guardada:' + IdEstacion);
                    console.log('Estacion Nombre guardada:' + estacion);
                    console.log('estacion:' + estacion);
                  });
                });
              });
            });
          });
        });
      } else {
        alert('No se encuentra configurada la app ');
        // this.Config();
      }
    });

    this.storage.get('NumeroARegistrar').then((NumeroARegistrar) => {
      /*SIII*/
      console.log('Numero a registrar:', NumeroARegistrar);
      this.Cliente = NumeroARegistrar;
    });
  }

  Concatena(domain: string) {
  if (!this.email) {
    this.email = '';
  }

  // Evitar agregar el dominio si ya está al final del email
  if (!this.email.endsWith(domain)) {
    this.email += domain;
  }

  // Validar el email actualizado
  this.emailInvalido = !this.validarEmail(this.email);
}
  async Registrar() {
  console.log('Registrar llamado');

  // Validar campos vacíos e inválidos
  this.emailInvalido = !this.email || !this.validarEmail(this.email);
  this.empleadoInvalido = !this.empleado || !this.validarEmpleado(this.empleado);
  this.nipInvalido = !this.Nip || !this.validarNip(this.Nip);

  if (this.emailInvalido || this.empleadoInvalido || this.nipInvalido) {
    let mensaje = 'Por favor completa correctamente los siguientes campos:\n';
    if (this.emailInvalido) mensaje += '- Correo electrónico válido\n';
    if (this.empleadoInvalido) mensaje += '- Número de empleado (mínimo 5 dígitos)\n';
    if (this.nipInvalido) mensaje += '- NIP (mínimo 5 dígitos)\n';

    const alert = await this.alertCtrl.create({
      header: 'Campos inválidos',
      message: mensaje,
      buttons: ['Aceptar'],
    });
    await alert.present();
    return;
  }

  // Validar que Cliente esté definido
  if (!this.Cliente) {
    const alert = await this.alertCtrl.create({
      header: 'Falta información',
      message: 'Captura de nuevo al cliente',
      buttons: ['Aceptar'],
    });
    await alert.present();
    return;
  }

  // Mostrar loader
  const loading = await this.loadingController.create({
    message: 'Registrando...',
    spinner: 'crescent'
  });
  await loading.present();

  this.contrasena = this.Cliente;
  const pv = await this.storage.get('PV');

  this.apirest.registro(this.Cliente, this.contrasena, this.email, this.empleado, this.Nip, pv)
    .subscribe({
      next: async (res: any) => {
        console.log(res[0].status);
        await loading.dismiss();
        if (res[0].status === 'error') {
          const alert = await this.alertCtrl.create({
            header: 'Error en el registro',
            message: res[0].result?.error_msg || 'Ocurrió un error desconocido.',
            buttons: ['Aceptar']
          });
          await alert.present();
          return;
        }

        // Registro exitoso
        this.GeneraImpresion();
        await this.storage.set('ocultar1', false);
        const isPre = await this.storage.get('PRE');
        if (isPre === true) {
          await this.storage.set('ocultar2', true);
          const numero = await this.storage.get('Numero');
          await this.storage.set('Nombre', numero);
        }
        await this.storage.set('ocultar2', true);
      },

      error: async (err) => {
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'Error de conexión',
          message: 'No se pudo conectar al servidor. Inténtalo más tarde.',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    });
}


validarEmpleado(empleado: any): boolean {
  // Validamos que tenga al menos 5 dígitos numéricos
  if (!empleado) return false;
  const str = empleado.toString();
  return /^\d{5,}$/.test(str);
} 

validarNip(nip: any): boolean {
  if (!nip) return false;
  const str = nip.toString();
  return /^\d{5,}$/.test(str); // mínimo 5 dígitos numéricos
}
  generateArray(obj: any) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  validarCambioEmail() {
  this.emailInvalido = !this.email || !this.validarEmail(this.email);
}

validarCambioEmpleado() {
  this.empleadoInvalido = !this.empleado || !this.validarEmpleado(this.empleado);
}

validarCambioNip() {
  this.nipInvalido = !this.Nip || this.Nip.trim().length === 0;
}


 async  CargandoModal() {
 const loading = await this.loadingController.create({
    message: 'Registrando...',
    spinner: 'crescent',
    duration: 2000
  });
  await loading.present(); // IMPORTANTE
  }

  async modal(Valor: any, Estatus: any, ValorReferencia: any) {
    var imagen = '';
    console.log(Valor);
    if (Estatus != '0') {
      if (Valor != null && Valor != '') {
        imagen = '<br> <br><img  src=' + Valor + ' width="100%" />';
      } else {
        imagen = '';
      }
      let alert = await this.alertCtrl.create({
        //title: 'Notificación',
        message: ValorReferencia + imagen,
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }

  validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async GeneraImpresion() {
  const loading = await this.loadingController.create({
    message: 'Generando impresión...',
    spinner: 'crescent'
  });
  await loading.present();

  try {
    const pv = await this.storage.get('PV');
    const PV1 = await this.storage.get('puntoventa');
    const IpImpresora = await this.storage.get('IpImpresora');
    const NombreImpresora = await this.storage.get('NombreImpresora');
    const Puerto = await this.storage.get('Puerto');
    const TipoImpresora = await this.storage.get('TipoImpresora');
    const host = await this.storage.get('host');
    const GRUPO = await this.storage.get('GRUPO');

    this.Cuenta[0].Titulo = this.Cuenta[0].Titulo.replace('\\n', '\n');
    this.Cuenta[0].Qr = this.Cuenta[0].Qr.replace('//', '//');

    if (GRUPO != '54') {
      // Tachna
      this.apirest.ticketInvitacion(
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
      ).subscribe(async () => {
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'Impresión de ticket',
          message: 'Se registró el cliente, su contraseña será su mismo número de teléfono',
          buttons: [{
            text: 'Aceptar',
            role: 'cancel',
            handler: () => this.navCtrl.navigateRoot('/login')
          }]
        });
        await alert.present();
      });
    } else {
      // Escoserra
      const splitr = PV1.split('/');
      console.log('puntoventa:' + splitr[1]);

      this.Cuenta[0].Mensaje ??= 'null';
      this.Cuenta[0].Titulo ??= 'null';
      this.Cuenta[0].Qr ??= 'null';
      this.Cuenta[0].Footer ??= 'null';

      this.apirest.ticketInvitacionEs(
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
      ).subscribe(async (dataa) => {
        await loading.dismiss();

        this.respuestaimpresion = this.generateArray(dataa);
        console.log(this.respuestaimpresion[0]['Mensaje']);

        if (this.respuestaimpresion[0]['Estatus'] == 1) {
          const alert = await this.alertCtrl.create({
            header: 'Impresión de ticket',
            message: 'Se envió impresión de ticket',
            buttons: [{
              text: 'ACEPTAR',
              handler: async () => {
                const numero = await this.storage.get('NumeroARegistrar');
                await this.storage.set('recienregistrado1', numero);
                await this.storage.set('recienregistrado2', numero);
                await this.storage.set('EstatusRegistro', false);
                this.navCtrl.navigateRoot('/home');
              }
            }]
          });
          await alert.present();
        }
      });
    }
  } catch (error) {
    await loading.dismiss();
    console.error('Error en GeneraImpresion:', error);
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Ocurrió un error inesperado al generar la impresión.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}

  BorrarNumeroARegistrar(){
    this.storage.remove('NumeroARegistrar');
    this.storage.set("EstatusRegistro", true);
    console.log("Numero a preregistrar borrado");
  };
}
