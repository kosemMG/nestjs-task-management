import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });

  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {
  }

  public async getAllTasks({ status, search }: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query: SelectQueryBuilder<Task> = this.repo.createQueryBuilder('task')
      .where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(new Brackets(qb => qb.where(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` })
      ));
    }

    let tasks: Task[];
    try {
      tasks = await query.getMany();
    } catch (error) {
      const message = `Failed to to retrieve tasks for user ${user.username}. Filters: status: ${status}, search: ${search}`;
      this.logger.error(message, error.stack);
      throw new InternalServerErrorException();
    }
    return tasks;
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.repo.findOneBy({ id, user });
    if (!found) throw new NotFoundException('Task not found');
    return found;
  }

  public async createTask({ title, description }: CreateTaskDto, user: User): Promise<Task> {
    const task: Task = this.repo.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });
    return this.repo.save(task);
  }

  public async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.repo.delete({ id, user });
    if (result.affected === 0) throw new NotFoundException('Task not found');
  }

  public async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    return this.repo.save({ ...task, status });
  }
}