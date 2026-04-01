import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargacombustiblePage } from './cargacombustible.page';

describe('CargacombustiblePage', () => {
  let component: CargacombustiblePage;
  let fixture: ComponentFixture<CargacombustiblePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CargacombustiblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
