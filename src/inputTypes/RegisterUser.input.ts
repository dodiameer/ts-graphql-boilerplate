import {
  IsDate,
  IsDateString,
  IsEmail,
  Length,
  MinLength,
  Validate,
} from "class-validator";
import { Field, InputType } from "type-graphql";
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from "class-validator-password-check";

const passwordRequirements: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainUpperLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: false,
};

@InputType()
export class RegisterUserInput {
  @Field()
  @Length(4, 32)
  username: string;

  @Field()
  fullname: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @Validate(PasswordValidation, [passwordRequirements])
  password: string;

  @Field({ nullable: true })
  @IsDateString()
  birthdate?: string;
}
