import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatslistComponent } from './chatslist.component';

describe('ChatslistComponent', () => {
  let component: ChatslistComponent;
  let fixture: ComponentFixture<ChatslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatslistComponent]
    });
    fixture = TestBed.createComponent(ChatslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
