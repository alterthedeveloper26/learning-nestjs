import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { exception } from 'console';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return [...this.tasks];
  }

  getFilteredTasks(getTaskFilterDTO: GetTaskFilterDTO): Task[] {
    const { status, search } = getTaskFilterDTO;
    console.log(search);
    let tempTasks = [...this.tasks];
    if (status) tempTasks = tempTasks.filter((task) => task.status === status);
    if (search) {
      tempTasks = tempTasks.filter(
        (task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }

    return tempTasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Can not find such id as ${id}`);
    }

    console.log(task);
    return task;
  }

  findTaskIndexById(id: string): number {
    const task = this.tasks.find((task) => task.id === id);
    return this.tasks.indexOf(task);
  }

  createTask(createTaskDTO: CreateTaskDTO) {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  //   deleteATask(id: string) {
  //     const taskId = this.findTaskIndexById(id);
  //     this.tasks.splice(taskId, 1);
  //   }

  deleteATask(id: string): void {
    if (!this.getTaskById(id)) {
      throw new exception(`Can not find such id as ${id}`);
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTask(id: string, updateTask: UpdateTaskDTO): Task {
    const { title, description, status } = updateTask;
    const task = this.getTaskById(id);
    if (description) {
      task.description = description;
    }
    if (title) task.title = title;
    if (status) task.status = status;

    return task;
  }

  //Function to update task status only
  updateTaskStatus(id: string, status: TaskStatus) {
    const updatingTask = this.getTaskById(id);
    updatingTask.status = status;

    return updatingTask;
  }
}
