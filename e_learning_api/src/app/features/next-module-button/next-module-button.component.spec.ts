import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextModuleButtonComponent } from './next-module-button.component';

describe('NextModuleButtonComponent', () => {
  let component: NextModuleButtonComponent;
  let fixture: ComponentFixture<NextModuleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextModuleButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextModuleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
