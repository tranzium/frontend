import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { BackendApiService, PostEntryResponse, ProfileEntryResponse } from "../../backend-api.service";
import { GlobalVarsService } from "../../global-vars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Datasource, IAdapter, IDatasource } from "ngx-ui-scroll";
import * as _ from "lodash";

@Component({
  selector: "search-page-feed",
  templateUrl: "./search-page-feed.component.html",
  styleUrls: ["./search-page-feed.component.scss"],
})
export class SearchPageFeedComponent {
  static PAGE_SIZE = 10;
  @Input() profile: ProfileEntryResponse;
  @Input() afterCommentCreatedCallback: any = null;
  @Input() showProfileAsReserved: boolean;

  datasource: IDatasource<IAdapter<PostEntryResponse>> = this.getDatasource();
  query = "";
  loadingFirstPage = true;
  loadingNextPage = false;

  pagedRequests = {
    "-1": new Promise((resolve) => {
      resolve([]);
    }),
  };

  lastPage = null;

  @Output() blockUser = new EventEmitter();

  constructor(
    private globalVars: GlobalVarsService,
    private backendApi: BackendApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private location: Location
  ) {
    this.route.params.subscribe((params) => {
      this.query = params.query;
    });
  }

  // TODO: Cleanup - Create InfiniteScroller class to de-duplicate this logic
  getDatasource() {
    return new Datasource<IAdapter<PostEntryResponse>>({
      get: (index, count, success) => {
        const startIdx = Math.max(index, 0);
        const endIdx = index + count - 1;
        if (startIdx > endIdx) {
          success([]);
          return;
        }
        const startPage = Math.floor(startIdx / SearchPageFeedComponent.PAGE_SIZE);
        const endPage = Math.floor(endIdx / SearchPageFeedComponent.PAGE_SIZE);

        const pageRequests: any[] = [];
        for (let i = startPage; i <= endPage; i++) {
          const existingRequest = this.pagedRequests[i];
          if (existingRequest) {
            pageRequests.push(existingRequest);
          } else {
            const newRequest = this.pagedRequests[i - 1].then((_) => {
              return this.getPage(i);
            });
            this.pagedRequests[i] = newRequest;
            pageRequests.push(newRequest);
          }
        }

        return Promise.all(pageRequests).then((pageResults) => {
          pageResults = pageResults.reduce((acc, result) => [...acc, ...result], []);
          const start = startIdx - startPage * SearchPageFeedComponent.PAGE_SIZE;
          const end = start + endIdx - startIdx + 1;
          return pageResults.slice(start, end);
        });
      },
      settings: {
        startIndex: 0,
        minIndex: 0,
        bufferSize: 5,
        padding: 0.25,
        windowViewport: true,
      },
    });
  }

  getPage(page: number) {
    if (this.lastPage != null && page > this.lastPage) {
      return [];
    }
    this.loadingNextPage = true;
    const endpoint = `https://sym.one:9099/search?query=${this.query}&index=${page}`;
    return fetch(endpoint)
      .then(async (res) => {
        const response = await res.json();
        const creators = response.results || [];
        if (!creators || creators.length < SearchPageFeedComponent.PAGE_SIZE) {
          this.lastPage = page;
        }

        // posts.map((post) => (post.ProfileEntryResponse = this.profile));
        creators.map((creator) => {
          creator.verified = creator.verified || false;
          creator.CoinPriceBitCloutNanos = creator.CoinPriceBitCloutNanos || 0; // TODO ?
          creator.PublicKeyBase58Check = creator.PublicKeyBase58Check || ""; // TODO ?
          return creator;
        });
        return creators;
      })
      .finally(() => {
        this.loadingFirstPage = false;
        this.loadingNextPage = false;
      });
  }

  userBlocked() {
    this.blockUser.emit();
  }
}
