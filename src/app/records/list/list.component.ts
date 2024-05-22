import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  SkyAgGridModule,
  SkyAgGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyIconModule } from '@skyux/indicators';
import { SkyModalService } from '@skyux/modals';
import { SkyPageLink, SkyPageModule } from '@skyux/pages';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';

import { DataService } from '../../services/data/data.service';
import { APP_CONFIG } from '../../types/config';
import { ID } from '../../types/id';
import { RecordsType } from '../../types/records.type';
import { EditComponent } from '../edit/edit.component';
import { PersistenceService } from '../../services/data/persistence.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule,
    RouterLink,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyIconModule,
    SkyPageModule,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  protected readonly config = inject(APP_CONFIG);
  protected readonly parentLink: SkyPageLink = {
    permalink: {
      route: {
        commands: [''],
      },
    },
    label: this.config.title,
  };
  protected gridOptions: GridOptions<RecordsType> | undefined;
  protected readonly data: Signal<RecordsType[]>;
  protected rowDeleteIds: string[] = [];

  @ViewChild(AgGridAngular, { static: true })
  protected grid: AgGridAngular | undefined;

  @ViewChild('editLinkTemplate', { static: true })
  protected editLinkTemplate: TemplateRef<unknown> | undefined;

  @ViewChild('deleteLinkTemplate', { static: true })
  protected deleteLinkTemplate: TemplateRef<unknown> | undefined;

  readonly #columnDefs: () => ColDef<RecordsType>[] = () => [
    {
      headerName: '',
      field: 'selected',
      type: SkyCellType.RowSelector,
      sortable: false,
    },
    {
      headerName: '',
      field: 'edit',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.editLinkTemplate,
      },
      width: 120,
      maxWidth: 120,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      headerName: '',
      field: 'delete',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.deleteLinkTemplate,
      },
      width: 120,
      maxWidth: 120,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      field: 'name',
    },
    {
      field: 'event',
    },
    {
      field: 'country',
      valueGetter: (params) => params.data?.country.name ?? '',
    },
    {
      field: 'award',
    },
  ];
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #destroy = inject(DestroyRef);
  readonly #gridService = inject(SkyAgGridService);
  readonly #modalService = inject(SkyModalService);
  readonly #dataService = inject(DataService);
  readonly #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    multiselectToolbarEnabled: true,
    searchEnabled: true,
  };

  constructor() {
    this.data = this.#dataService.list;
    inject(PersistenceService);
  }

  public ngOnInit(): void {
    this.gridOptions = this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs(),
      },
    });

    this.#dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: 'gridView',
            displayedColumnIds: this.#columnDefs()
              .filter((col) => col.field)
              .map((col) => col.field) as string[],
          },
        ],
      }),
    });

    this.#dataManagerService.initDataView(this.#viewConfig);

    this.#dataManagerService
      .getDataStateUpdates(this.#viewConfig.id)
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((dataState) => {
        this.grid?.api?.setGridOption(
          'quickFilterText',
          dataState.searchText ?? '',
        );
      });
  }

  protected onEditClick(id: string): void {
    this.#modalService.open(EditComponent, {
      size: 'large',
      providers: [
        {
          provide: ID,
          useValue: id,
        },
      ],
    });
  }

  protected onDeleteClick(id: string): void {
    this.rowDeleteIds = [...new Set([...this.rowDeleteIds, id])];
  }

  protected rowDeleteCancel($event: SkyAgGridRowDeleteCancelArgs): void {
    this.rowDeleteIds = this.rowDeleteIds.filter((id) => id !== $event.id);
  }

  protected rowDeleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.rowDeleteIds = this.rowDeleteIds.filter((id) => id !== $event.id);
    this.#dataService.delete($event.id);
  }
}
