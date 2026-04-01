import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReimpresionPage } from './reimpresion.page';

describe('ReimpresionPage', () => {
  let component: ReimpresionPage;
  let fixture: ComponentFixture<ReimpresionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReimpresionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
