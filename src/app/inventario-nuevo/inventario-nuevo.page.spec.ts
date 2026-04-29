import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioNuevoPage } from './inventario-nuevo.page';

describe('InventarioNuevoPage', () => {
  let component: InventarioNuevoPage;
  let fixture: ComponentFixture<InventarioNuevoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InventarioNuevoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
