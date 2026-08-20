import { UseInterceptors, UploadedFile, Controller, Get, Post, Body, Put, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { WeatherService } from '../weather/weather.service';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'; // <-- Import these

@ApiTags('Tasks') // Groups these routes under "Tasks" in the docs
@ApiBearerAuth()  // Tells Swagger these routes require a JWT token
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly weatherService: WeatherService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, req.user.email, createTaskDto);
  }

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.tasksService.findAll(req.user.userId, query);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTaskFile(
    @Request() req: any, 
    @Param('id') id: string, 
    @UploadedFile() file: any
  ) {
    const uploadResult = await this.cloudinaryService.uploadFile(file);
    // Added req.user.email here!
    return this.tasksService.update(req.user.userId, req.user.email, id, { 
      fileUrl: uploadResult.secure_url 
    });
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.userId, id);
  }

  @Put(':id')
  updatePut(@Request() req: any, @Param('id') id: string, @Body() updateTaskDto: Partial<CreateTaskDto>) {
    // Added req.user.email here!
    return this.tasksService.update(req.user.userId, req.user.email, id, updateTaskDto);
  }

  @Patch(':id')
  updatePatch(@Request() req: any, @Param('id') id: string, @Body() updateTaskDto: Partial<CreateTaskDto>) {
    // Added req.user.email here!
    return this.tasksService.update(req.user.userId, req.user.email, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    // Added req.user.email here!
    return this.tasksService.remove(req.user.userId, req.user.email, id);
  }
}