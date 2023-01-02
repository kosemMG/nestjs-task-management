import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   database: 'task-management',
//   username: 'postgres',
//   password: 'postgres',
//   synchronize: true,
//   entities: [Task]
// });
//
// AppDataSource.initialize()
//   .then(() => console.log('Data Source has been initialized!'))
//   .catch(err => console.error('Error during Data Source initialization', err));

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'task-management',
      username: 'postgres',
      password: 'postgres',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule
  ]
})
export class AppModule {
}