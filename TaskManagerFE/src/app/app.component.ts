import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../shared/components/nav/nav.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'TaskManagerFE';
}
