import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.task-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { exception } from 'console';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  //Inject from task repository into service
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getFilteredTasks(
    getTaskFilterDTO: GetTaskFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const filteredTasks = await this.taskRepository.getTasks(
      getTaskFilterDTO,
      user,
    );
    return filteredTasks;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    //Async func
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ${id} do not exist!!!`);
    }

    return found;
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async deleteATask(id: number, user: User) {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task with ${id} does not exist!`);
    }

    return result;
  }

  async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  // getAllTasks() {
  //   return [...this.tasks];
  // }

  // getFilteredTasks(getTaskFilterDTO: GetTaskFilterDTO): Task[] {
  //   const { status, search } = getTaskFilterDTO;
  //   console.log(search);
  //   let tempTasks = [...this.tasks];
  //   if (status) tempTasks = tempTasks.filter((task) => task.status === status);
  //   if (search) {
  //     tempTasks = tempTasks.filter(
  //       (task) =>
  //         task.description.includes(search) || task.title.includes(search),
  //     );
  //   }

  //   return tempTasks;
  // }

  // getTaskById(id: string): Task {
  //   const task = this.tasks.find((task) => task.id === id);

  //   if (!task) {
  //     throw new NotFoundException(`Can not find such id as ${id}`);
  //   }

  //   console.log(task);
  //   return task;
  // }

  // findTaskIndexById(id: string): number {
  //   const task = this.tasks.find((task) => task.id === id);
  //   return this.tasks.indexOf(task);
  // }

  // createTask(createTaskDTO: CreateTaskDTO) {
  //   const { title, description } = createTaskDTO;

  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  //Not use this
  //   deleteATask(id: string) {
  //     const taskId = this.findTaskIndexById(id);
  //     this.tasks.splice(taskId, 1);
  //   }

  // deleteATask(id: string): void {
  //   if (!this.getTaskById(id)) {
  //     throw new exception(`Can not find such id as ${id}`);
  //   }

  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }

  // updateTask(id: string, updateTask: UpdateTaskDTO): Task {
  //   const { title, description, status } = updateTask;
  //   const task = this.getTaskById(id);
  //   if (description) {
  //     task.description = description;
  //   }
  //   if (title) task.title = title;
  //   if (status) task.status = status;

  //   return task;
  // }

  // //Function to update task status only
  // updateTaskStatus(id: string, status: TaskStatus) {
  //   const updatingTask = this.getTaskById(id);
  //   updatingTask.status = status;

  //   return updatingTask;
  // }
}
