import { IsIn, isIn, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class GetTaskFilterDTO {
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  search: string;
}
