// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;
  // Add this right below your other properties (like email, password, etc.)
  @Prop({ default: true })
  emailNotifications!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);