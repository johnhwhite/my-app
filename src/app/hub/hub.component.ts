import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyActionHubModule, SkyPageLinksInput } from '@skyux/pages';
import { SkyActionHubNeedsAttentionInput } from '@skyux/pages/lib/modules/action-hub/types/action-hub-needs-attention-input';

import { APP_CONFIG } from '../types/config';
import { welcomeToSkyuxLinks } from '../welcome-to-skyux/welcome-to-skyux-links';
import { WelcomeToSkyuxComponent } from '../welcome-to-skyux/welcome-to-skyux.component';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [
    CommonModule,
    SkyActionHubModule,
    WelcomeToSkyuxComponent,
    SkyBoxModule,
  ],
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubComponent {
  protected config = inject(APP_CONFIG);
  protected needsAttention: SkyActionHubNeedsAttentionInput = [
    {
      title: '4 Records Need Attention',
      permalink: {
        route: {
          commands: ['records'],
        },
      },
    },
  ];
  protected relatedLinks: SkyPageLinksInput = welcomeToSkyuxLinks.map(
    (link) => ({
      label: link.label,
      permalink: {
        url: link.url,
      },
    }),
  );
}
