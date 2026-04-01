import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LealtadPage } from './lealtad.page';

describe('LealtadPage', () => {
  let component: LealtadPage;
  let fixture: ComponentFixture<LealtadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LealtadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
