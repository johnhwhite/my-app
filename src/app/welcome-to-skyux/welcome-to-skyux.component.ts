import { Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyActionButtonModule } from '@skyux/layout';

@Component({
  selector: 'app-welcome-to-skyux',
  standalone: true,
  imports: [SkyActionButtonModule, SkyAlertModule],
  templateUrl: './welcome-to-skyux.component.html',
  styleUrl: './welcome-to-skyux.component.css',
})
export class WelcomeToSkyuxComponent {}
