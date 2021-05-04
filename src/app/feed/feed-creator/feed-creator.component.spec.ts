import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FeedCreatorComponent } from "./feed-creator.component";

describe("FeedCreatorComponent", () => {
  let component: FeedCreatorComponent;
  let fixture: ComponentFixture<FeedCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedCreatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
