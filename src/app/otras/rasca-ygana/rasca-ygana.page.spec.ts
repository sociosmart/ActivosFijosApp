import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RascaYGanaPage } from './rasca-ygana.page';

describe('RascaYGanaPage', () => {
  let component: RascaYGanaPage;
  let fixture: ComponentFixture<RascaYGanaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RascaYGanaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
