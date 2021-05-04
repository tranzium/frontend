import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { GlobalVarsService } from "../../global-vars.service";
import { BackendApiService } from "../../backend-api.service";
import { AppRoutingModule } from "../../app-routing.module";
import { Router } from "@angular/router";
import { FeedPostImageModalComponent } from "../feed-post-image-modal/feed-post-image-modal.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";

interface SearchResponse {
  desc: string;
  image: string;
  link: string;
  name: string;
  type: string; // "creator" | "post"
  verified?: boolean;
  CoinPriceBitCloutNanos?: number;
  PublicKeyBase58Check?: string;
}

@Component({
  selector: "feed-creator",
  templateUrl: "./feed-creator.component.html",
  styleUrls: ["./feed-creator.component.sass"],
})
export class FeedCreatorComponent {
  @Input()
  get creator(): SearchResponse {
    return this._creator;
  }
  set creator(creator: SearchResponse) {
    this._creator = creator;
  }

  constructor(
    public globalVars: GlobalVarsService,
    private backendApi: BackendApiService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {}

  // emits the UserBlocked event
  @Output() userBlocked = new EventEmitter();

  AppRoutingModule = AppRoutingModule;
  stakeAmount = 1;
  loggedInUserStakeAmount = 0;
  loggedInUserNextStakePayout = -1;
  addingPostToGlobalFeed = false;
  reclout: any;
  postContent: any;
  _creator: any;
  pinningPost = false;
  hidingPost = false;

  openImgModal(event, imageURL) {
    event.stopPropagation();
    this.modalService.show(FeedPostImageModalComponent, {
      class: "modal-dialog-centered",
      initialState: {
        imageURL,
      },
    });
  }
}
