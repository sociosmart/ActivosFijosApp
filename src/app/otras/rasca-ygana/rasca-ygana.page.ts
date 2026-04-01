import { Component, OnInit } from '@angular/core';
import Hammer from 'hammerjs';
import { GraphqlService } from 'src/app/services/graphql.service';
import { ApirestService } from '../services/apirest.service';
import { catchError } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-rasca-ygana',
  templateUrl: './rasca-ygana.page.html',
  styleUrls: ['./rasca-ygana.page.scss'],
})
export class RascaYGanaPage  {
  email = '';
  password = '';
  nombre:any;
  nivel:any;
  public maxIntentos = 3; // Máximo de intentos
  public intentos = 0; // Contador de intentos
  private revelado = false; // Estado para saber si se ha revelado el premio
  private scratchCanvas!: HTMLCanvasElement;
  private premioCanvas!: HTMLCanvasElement;
  private ctxScratch!: CanvasRenderingContext2D;
  private ctxPremio!: CanvasRenderingContext2D;
  private premioDiv!: HTMLElement;

  // Lista de premios
  private premios: { texto: string, esGanador: boolean }[] = [
    { texto: '¡Felicidades! Ganaste un coche.', esGanador: false },
    { texto: '¡Genial! Has ganado una cena ', esGanador: false },
  ];

  // Margen configurable de perder (70% de probabilidades de perder por defecto)
  private margenPerder = 50;

  constructor(private graphqlService: GraphqlService,public apirestService: ApirestService,public storage: Storage) { }

  async ionViewWillEnter() {
  this.storage.create();
    /*  const Hostgm= await this.storage.get('HostEstacion');
                          this.apirestService.EstatusBomba('3',Hostgm)                
                            .subscribe((data) => {  
                              console.log(data);
                              if(data.Estatus==0){
                                alert(data);
                              }
                            });*/
/*
    this.scratchCanvas = document.getElementById('scratchCanvas') as HTMLCanvasElement;
    this.premioCanvas = document.getElementById('premioCanvas') as HTMLCanvasElement;
    this.ctxScratch = this.scratchCanvas.getContext('2d')!;
    this.ctxPremio = this.premioCanvas.getContext('2d')!;
    this.premioDiv = document.getElementById('premio')!;
    this.inicializarJuego();
    this.configurarHammer();
    
    var producto='gas_regular';         

      this.graphqlService.Acumulacion('6681037336','88','10',producto).subscribe(
        (response) => {
          console.log(response);              
       if(response.data.accumulate){
        console.log('Acumula');
       }
        });

                                  this.apirestService 
                                    .QuemaPayment('79c993a0-7197-4459-bca8-d9a5f446fe74',10)
                                      .pipe(
                                                      catchError((err) => {
                                                        console.log('error', err);
                                                        if (err.status == 500) {
                                                          alert(
                                                            'Error al quemar saldo en centa sociosmart, por favor contacta a un supervisor para escalar este problema.'
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
                                                        //this.cargando = false;
                                                        throw err;
                                                      })
                                                    )
                                                    .subscribe((data) => {
                                                      console.log('data de insersión', data);                                          
                                                    });
            
                                                    */
                                                   
                        this.storage.create();
                        const Hostgm= await this.storage.get('HostEstacion');
                          this.apirestService.EstatusBomba('1',Hostgm)                
                            .subscribe((data) => {  
                              console.log(data);
                              if(data.Estatus==0){
                                alert(data);
                              }
                            }
                          );
  }

  login() {
    this.graphqlService.ObtenerClienteFrecuente('6681037336').subscribe(
      (response) => {
        this.nombre=response.data.customerLevelByPhone.customer.name;
        this.nivel=response.data.customerLevelByPhone.level.name;
        console.log(response);
      },
      (error) => {
        console.error('Error en la autenticación:', error);
      }
    );
  }



