import { IsString, IsNotEmpty, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish Final Project', description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Complete the backend Swagger integration', description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'HIGH', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Priority level' })
  @IsString()
  @IsIn(['LOW', 'MEDIUM', 'HIGH'])
  priority!: string;

  @ApiProperty({ example: '2026-08-25', description: 'When the task is due' })
  @IsDateString()
  dueDate!: string;

  @ApiProperty({ example: 'Chennai', description: 'City name for weather fetching' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ required: false, description: 'Optional Cloudinary image URL' })
  @IsOptional()
  @IsString()
  fileUrl?: string; // Optional properties with '?' do not need the '!'
}