import { TaskStatusValidationPipe } from '../pipes/tasks.validation.pipe';
import { TaskStatus } from '../tasks.model';
import { TasksService } from '../tasks.service';

export class UpdateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
}