  inicializarScratchCanvas() {
    this.ctxScratch.fillStyle = '#CCCCCC';
    this.ctxScratch.fillRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);
    this.ctxScratch.font = '20px Arial';
    this.ctxScratch.fillStyle = '#000';
    this.ctxScratch.fillText('¡Rasca aquí!', 90, 80);
  }

  inicializarPremioCanvas(premio: string) {
    this.ctxPremio.clearRect(0, 0, this.premioCanvas.width, this.premioCanvas.height);
    this.ctxPremio.font = '20px Arial';
    this.ctxPremio.fillStyle = '#000';
    this.ctxPremio.textAlign = 'center';
    this.ctxPremio.textBaseline = 'middle';
    this.ctxPremio.fillText(premio, this.premioCanvas.width / 2, this.premioCanvas.height / 2);
  }

  // Método para seleccionar un premio aleatorio basado en el margen de perder
  obtenerPremioAleatorio() {
    const randomChance = Math.random() * 100; // Genera un número aleatorio entre 0 y 100
    let premioSeleccionado;

    // Determinamos si el jugador gana o pierde según el margen de perder
    if (randomChance < this.margenPerder) {
      // El jugador pierde, seleccionamos el mensaje de "No ganaste"
      premioSeleccionado = '¡Lo siento! No has ganado esta vez.';
    } else {
      // El jugador gana, seleccionamos un premio ganador
      const indexGanador = Math.floor(Math.random() * this.premios.length); // Incluye premios ganadores
      premioSeleccionado = this.premios[indexGanador].texto;
    }

    return premioSeleccionado;
  }

  inicializarJuego() {
    // Obtener un premio aleatorio
    const premioAleatorio = this.obtenerPremioAleatorio();

    // Mostrar el premio o mensaje de pérdida
    if (this.premioDiv) {
      this.premioDiv.textContent = '';
      this.inicializarPremioCanvas(premioAleatorio);
      this.premioDiv.setAttribute('data-premio', premioAleatorio);
    }

    this.inicializarScratchCanvas();
  }

  configurarHammer() {
    const mc = new Hammer(this.scratchCanvas);
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    mc.on('pan', (event) => {
      if (!this.revelado && this.intentos < this.maxIntentos) {
        const rect = this.scratchCanvas.getBoundingClientRect();
        const x = event.center.x - rect.left;
        const y = event.center.y - rect.top;

        // Asegurarse de que el área de rascado está siendo modificada
        this.ctxScratch.clearRect(x - 15, y - 15, 30, 30);

        if (this.isCanvasRasgado(this.ctxScratch)) {
          this.revelado = true;
          this.intentos++;

          // Verificar si el premio es ganador
          const premio = this.premioDiv.dataset['premio'];

          if (premio && premio !== '¡Lo siento! No has ganado esta vez.') {
            alert('¡Felicidades! ¡Has ganado el premio!');
            this.terminarJuego();
          } else {
            if (this.intentos < this.maxIntentos) {
              alert('¡Lo siento! No has ganado, pero aún tienes intentos.');
              this.reiniciar()
            } else {
              alert('¡Lo siento! Has perdido, intenta de nuevo.');
              this.terminarJuego();
            }
          }
        }
      }
    });
  }

  isCanvasRasgado(ctx: CanvasRenderingContext2D) {
    const pixels = ctx.getImageData(0, 0, this.scratchCanvas.width, this.scratchCanvas.height).data;
    let totalVisible = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        totalVisible++;
      }
    }
    return totalVisible / totalPixels > 0.5; // Umbral de 50% de área rasgada
  }

  reiniciar() {
    if (this.intentos < this.maxIntentos) {
      this.revelado = false;
      this.premioDiv.textContent = '';
      this.inicializarJuego();
    }
  }

  terminarJuego() {
    // Finaliza el juego y muestra el resultado
    this.premioDiv.textContent = 'Juego terminado. Has ganado el premio.';
    this.intentos = this.maxIntentos; // Bloquear intentos
  }

  // Método para reiniciar el juego completamente
  nuevoJuego() {
    this.intentos = 0;
    this.revelado = false;
    this.premioDiv.textContent = '';
    this.inicializarJuego();
    // Activar nuevamente el botón de reintentar
  }
}
