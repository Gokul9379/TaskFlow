import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getWeatherByCity(city: string): Promise<any> {
    if (!city) return null;
    
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
      // firstValueFrom converts the Observable into a standard Promise
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;
      
      return {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
      };
    } catch (error: any) {
      // This will print the actual reason OWM rejected it
      const errorMessage = error.response?.data?.message || error.message;
      this.logger.error(`Failed to fetch weather for ${city}: ${errorMessage}`);
      return null;
    }
  }
}