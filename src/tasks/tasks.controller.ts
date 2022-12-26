import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import * as stream from 'stream';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {
  }

  @Get()
  public getAllTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Get(':id')
  public getTaskById(@Param('id') id: string): Task {
    console.log(this.tasksService.getTaskById(id));
    return this.tasksService.getTaskById(id);
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  public deleteTask(@Param('id') id: string): void {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  public updateStatus(@Param('id') id: string, @Body() { status }: UpdateTaskStatusDto): Task {
    return this.tasksService.updateStatus(id, status);
  }
}