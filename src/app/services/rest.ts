
//   apiSocioSmart='http://192.168.1.203:8081/api';
//   api='http://192.168.1.203:8081/apigasolinera';
//   apiSocioSmart='http://192.168.1.66/api';
//   api='http://192.168.1.66/apigasolinera';



// TraeSorteoVigente($ciudad) {
//   return new Promise(resolve => {
//     console.log(this.apiSocioSmart+'/operacion?Sorteo=true&ciudad='+$ciudad);
//     this.http.get(this.apiSocioSmart+'/operacion?Sorteo=true&ciudad='+$ciudad).subscribe(data => {
//       resolve(data);
//     }, err => {
//       resolve(err);
//     });
//   });
// }







// postValeopTaxi($pv :any,$cliente,$cantidad,$prod,$user,$token,$ciudad,$uuid,$usuario,$nip){    
//   let body = JSON.stringify({
//   });
//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'http://localhost:4200/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
//   options.headers;
//   //console.log(body);
//   options.headers;
//   //https://sociosmart.ddns.net/rest/Operacion?
//   console.log(this.apiSocioSmart+"/operacion?pv="+$pv+"&cliente="+$cliente+"&prod="+$prod+"&token="+$token+"&ciudad="+$ciudad+"&uuid="+$uuid+"&empleado="+$usuario+"&nip="+$nip+"&canjetaxi=true");
//   return this.http.post(this.apiSocioSmart+"/operacion?pv="+$pv+"&cliente="+$cliente+"&prod="+$prod+"&token="+$token+"&ciudad="+$ciudad+"&uuid="+$uuid+"&empleado="+$usuario+"&nip="+$nip+"&canjetaxi=true", body)
//   .map((response: Response) => {        
//     if (response.status) {          
//         return response;
//     } else {
//         return response;
//     }});
// }


// Terminos() {
//   return new Promise(resolve => {
//     this.http.get(this.apiSocioSmart+'/Terminos').subscribe(data => {
//       resolve(data);
//     }, err => {
//     //  console.log(err);
//     });
//   });
// }





// getVale($id,$pv) {
//   return new Promise(resolve => {
//     this.storage.get('apisociosmart').then((apiSocioSmart) => {
//     this.apiSocioSmart=apiSocioSmart;
//     console.log(this.apiSocioSmart+'/GetVale/'+$id,+"/"+$pv);
//     this.http.get(this.apiSocioSmart+'/GetVale/'+$id+"/"+$pv).subscribe(data => {
//         resolve(data);
//         //data=this.generateArray(data)
//         //console.log(data);
//       }, err => {
//         resolve(err);
//       });
//     });
//   });
// }


getValepv($pv) {
  return new Promise(resolve => {
    this.storage.get('apisociosmart').then((apiSocioSmart) => {
      this.storage.get('Token').then((token) => {
        this.storage.get('UUID').then((UUID) => {
    this.apiSocioSmart=apiSocioSmart;
    console.log(this.apiSocioSmart+'/operacion?GetValePvDia=true&pv='+$pv+'&token='+token+'&uuid='+UUID);
    this.http.get(this.apiSocioSmart+'/operacion?GetValePvDia=true&pv='+$pv+'&token='+token+'&uuid='+UUID).subscribe(data => {
        resolve(data);
        //data=this.generateArray(data)
        //console.log(data);
      }, err => {
        resolve(err);
      });
    });
  });
});
  });
}

// GetLogin($user,$pas) {
//   return new Promise(resolve => {
//   this.storage.get('apisociosmart').then((apiSocioSmart) => {
//   this.apiSocioSmart=apiSocioSmart;
//   console.log(this.apiSocioSmart+'/GetLoginadm/'+$user+'/'+$pas);
//   this.http.get(this.apiSocioSmart+'/GetLoginadm/'+$user+'/'+$pas).subscribe(data => {
//       resolve(data);
//       //data=this.generateArray(data)
//       //console.log(data);
//     }, err => {
//       resolve(err);
//     });
//   });
// });
// }



