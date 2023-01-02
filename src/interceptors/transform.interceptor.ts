import { classToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Record<string, any>> {
    return next.handle().pipe(map(data => classToPlain(data)));
  }
}