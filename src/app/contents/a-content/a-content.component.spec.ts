import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AContentComponent } from './a-content.component';

describe('AContentComponent', () => {
  let component: AContentComponent;
  let fixture: ComponentFixture<AContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
