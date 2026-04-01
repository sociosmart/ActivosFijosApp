import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCargaPage } from './detalle-carga.page';

describe('DetalleCargaPage', () => {
  let component: DetalleCargaPage;
  let fixture: ComponentFixture<DetalleCargaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleCargaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
