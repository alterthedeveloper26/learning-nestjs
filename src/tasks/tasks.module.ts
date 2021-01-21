import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  //Provided an array of entity or res that
  //we want to provide for the eco system
  imports: [TypeOrmModule.forFeature([TaskRepository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
