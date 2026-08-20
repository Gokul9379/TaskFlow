import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
  async updateNotificationSettings(userId: string, enabled: boolean) {
    return this.userModel.findByIdAndUpdate(
      userId, 
      { emailNotifications: enabled }, 
      { returnDocument: 'after' } // <-- Changed from { new: true }
    ).exec();
  }
}