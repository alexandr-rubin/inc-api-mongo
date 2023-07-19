import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Length, Matches } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { add } from "date-fns";
import { generateHash } from 'src/helpers/generateHash';
import { v4 as uuidv4 } from 'uuid'

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

  public static async createUser(userDto: UserInputModel, isConfirmed: boolean): Promise<User> {
    const passwordHash = await generateHash(userDto.password)
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3
    })
    const newUser: User = {...userDto, password: passwordHash, createdAt: new Date().toISOString(), 
      confirmationEmail: { confirmationCode: uuidv4(), expirationDate: expirationDate.toISOString(), isConfirmed: isConfirmed},
      confirmationPassword: { confirmationCode: uuidv4(), expirationDate: expirationDate.toISOString() }
    }

    return newUser
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