// activarapirestestacion($user,$pas) {
//   return new Promise(resolve => {
//   this.storage.get('host').then((apiSocioSmart) => {
//   this.apiSocioSmart=apiSocioSmart;
//   //console.log(this.apiSocioSmart+'/iniciarsesion/'+$user+'/'+$pas);
//   this.http.get(this.apiSocioSmart+'/iniciarsesion/'+$user+'/'+$pas).subscribe(data => {
//       resolve(data);
//       data=this.generateArray(data);
//     //  console.log(data);
//     }, err => {
//       resolve(err);
//     });
//   });
// });
// }

// UpdateCuenta(user,contra,uuid,platform,model,val,apiq){
//     let body = JSON.stringify({    
//     "UUID":uuid,
//     "Plataforma":platform,
//     "Modelo":model,
//     "Fk_Cve_UsuarioUso":val
//     })
//     //console.log("imprimo arreglo "+idorden.idorden);
//     let headers = new Headers({ 'Content-Type': 'application/json' });
//     headers.append('Access-Control-Allow-Origin', 'https://sociosmart.com.mx/servicios/api/');
//     headers.append('Access-Control-Allow-Methods', 'POST');
//     headers.append('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//     let options = new RequestOptions({ headers: headers });
//     options.headers;
//     //console.log(apiq + '/guardakeyapp/'+user+'/'+contra);
//     return this.http.put(apiq + '/guardakeyapp/'+user+'/'+contra,body)
//         .map((response: Response) => {        
//             if (response.status) {          
//                 return response;
//             } else {
//                 return response;
//             }
//         });
// }
// Quemavale(uuid,token,cliente,use,arreglo,apiq){
//   console.log(arreglo.join(','));
//   var json = [];
//   var to = arreglo.join(',');
//   var toSplit = to.split(",");
//   for (var i = 0; i < toSplit.length; i++) {
//       json.push({"Cve":toSplit[i]});
//   }
//   // body = JSON.stringify({    "Cve":arreglo,});
//   console.log(json);
//   let body=json;
//   //console.log("imprimo arreglo "+idorden.idorden);
//   let headers = new Headers({ 'Content-Type': 'application/json' });
//   headers.append('Access-Control-Allow-Origin', 'https://sociosmart.com.mx/servicios/api/');
//   headers.append('Access-Control-Allow-Methods', 'POST');
//   headers.append('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({ headers: headers });
//   options.headers;
//   console.log(apiq + '/quemacupon/'+uuid+'/'+token+'/'+cliente+'/'+use);
//   return this.http.put(apiq + '/quemacupon/'+uuid+'/'+token+'/'+cliente+'/'+use,body)
//       .map((response: Response) => {   
          
//           if (response.status) {          
//               return response;
//           } else {
//               return response;
//           }
//       });
// }

// postDespacho(cliente,arreglo){    
//   let body = JSON.stringify({    
//     "N_Transaccion":arreglo[0].N_Transaccion,
//     "Cod_Gasolinero":arreglo[0].Cod_Gasolinero,
//     "PosicionCarga":arreglo[0].PosicionCarga,    
//     "Fecha":arreglo[0].Fecha,
//     "Hora":arreglo[0].Hora,
//     "Id_Producto":arreglo[0].Id_Producto,
//     "Cantidad":arreglo[0].Cantidad,
//     "Monto":arreglo[0].Monto,
//     "N_Cliente":arreglo[0].N_Cliente
//     })

//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'https://sociosmart.com.mx/servicios/api/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
//   options.headers;
//   console.log("Ruta");
//   console.log(this.apiSocioSmart+"/despacho/"+cliente);
//   console.log("body a postear");
//   console.log(body); 
  
//   return this.http.post(this.apiSocioSmart+"/despacho/"+cliente, body)
//   .map((response: Response) => {
//     console.log("Respuesta");
//      console.log(response);
//     this.respuesta=this,this.generateArray(response);
//     //console.log(response["Estatus"]);
//       if (response["Estatus"]=="1") {
//           return true;
//       } else {
//           return false;
//       }
//   })     
// }


