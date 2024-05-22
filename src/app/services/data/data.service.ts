import { computed, Injectable, signal } from '@angular/core';
import { RecordsType } from '../../types/records.type';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly #data = signal<RecordsType[]>([]);

  public readonly list = computed(() => this.#data(), {
    equal: () => false,
  });

  public get(id: string): RecordsType | undefined {
    return this.#data().find((record) => record.id === id);
  }

  public set(value: RecordsType): void {
    this.#data.set([
      ...this.#data().filter((record) => record.id !== value.id),
      value,
    ]);
  }

  public load(data: RecordsType[]): void {
    this.#data.set([...data]);
  }

  public delete(id: string): void {
    const data = this.#data().filter((record) => record.id !== id);
    this.#data.set(data);
  }
}
