import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaActivoPage } from './alta-activo.page';

describe('AltaActivoPage', () => {
  let component: AltaActivoPage;
  let fixture: ComponentFixture<AltaActivoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AltaActivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
