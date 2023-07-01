import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';

@Injectable()
export class TranslatedValidationPipe
  extends ValidationPipe
  implements PipeTransform
{
  constructor(private readonly i18n: I18nContext | undefined) {
    super();
  }

  transform(value: any, metadata: ArgumentMetadata): any {
    return super.transform(value, metadata);
  }

  protected transformException(error: any) {
    const translatedErrors = {};

    for (const key in error.constraints) {
      if (error.constraints.hasOwnProperty(key)) {
        translatedErrors[key] = this.i18n
          ? this.i18n.t(error.constraints[key])
          : error.constraints[key];
      }
    }

    return { message: translatedErrors };
  }
}
