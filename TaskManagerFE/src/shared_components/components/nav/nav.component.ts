import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  title: string = 'Task Manager';
  currentUrl: string = '';
}
