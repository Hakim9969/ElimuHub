import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPlatformComponent } from './learning-platform.component';

describe('LearningPlatformComponent', () => {
  let component: LearningPlatformComponent;
  let fixture: ComponentFixture<LearningPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPlatformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
