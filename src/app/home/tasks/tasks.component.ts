import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TaskService } from '../../../shared/services/task-service.service';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe,CommonModule,ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{
  tasks: Task[] = [];
  taskForm!: FormGroup;
  formMode: 'add' | 'edit' = 'add';

  isLoading = false;
  errorMessage: string | null = null;

  selectedTask: Task | null = null;
  editingTaskId: number | null = null;

  searchTerm = '';
  sortOrder = 'dueDate:asc';

  showModal = false;

  statuses = ['New', 'InProgress', 'Done'];
  priorities = ['Low', 'Medium', 'High'];

  constructor(
    private taskService: TaskService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['New', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: [null]
    });
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.taskService.getAllTasks(this.searchTerm, this.sortOrder).subscribe({
      next: (tasks) => {
        this.tasks = tasks
      },
      error: err => {
        this.errorMessage = err?.error?.detail ?? 'Failed to load tasks';
      },
      complete: () => this.isLoading = false
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
     this.loadTasks();
  }

  onSortChange(value: string) {
    this.sortOrder = value;
    this.loadTasks();
  }

  save() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value as Task;
    if (this.formMode === 'add') {
      this.taskService.createTask(formValue).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.showModal = false;
          this.loadTasks();
        },
        error: () => {
          alert('Failed to create task');
          this.showModal = true;
        }
      });
    }else if (this.formMode === 'edit' && this.editingTaskId) {
      this.taskService.updateTask(this.editingTaskId, formValue).subscribe({
        next: (updated) => {
          const index = this.tasks.findIndex(p => p.id === this.editingTaskId);
          if (index !== -1) {
            this.tasks[index] = updated;
          }
          this.showModal = false;
        },
        error: () => {
          alert('Failed to create task');
          this.showModal = true;
        }
      });
    }

  }

  deleteTask(id: number) {
    if (!id || !confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: err => {
        this.errorMessage = err?.error?.detail ?? 'Failed to delete task';
      }
    });
  }

  openCreate(): void {
    this.formMode = 'add';
    this.editingTaskId = null;
    this.taskForm.reset({status: 'New', priority: 'Medium'});
    this.showModal = true;
  }

  openEdit(task: Task): void {
    this.formMode = 'edit';
    this.editingTaskId = task.id;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : null
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }


}
