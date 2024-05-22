import { SESSION_STORAGE } from '@ng-web-apis/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PersistenceService } from './persistence.service';
import { DataService } from './data.service';
import { Component, inject } from '@angular/core';

@Component({
  providers: [PersistenceService],
  standalone: true,
  template: '',
})
class TestComponent {
  public readonly persistenceService = inject(PersistenceService);
}

describe('PersistenceService', () => {
  let fixture: ComponentFixture<TestComponent>;
  let persistenceService: PersistenceService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SESSION_STORAGE,
          useValue: {
            getItem: jasmine.createSpy('getItem'),
            setItem: jasmine.createSpy('setItem'),
            removeItem: jasmine.createSpy('removeItem'),
            clear: jasmine.createSpy('clear'),
            key: jasmine.createSpy('key'),
            length: 0,
          },
        },
      ],
    });
  });

  it('should initialize with data from storage', async () => {
    const sessionStorage = TestBed.inject(SESSION_STORAGE);
    (sessionStorage.getItem as jasmine.Spy).and.returnValue(
      JSON.stringify([
        {
          id: 'id',
          name: 'name',
          award: 'award',
          country: {
            iso2: 'iso2',
          },
          event: 'event',
        },
      ]),
    );
    const httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'get');
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    persistenceService = fixture.componentInstance.persistenceService;
    expect(persistenceService).toBeTruthy();
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('records');
    TestBed.inject(DataService).set({
      id: 'new id',
      name: 'new name',
      award: 'new award',
      country: {
        iso2: 'new iso2',
      },
      event: 'new event',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'records',
      JSON.stringify([
        {
          id: 'id',
          name: 'name',
          award: 'award',
          country: {
            iso2: 'iso2',
          },
          event: 'event',
        },
        {
          id: 'new id',
          name: 'new name',
          award: 'new award',
          country: {
            iso2: 'new iso2',
          },
          event: 'new event',
        },
      ]),
    );
  });

  it('should initialize data via http', async () => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    persistenceService = fixture.componentInstance.persistenceService;
    expect(persistenceService).toBeTruthy();
    const httpTesting = TestBed.inject(HttpTestingController);
    const req = httpTesting.expectOne(
      'assets/records.json',
      'Request to assets/records.json',
    );
    req.flush([
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
    const dataService = TestBed.inject(DataService);
    expect(dataService.list()).toEqual([
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
  });
});
