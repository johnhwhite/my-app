import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  it('should be created', async () => {
    const service = TestBed.inject(DataService);
    expect(service).toBeTruthy();
    service.load([
      {
        id: 'id',
        name: 'name',
        award: 'award',
        country: {
          iso2: 'iso2',
        },
        event: 'event',
      },
    ]);
    expect(service.list()).toEqual([
      {
        id: 'id',
        name: 'name',
        award: 'award',
        country: {
          iso2: 'iso2',
        },
        event: 'event',
      },
    ]);
    expect(service.get('id')).toEqual({
      id: 'id',
      name: 'name',
      award: 'award',
      country: {
        iso2: 'iso2',
      },
      event: 'event',
    });
    service.set({
      id: 'id',
      name: 'new name',
      award: 'award',
      country: {
        iso2: 'iso2',
      },
      event: 'event',
    });
    expect(service.get('id')?.name).toEqual('new name');
    service.delete('id');
    expect(service.get('id')).toBeUndefined();
  });
});
