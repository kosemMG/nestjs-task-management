import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as crypto from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks({ status, search }: GetTasksFilterDto): Task[] {
    let tasks = this.tasks.map(task => ({ ...task }));
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()));
    }

    return tasks;
  }

  public getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);
    if (!found) throw new NotFoundException('Task not found');
    return found;
  }

  public createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }

  public deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  public updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}