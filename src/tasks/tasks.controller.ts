import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getUser2 } from '../auth/decorator/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipes/tasks.validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.task-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks') // request to /tasks will be handled by this controller
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  private logger = new Logger('TasksController');
  //ParseIntPipe parse id param into an int
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @getUser2() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe) //use validation pipe method for the DTO Object
  createATask(@Body() createTaskDTO: CreateTaskDTO, @getUser2() user: User) {
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Delete('/:id')
  //ParseIntPipe => when a parameter come in check if it is a number if yes convert it
  deleteATaskById(
    @Param('id', ParseIntPipe) id: number,
    @getUser2() user: User,
  ) {
    return this.tasksService.deleteATask(id, user);
  }

  @Patch('/status/:id')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @getUser2() user: User,
  ) {
    return this.tasksService.updateTask(id, status, user);
  }

  @Get()
  getTasksByFilter(
    @Query(ValidationPipe) filterDTO: GetTaskFilterDTO,
    @getUser2() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving tasks, filter: ${JSON.stringify(
        filterDTO,
      )}`,
    );
    return this.tasksService.getFilteredTasks(filterDTO, user);
  }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string) {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Get()
  // getTasksByFilter(@Query(ValidationPipe) filterDTO: GetTaskFilterDTO): Task[] {
  //   if (!Object.keys(filterDTO).length) return this.tasksService.getAllTasks();
  //   return this.tasksService.getFilteredTasks(filterDTO);
  // }

  // @Post()
  // @UsePipes(ValidationPipe) //import
  // createATask(@Body() createTaskDTO: CreateTaskDTO) {
  //   return this.tasksService.createTask(createTaskDTO);
  // }

  // @Delete('/:id')
  // deleteATaskById(@Param('id') id: string) {
  //   this.tasksService.deleteATask(id);
  // }

  // @Patch('/status/:id')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  // ): Task {
  //   return this.tasksService.updateTaskStatus(id, status);
  // }

  //Not used
  //   @Patch('/update/:id')
  //   updateATaskById(
  //     @Param('id') id: string,
  //     @Body() updateTaskDTO: UpdateTaskDTO,
  //   ) {
  //     return this.tasksService.updateTask(id, updateTaskDTO);
  //   }
}
