import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TaskService} from '../../../shared/services/task-service.service';
import {throwError,of} from 'rxjs';

describe('HomePageComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskServiceMock: any;

  beforeEach(async () => {
    taskServiceMock = {
      createTask: jasmine.createSpy('createTask'),
      getAllTasks: jasmine.createSpy('getAllTasks').and.returnValue(of([]))
    }

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,TasksComponent],
      providers:[{provide: TaskService, useValue: taskServiceMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;

    component.taskForm = component.fb.group({
      title: [''],
      description: [''],
      status: ['New'],
      priority: ['Low'],
      dueDate: ['']
    });

    component.tasks = [];

    fixture.detectChanges();
  });

  it('should create a task successfully', fakeAsync(() => {
    component.formMode = 'add';

    const mockTask = {id: 1,
      title: 'Test 1',
      description: 'Test Desc',
      status: 'New',
      priority: 'Low',
      dueDate: '',
      createdAt: ''}

    taskServiceMock.createTask.and.returnValue(of(mockTask));
    taskServiceMock.getAllTasks.and.returnValue(of([mockTask]));

    component.taskForm.setValue({
      title: 'Test',
      description: 'Desc',
      status: 'New',
      priority: 'Low',
      dueDate: ''
    });

    component.save();
    tick();

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(component.taskForm.value);
    expect(component.tasks.length).toBe(1);
  }));

  it('should show an error message when create task fails',() => {
    component.formMode = 'add';
    component.showModal = true;

    component.taskForm.setValue({
      title: 'Fail Task',
      description: 'Fail',
      status: 'New',
      priority: 'Low',
      dueDate: null
    });

    (taskServiceMock.createTask as jasmine.Spy)
      .and.returnValue(throwError(() => new Error('API Error')));


    spyOn(window, 'alert');

    component.save();

    expect(taskServiceMock.createTask).toHaveBeenCalled();
    expect(component.tasks.length).toBe(0);
    expect(component.showModal).toBeTrue();
    expect(window.alert).toHaveBeenCalledWith('Failed to create task');
  });

});
