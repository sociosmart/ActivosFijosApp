import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioCapturaPage } from './inventario-captura.page';

describe('InventarioCapturaPage', () => {
  let component: InventarioCapturaPage;
  let fixture: ComponentFixture<InventarioCapturaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InventarioCapturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