// postcobranza(apiSocioSmart,arreglo,pv,grupo,user,contra,puntos,total,folioredencion){    
//   let body = arreglo;
//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'https://sociosmart.com.mx/servicios/api/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
//   options.headers;
//   //console.log(body);
//   options.headers; 
// console.log(body);
// console.log(apiSocioSmart+"/Cobranza/"+pv+"/"+grupo+"/"+user+"/"+contra+"/"+puntos+"/"+total+"/"+folioredencion);
//   return this.http.post(apiSocioSmart+"/Cobranza/"+pv+"/"+grupo+"/"+user+"/"+contra+"/"+puntos+"/"+total+"/"+folioredencion, body)
//   .map((response: Response) => {
//    console.log(response);
//     this.respuesta=this.generateArray(response);
//     console.log(this.respuesta);
//           return this.respuesta;     
//   });

// }

// UpdateVale(apiSocioSmart,arreglo,user,contra,pv,vale){    
//   let body = arreglo;
//   console.log(body);
//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'https://sociosmart.com.mx/servicios/api/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
//   options.headers;
//   //console.log(body);
//   options.headers; 
// console.log(body);

// console.log('http://sociosmart.com.mx/servicios/api'+"/UpdateVale/"+user+"/"+contra+"/"+pv+"/"+vale);
//   return this.http.post(apiSocioSmart+"/UpdateVale/"+user+"/"+contra+"/"+pv+"/"+vale, body)
//   .map((response: Response) => {
//    console.log(response);
//     this.respuesta=this.generateArray(response);
//     console.log(this.respuesta);
//           return this.respuesta;     
//   });



// }

// getEstatus($id,$di)
// {
//   return new Promise(resolve => {
//     this.storage.get('apisociosmart').then((apiSocioSmart) => {
//       this.apiSocioSmart=apiSocioSmart;
//    console.log("enlace:"+this.apiSocioSmart+'/operacion?id='+$id+"&di="+$di);
//     this.http.get(this.apiSocioSmart+'/operacion?id='+$id+"&di="+$di).subscribe(data => {
//       resolve(data);
//     }, err => {
//     //  console.log(err);
//     });
//   });
// });
// }

// obtenerconfiguuid(uuid,modelo,plataforma)
// {
//   return new Promise(resolve => {
//     this.storage.get('apisociosmart').then((apiSocioSmart) => {
//     this.apiSocioSmart=apiSocioSmart;
//     console.log(this.apiSocioSmart+'/obtenerconfiguuid/'+uuid+'/'+modelo+'/'+plataforma);
//     this.http.get(this.apiSocioSmart+'/obtenerconfiguuid/'+uuid+'/'+modelo+'/'+plataforma).subscribe(data => {
//       resolve(data);
//     }, err => {
//     //  console.log(err);
//     });
//   });
// });
// }



// ProbarTicketTachna(IpImpresora,NombreImpresora,Puerto,TipoImpresora,grupo)
// {

//   return new Promise(resolve => {
//     this.storage.get('host').then((val1) => {
//       this.apiSocioSmart=val1;
//   console.log(this.apiSocioSmart+'/PruebaTicket/'+IpImpresora+"/"+NombreImpresora+"/"+TipoImpresora+"/"+Puerto);
//     this.http.get(this.apiSocioSmart+'/PruebaTicket/'+IpImpresora+"/"+NombreImpresora+"/"+TipoImpresora+"/"+Puerto).subscribe(data => {
//       resolve(data);
//     }, err => {
//     //  console.log(err);
//     });
//   });
//   });
// }


