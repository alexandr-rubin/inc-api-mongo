import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id!: string
  @Prop()
  login!: string
  @Prop()
  password!: string
  @Prop()
  email!: string
  @Prop()
  createdAt!: string
  @Prop({type: {
    confirmationCode: String,
    expirationDate: String,
    isConfirmed: Boolean
  }})
  confirmationEmail!: {
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
  }
  @Prop({type: {
    confirmationCode: String, 
    expirationDate: Date
  }})
  confirmationPassword! : {
    confirmationCode: string, 
    expirationDate: Date
  }
}

export class UserViewModel {
  @Prop()
  id!: string
  @Prop()
  login!: string
  @Prop()
  email!: string
  @Prop()
  createdAt!: string
}

export class UserInputModel {
  @Prop()
  login!: string
  @Prop()
  password!: string
  @Prop()
  email!: string
}

export const UserSchema = SchemaFactory.createForClass(User);