import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  lastBack: number;
  constructor(private storageService: StorageService,
              private platform: Platform,
              ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
        if (Date.now() - this.lastBack < 500) { // logic for double tap: delay of 500ms between two clicks of back button
          App.exitApp();
        }
        this.lastBack= Date.now();
    });
  }

  async ngOnInit(){
    await this.storageService.init();
  }
}
