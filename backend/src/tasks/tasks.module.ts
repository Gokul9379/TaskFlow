import { User, UserSchema } from '../schemas/user.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from '../schemas/task.schema';
import { WeatherModule } from '../weather/weather.module';
import { MailService } from '../mail.service'; // <-- 1. Import MailService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }, { name: User.name, schema: UserSchema }]),
    WeatherModule,
    CloudinaryModule,
  ],
  providers: [TasksService, MailService], // <-- 2. Add MailService here
  controllers: [TasksController]
})
export class TasksModule {}