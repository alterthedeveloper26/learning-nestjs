import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthDTO {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  // @Matches(/^([^0-9]*|[^A-Z]*|[^a-z]*)$/, {
  //   message: 'Pass word is too weak!!!',
  // })
  password: string;
}
