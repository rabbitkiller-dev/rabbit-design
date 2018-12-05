import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaDesignComponentComponent } from './ra-design-component.component';

describe('RaDesignComponentComponent', () => {
  let component: RaDesignComponentComponent;
  let fixture: ComponentFixture<RaDesignComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaDesignComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaDesignComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
