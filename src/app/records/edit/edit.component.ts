import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CRYPTO } from '@ng-web-apis/common';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyCountryFieldModule } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { DataService } from '../../services/data/data.service';
import { ID } from '../../types/id';
import { RecordsType } from '../../types/records.type';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyWaitModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  public readonly form = inject(FormBuilder).group<RecordsType>({
    id: '',
    name: '',
    country: {
      name: '',
      iso2: '',
    },
    event: '',
    award: '',
  });

  protected readonly loading = signal(true);
  protected readonly modalInstance = inject(SkyModalInstance, {
    optional: true,
  });
  protected readonly title = signal('Loading...');

  readonly #crypto = inject(CRYPTO);
  readonly #id = inject(ID, { optional: true });
  readonly #dataService = inject(DataService);

  public ngOnInit(): void {
    this.form.controls.name.addValidators([Validators.required]);
    this.form.controls.country.addValidators([Validators.required]);
    this.form.controls.event.addValidators([Validators.required]);
    this.form.controls.award.addValidators([Validators.required]);
    if (this.#id) {
      const record = this.#dataService.get(this.#id);
      if (!record) {
        this.modalInstance?.close();
        return;
      }
      this.form.setValue(record);
      this.title.set(`Edit Record`);
      this.loading.set(false);
    } else {
      this.form.get('id')?.setValue(this.#crypto.randomUUID());
      this.title.set(`New Record`);
      this.loading.set(false);
    }
  }

  protected saveForm(): void {
    if (this.loading() || this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.#dataService.set(this.form.value as RecordsType);
    this.modalInstance?.close();
  }
}
