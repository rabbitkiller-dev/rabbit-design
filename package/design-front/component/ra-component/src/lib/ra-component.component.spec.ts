import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaComponentComponent } from './ra-component.component';

describe('RaComponentComponent', () => {
  let component: RaComponentComponent;
  let fixture: ComponentFixture<RaComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
