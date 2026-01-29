import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from "./home/tasks/tasks.component";

@Component({
  selector: 'app-root',
  imports: [TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lexis-frontend';
}
