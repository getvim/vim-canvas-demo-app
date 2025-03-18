import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VimOsService } from './services/vimos/vimos.service';
import { map, Observable } from 'rxjs';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import animation from  '../assets/animation.json'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LottieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
 lottieOptions: AnimationOptions = {
  animationData: animation,
 }
  constructor(public vimOsService: VimOsService) {}
  
  ngOnInit() {
    this.vimOsService.loadVimOs()
  }

  get vimSdkLoaded(): Observable<boolean> {
    return this.vimOsService.vimSdkLoaded()
  }
}
