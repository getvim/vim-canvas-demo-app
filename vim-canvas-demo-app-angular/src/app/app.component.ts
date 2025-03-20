import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { VimOsService } from "./services/vimos/vimos.service";
import { Observable } from "rxjs";
import { AnimationOptions, LottieComponent } from "ngx-lottie";
import animation from "../assets/animation.json";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, LottieComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  lottieOptions: AnimationOptions = {
    animationData: animation,
  };
  vimOsService = inject(VimOsService);
  constructor() {}

  get vimSdkLoaded(): Observable<boolean> {
    return this.vimOsService.vimSdkLoaded();
  }
}
