export interface Task{
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskProirity;
    dueDate?: string;
    createdAt: string;
}

export type TaskStatus = 'New' | 'InProgress' | 'Done';

export type TaskProirity = 'Low' | 'Medium' | 'High';