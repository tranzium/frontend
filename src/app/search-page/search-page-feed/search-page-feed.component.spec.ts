import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchPageFeedComponent } from "./search-page-feed.component";

describe("SearchPageFeedComponent", () => {
  let component: SearchPageFeedComponent;
  let fixture: ComponentFixture<SearchPageFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPageFeedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
