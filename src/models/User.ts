import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Length, Matches } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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
    expirationDate: String
  }})
  confirmationPassword! : {
    confirmationCode: string, 
    expirationDate: string
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
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Only alphanumeric characters, underscores, and hyphens are allowed',
  })
  login!: string
  @IsString()
  @Length(6, 20)
  password!: string
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email!: string
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toString();
})