import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {
  }

  public async getAllTasks({ status, search }: GetTasksFilterDto): Promise<Task[]> {
    const query: SelectQueryBuilder<Task> = this.repo.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(new Brackets(qb => qb.where(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` })
      ));
    }

    return await query.getMany();
  }

  public async getTaskById(id: string): Promise<Task> {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException('Task not found');
    return found;
  }

  public async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task: Task = this.repo.create({
      title,
      description,
      status: TaskStatus.OPEN
    });
    return this.repo.save(task);
  }

  public async deleteTaskById(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Task not found');
  }

  public async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    return this.repo.save({ ...task, status });
  }
}