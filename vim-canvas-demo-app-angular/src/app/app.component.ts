import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VimOsService } from './services/vimos/vimos.service';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(public vimOsService: VimOsService) {}
  
  ngOnInit() {
    this.vimOsService.loadVimOs()
  }

  get vimSdkLoaded(): Observable<boolean> {
    return this.vimOsService.vimSdkLoaded()
  }
}
