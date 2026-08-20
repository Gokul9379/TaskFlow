import { User, UserSchema } from '../schemas/user.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from '../schemas/task.schema';
import { WeatherModule } from '../weather/weather.module'; // <-- Add this import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema } ,{ name: User.name, schema: UserSchema }]),
    WeatherModule,
    CloudinaryModule, // <-- Add this here
  ],
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule {}