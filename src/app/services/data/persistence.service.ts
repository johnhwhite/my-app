import { HttpClient } from '@angular/common/http';
import { Injectable, inject, effect } from '@angular/core';
import { SESSION_STORAGE } from '@ng-web-apis/common';
import { RecordsType } from '../../types/records.type';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  readonly #client = inject(HttpClient);
  readonly #dataService = inject(DataService);
  readonly #storage = inject(SESSION_STORAGE);

  constructor() {
    const storageValue = this.#storage.getItem('records');
    if (storageValue) {
      this.#dataService.load(JSON.parse(storageValue));
    } else {
      this.#client
        .get<RecordsType[]>('assets/records.json')
        .subscribe((data) => {
          this.#dataService.load(data);
        });
    }

    effect(() => {
      const data = this.#dataService.list();
      this.#storage.setItem('records', JSON.stringify(data));
    });
  }
}