// ProbarTicketEscoserra($clientevale,$vales,$foliovale,$pv,$tipo,IpImpresora,NombreImpresora,host,tipo,puerto,cre)
// {
//   let body =$vales;
//   console.log(body);
//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'http://localhost:4200/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
// //options.headers;
//   options.headers; 
//   console.log(host+'/ticket/'+$clientevale+"/"+$foliovale+"/"+$pv+"/"+$tipo+"/"+IpImpresora+"/"+NombreImpresora+"/"+tipo+"/"+puerto+"/"+cre);
//   return this.http.post(host+'/ticket/'+$clientevale+"/"+$foliovale+"/"+$pv+"/"+$tipo+"/"+IpImpresora+"/"+NombreImpresora+"/"+tipo+"/"+puerto+"/"+cre, body)
//   .map((response: Response) => {
// console.log(response);
//           return response;
      
//   });
// }  




// reimpresionticketEscoserra($vales,$foliovale,$clientevale,$pv,$tipo,IpImpresora,NombreImpresora,host,tipo,puerto,PV)
// {
//   let body = JSON.stringify([$vales]);
  
//   console.log(body);
//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'https://sociosmart.com.mx/servicios/api/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
// //options.headers;
//   options.headers; 
//   console.log(host+'/ticket/'+$foliovale+"/"+$clientevale+"/"+$pv+"/"+$tipo+"/"+IpImpresora+"/"+NombreImpresora+"/"+tipo+"/"+puerto+"/"+PV);
//   return this.http.post(host+'/ticket/'+$foliovale+"/"+$clientevale+"/"+$pv+"/"+$tipo+"/"+IpImpresora+"/"+NombreImpresora+"/"+tipo+"/"+puerto+"/"+PV, body)
//   .map((response: Response) => {
//     console.log(response);  
//    // console.log(response[0].Estatus);
//       if (response[0].Estatus=="1") {
//           return true;
//       } else {
//           return false;
//       }
//   });
// }










// getdespacho($id,$di)
// {
//   return new Promise(resolve => { 
//  //console.log(this.api+'/Ver/'+$id+"/"+$di);
//     this.http.get(this.api+'/Ver/'+$id+"/"+$di).subscribe(data => {
//       resolve(data);
//     }, err => {
//    //   console.log(err);
//     });
//   });
// }


// TucargaVale($uuid,$Token,$pv) {
//   return new Promise(resolve => {
//     this.storage.get('apisociosmart').then((apiSocioSmart) => {
//     this.apiSocioSmart=apiSocioSmart;
//     console.log($uuid);
//     console.log($Token);
//     console.log(this.apiSocioSmart+'/operacion?uuid='+$uuid+"&token="+$Token+"&pv="+$pv+"&TucargaVale=1");
//     this.http.get(this.apiSocioSmart+'/operacion?uuid='+$uuid+"&token="+$Token+"&pv="+$pv+"&TucargaVale=1").subscribe(data => {
//         resolve(data);
//         //data=this.generateArray(data)
//         //console.log(data);
//       }, err => {
//         resolve(err);
//       });
//     });
//   });
// }



// PostSorteolocal($cliente,$sorteo,$token,$usuario,$nip,$pv,$userkey) {
//   //console.log($id);
//   return new Promise(resolve => {
//     console.log(this.apiSocioSmart+'?operacionGenerarBoletoSorteoOplocal/'+$cliente+'/'+$sorteo+'/'+$token+'/'+$usuario+'/'+$nip+'/'+$pv+'/'+$userkey);
//     this.http.get(this.apiSocioSmart+'/GenerarBoletoSorteoOplocal/'+$cliente+'/'+$sorteo+'/'+$token+'/'+$usuario+'/'+$nip+'/'+$pv+'/'+$userkey).subscribe(data => {
//       resolve(data);
//     }, err => {
//      // console.log(err);
//     });
//   });
// }

