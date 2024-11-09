import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisosPCComponent } from './avisos-p-c.component';

describe('AvisosPCComponent', () => {
  let component: AvisosPCComponent;
  let fixture: ComponentFixture<AvisosPCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisosPCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisosPCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
