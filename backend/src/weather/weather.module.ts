import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherService],
  exports: [WeatherService], // Export it so TasksModule can use it!
})
export class WeatherModule {}