import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddClassesPage } from './add-classes.page';

describe('AddClassesPage', () => {
  let component: AddClassesPage;
  let fixture: ComponentFixture<AddClassesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