// postTraepremio(folio,numero,estacion){    
//   let body = JSON.stringify({
//       "idRequest":folio,
//       "reference":numero,
//       "codeStation":estacion
//       });  
//   let headers = new Headers({'Content-Type': 'application/json'});
//     headers.append('Acess-Control-Allow-Origin', '*');
//     headers.append('Acess-Control-Allow-Methods', 'POST');
//     headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
//     options.headers;
//     console.log(body);
//     var url='https://smartgasgasolineras.mx/sorteos/sistema/api/requestAward';
//     console.log("https://smartgasgasolineras.mx/sorteos/sistema/api/requestAward");
//     return this.http.post(url, body)
//   .map((response: Response) => { 
//     //console.log('GANO: '+response['info']['data']['codigoPremio']);
//   //  console.log('ESTADO PREMIO: '+response['info']['typeAward']);
//     return response;       
//    });
// }
// getValeCanjeGasCargaVale($id) {
//   return new Promise(resolve => {
//     this.storage.get('apisociosmart').then((apiSocioSmart) => {
//       this.storage.get('Token').then((token) => {
//         this.storage.get('UUID').then((UUID) => {
//     this.apiSocioSmart=apiSocioSmart;
//     console.log(this.apiSocioSmart+'/operacion?getValeCanjeGasCargaVale='+$id+'&token='+token+'&UUID='+UUID);
//     this.http.get(this.apiSocioSmart+'/operacion?getValeCanjeGasCargaVale='+$id+'&token='+token +'&UUID='+UUID).subscribe(data => {
//         resolve(data);
//         //data=this.generateArray(data)
//         //console.log(data);
//       }, err => {
//         resolve(err);
//       });
//       });
//     });});
//   });
// }









// GetVersionActual(apisociosmart,pv,version,uuid) {
//   return new Promise(resolve => {
//    // console.log(encodeURIComponent(apisociosmart+'/operacion?v=1&pv='+pv));
//     console.log(apisociosmart+'/operacion?v=2&pv='+pv+'&versiontrabaja='+version+'&uuid='+uuid);
//     this.http.get(apisociosmart+'/operacion?v=2&pv='+pv+'&versiontrabaja='+version+'&uuid='+uuid).subscribe(data => {
//       resolve(data);
//     }, err => {
//       resolve(err);
//     });
//   });
// }





// Validausuario($id,$di,$yi)
// {
//   return new Promise(resolve => {
//     this.storage.get('apisociosmart').then((apiSocioSmart) => {
//       this.storage.get('GRUPO').then((GRUPO) => {
//       this.apiSocioSmart=apiSocioSmart;
//     console.log(this.apiSocioSmart+'/operacion?usr='+$id+"&pw="+$di+'&cre='+$yi+'&pv='+GRUPO);
//        this.http.get(this.apiSocioSmart+'/operacion?usr='+$id+"&pw="+$di+'&cre='+$yi+'&pv='+GRUPO).subscribe(data => {
//          resolve(data);
//        }, err => {
//      //    console.log(err);
//        });
//       });
//      });
//     });
// }




// postCanjeReciclaje($pv,$cliente,$cantidad,$token,$usuario,$nip,$userkey,$usercve){  
  
//   let body = JSON.stringify({
//     "Token":$token,
//     "UsuarioOperador":$usuario,
//     "NipOperador":$nip,
//     "Estacion":$pv,    
//     "Cantidad":$cantidad,
//     "Telefono":$cliente,
//     "KeyApi":$userkey,
//     "Usuario":$usercve
//   });
//   let headers = new Headers({'Content-Type': 'application/json'});
//   headers.append('Acess-Control-Allow-Origin', 'http://localhost:4200/');
//   headers.append('Acess-Control-Allow-Methods', 'POST');
//   headers.append('Acess-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   let options = new RequestOptions({headers: headers});
//   options.headers;
//   console.log(body);
//   options.headers;
//   //https://sociosmart.ddns.net/rest/Operacion?
//   console.log(this.apiSocioSmart+"/PuntosVerdes?CanjeEstacion=true");
//   return this.http.post(this.apiSocioSmart+"/PuntosVerdes?CanjeEstacion=true", body)
//   .map((response: Response) => {        
//     if (response.status) {          
//         return response;
//     } else {
//         return response;
//     }});
// }



// generateArray(obj)
// {
//   return Object.keys(obj).map((key) => { return obj[key] });
// }

// }
