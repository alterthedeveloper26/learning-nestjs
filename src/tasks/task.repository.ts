import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { Task } from './task.entity'; //inject from service to respo
import { TaskStatus } from './task.task-status.enum';

//interact with repository
//Make with the decorator
@EntityRepository(Task) //This is a repository for the Task Entity
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Fail to create task for user ${user.username}, Data: ${createTaskDTO}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user; //make it logically work but no appear

    return task;
  }

  async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    //[where] will override and other where clause
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Fail to get tasks for user ${user.username}, Filter: ${JSON.stringify(
          filterDTO,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
