import { Inject, Injectable, Type } from '@nestjs/common';
import { Request } from 'express';

import {
  BOOK_REPOSITORY_KEY,
  IBookRepository,
} from '@book/application/repository/book.repository.interface';
import { Book } from '@book/domain/book.entity';

import { REQUEST_USER_KEY } from '@iam/authentication/authentication.constants';
import { AuthorizationService } from '@iam/authorization/application/service/authorization.service';
import { AppAction } from '@iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@iam/user/domain/user.entity';

@Injectable()
export class UpdateBookPolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Update;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
    @Inject(BOOK_REPOSITORY_KEY)
    private readonly bookRepository: IBookRepository,
  ) {
    this.policyHandlerStorage.add(UpdateBookPolicyHandler, this);
  }

  async handle(request: Request): Promise<void> {
    const currentUser = this.getCurrentUser(request);
    const subjectOrSubjectCls = await this.getSubject(request);

    const isAllowed = this.authorizationService.isAllowed(
      currentUser,
      this.action,
      subjectOrSubjectCls,
    );

    if (!isAllowed) {
      throw new Error(
        `You are not allowed to ${this.action.toUpperCase()} this resource`,
      );
    }
  }

  private getCurrentUser(request: Request): User {
    return request[REQUEST_USER_KEY];
  }

  private async getSubject(request: Request): Promise<Book | Type<Book>> {
    const searchParam = request.params['id'];
    const subjectId = searchParam ? parseInt(searchParam) : undefined;
    const subject = await this.bookRepository.getOneById(subjectId);
    return subject ?? Book;
  }
}
