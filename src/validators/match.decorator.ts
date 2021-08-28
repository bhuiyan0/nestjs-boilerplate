import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    if (!value || !relatedValue) return true;
    return value && value === relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const msg = `The ${relatedPropertyName} and $property do not match`;
    return msg;
    // return `$property must match ${relatedPropertyName} exactly`;
  }
}
