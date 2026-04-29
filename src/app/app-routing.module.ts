import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard' ;
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'alta-activo',
    loadChildren: () => import('./alta-activo/alta-activo.module').then( m => m.AltaActivoPageModule),
    canActivate: [AuthGuard] // 🔒 PROTEGIDO
  },  
  {
    path: 'lista-activos',
    loadChildren: () => import('./lista-activos/lista-activos.module').then( m => m.ListaActivosPageModule),
    canActivate: [AuthGuard] // 🔒 PROTEGIDO
  },
{
  path: 'login',
  loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  canActivate: [LoginGuard]
},
  {
    path: 'pruebaimpresion',
    loadChildren: () => import('./pruebaimpresion/pruebaimpresion.module').then( m => m.PruebaimpresionPageModule)
  },
  {
    path: 'scan-barcode',
    loadChildren: () => import('./scan-barcode/scan-barcode.module').then( m => m.ScanBarcodePageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'inventarios',
    loadChildren: () => import('./inventarios/inventarios.module').then( m => m.InventariosPageModule)
  },
  {
    path: 'inventario-detalle/:id',
    loadChildren: () => import('./inventario-detalle/inventario-detalle.module').then( m => m.InventarioDetallePageModule)
  },  {
    path: 'inventario-nuevo',
    loadChildren: () => import('./inventario-nuevo/inventario-nuevo.module').then( m => m.InventarioNuevoPageModule)
  },
  {
    path: 'inventario-captura',
    loadChildren: () => import('./pages/inventario-captura/inventario-captura.module').then( m => m.InventarioCapturaPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
