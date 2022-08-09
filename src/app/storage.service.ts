import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageInc: Storage | null = null;

  constructor(private storage: Storage) {
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.storageInc = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this.storageInc?.set(key, value);
  }

  public get(key: string) {
    return this.storageInc?.get(key);
  }

  public remove(key: string) {
    this.storageInc?.remove(key);
  }
}
