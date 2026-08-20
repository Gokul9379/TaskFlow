import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: User;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ enum: ['PENDING', 'IN_PROGRESS', 'DONE'], default: 'PENDING' })
  status!: string;

  @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
  priority!: string;

  @Prop()
  dueDate!: Date;

  @Prop()
  location!: string;

  // Add this new property for the weather!
  @Prop()
  weather!: string;

  @Prop()
  fileUrl!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);