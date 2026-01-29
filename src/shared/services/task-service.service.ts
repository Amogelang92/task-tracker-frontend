import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Task} from '../models/task.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);
  constructor() {
  }

  getAllTasks(search: string, sort: string = 'dueDate:asc'): Observable<Task[]> {
    let params = new HttpParams().set('sort',sort);
    if(search){
      params = params.set('search', search)
    }
    return this.http.get<Task[]>(`${environment.TASK}`,{params});
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${environment.TASK}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${environment.TASK}`, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${environment.TASK}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.TASK}/${id}`);
  }
}
