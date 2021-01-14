import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipes/tasks.validation.pipe';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks') // request to /tasks will be handled by this controller
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Get()
  getTasksByFilter(@Query(ValidationPipe) filterDTO: GetTaskFilterDTO): Task[] {
    if (!Object.keys(filterDTO).length) return this.tasksService.getAllTasks();
    return this.tasksService.getFilteredTasks(filterDTO);
  }

  @Post()
  @UsePipes(ValidationPipe) //import
  createATask(@Body() createTaskDTO: CreateTaskDTO) {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Delete('/:id')
  deleteATaskById(@Param('id') id: string) {
    this.tasksService.deleteATask(id);
  }

  @Patch('/status/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  //   @Patch('/update/:id')
  //   updateATaskById(
  //     @Param('id') id: string,
  //     @Body() updateTaskDTO: UpdateTaskDTO,
  //   ) {
  //     return this.tasksService.updateTask(id, updateTaskDTO);
  //   }
}
