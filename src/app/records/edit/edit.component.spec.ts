import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyModalInstance } from '@skyux/modals';

import { DataService } from '../../services/data/data.service';
import { ID } from '../../types/id';

import { EditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: [
        {
          provide: SkyModalInstance,
          useValue: {
            close: jasmine.createSpy('SkyModalInstance.close'),
          },
        },
      ],
    });
  });

  it('should create', () => {
    const dataService = TestBed.inject(DataService);
    spyOn(dataService, 'set');
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    const submitButton = element.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    submitButton?.click();
    expect(component.form.invalid).toBeTrue();
    expect(dataService.set).not.toHaveBeenCalled();
  });

  it('should load record', () => {
    TestBed.overrideProvider(ID, { useValue: 'id' });
    const dataService = TestBed.inject(DataService);
    spyOn(dataService, 'set');
    dataService.set({
      id: 'id',
      name: 'name',
      award: 'award',
      country: {
        iso2: 'iso2',
      },
      event: 'event',
    });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    const submitButton = element.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    submitButton?.click();
    expect(dataService.set).toHaveBeenCalled();
  });

  it('should close modal on missing record', () => {
    TestBed.overrideProvider(ID, { useValue: 'id' });
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(TestBed.inject(SkyModalInstance).close).toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  });
});
