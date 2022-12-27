// import { Task } from './task.entity';
// import { TaskStatus } from './task-status.enum';
// import { EntityRepository, Repository } from 'typeorm';

// export const TasksRepository = AppDataSource.getRepository(Task).extend({
//   async createTask(title: string, description: string): Promise<Task> {
//     const task: Task = this.create({
//       title,
//       description,
//       status: TaskStatus.OPEN
//     });
//     return this.save(task);
//   }
// });

// export class TasksRepository extends Repository<Task> {
//   public async createTask(title: string, description: string): Promise<Task> {
//     const task: Task = this.create({
//       title,
//       description,
//       status: TaskStatus.OPEN
//     });
//     return this.save(task);
//   }
// }