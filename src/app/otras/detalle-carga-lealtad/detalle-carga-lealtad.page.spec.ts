import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCargaLealtadPage } from './detalle-carga-lealtad.page';

describe('DetalleCargaLealtadPage', () => {
  let component: DetalleCargaLealtadPage;
  let fixture: ComponentFixture<DetalleCargaLealtadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleCargaLealtadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
