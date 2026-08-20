import { MailService } from '../mail.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../schemas/task.schema';
import { User } from '../schemas/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import axios from 'axios'; 

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  async create(userId: string, userEmail: string, createTaskDto: CreateTaskDto): Promise<Task> {
    let weatherString = 'Weather unavailable';

    if (createTaskDto.location) {
      try {
        const apiKey = '2ef46b3c367c30524dc5176ddbe28ca1'; 
        const city = createTaskDto.location;
        
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const temp = Math.round(weatherResponse.data.main.temp);
        const desc = weatherResponse.data.weather[0].description;
        weatherString = `${desc}, ${temp}°C`;
      } catch (error) {
        console.error('Could not fetch weather for location:', createTaskDto.location);
      }
    }

    const newTask = new this.taskModel({ 
      ...createTaskDto, 
      user: userId,
      weather: weatherString 
    });
    const savedTask = await newTask.save();
    
    // --- Check Notification Preference Before Sending ---
    const user = await this.userModel.findById(userId);
    if (user && user.emailNotifications !== false) {
      this.mailService.sendEmail(
        userEmail,
        'New Task Created! 🎉',
        `Hello!\n\nYou successfully created a new task: "${savedTask.title}".\nPriority: ${savedTask.priority}\nLocation: ${savedTask.location}\nWeather: ${weatherString}\n\nGood luck!`
      );
    }

    return savedTask;
  }

  async findAll(userId: string, query: any) {
    const { status, priority, startDate, endDate, search, page = 1, limit = 10 } = query;
    const filter: any = { user: userId }; 

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' }; 
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      this.taskModel.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }).exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    return {
      data: tasks,
      meta: { total, page: Number(page), lastPage: Math.ceil(total / Number(limit)) },
    };
  }

  async findOne(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: taskId, user: userId }).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(userId: string, userEmail: string, taskId: string, updateData: Partial<CreateTaskDto>): Promise<Task> {
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: taskId, user: userId },
      updateData,
      { returnDocument: 'after' } 
    ).exec();
    
    if (!updatedTask) throw new NotFoundException('Task not found');

    // --- Check Notification Preference Before Sending ---
    const user = await this.userModel.findById(userId);
    if (user && user.emailNotifications !== false) {
      this.mailService.sendEmail(
        userEmail,
        'Task Updated! ✏️',
        `Hello!\n\nYour task "${updatedTask.title}" has been successfully updated.\nCurrent Status: ${updatedTask.status}\nPriority: ${updatedTask.priority}\n\nKeep up the great work!`
      );
    }

    return updatedTask;
  }

  async remove(userId: string, userEmail: string, taskId: string): Promise<{ message: string }> {
    const taskToDelete = await this.taskModel.findOne({ _id: taskId, user: userId }).exec();
    if (!taskToDelete) throw new NotFoundException('Task not found');

    const result = await this.taskModel.deleteOne({ _id: taskId, user: userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Task not found');

    // --- Check Notification Preference Before Sending ---
    const user = await this.userModel.findById(userId);
    if (user && user.emailNotifications !== false) {
      this.mailService.sendEmail(
        userEmail,
        'Task Deleted 🗑️',
        `Hello!\n\nYour task "${taskToDelete.title}" has been successfully deleted from your dashboard.`
      );
    }

    return { message: 'Task deleted successfully' };
  }
}