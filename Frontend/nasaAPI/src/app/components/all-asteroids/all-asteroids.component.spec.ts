import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAsteroidsComponent } from './all-asteroids.component';

describe('AllAsteroidsComponent', () => {
  let component: AllAsteroidsComponent;
  let fixture: ComponentFixture<AllAsteroidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAsteroidsComponent]
    });
    fixture = TestBed.createComponent(AllAsteroidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
