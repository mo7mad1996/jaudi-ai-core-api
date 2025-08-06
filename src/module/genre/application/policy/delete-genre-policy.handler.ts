import { Inject, Injectable, Type } from '@nestjs/common';
import { Request } from 'express';

import {
  GENRE_REPOSITORY_KEY,
  IGenreRepository,
} from '@genre/application/repository/genre.repository.interface';
import { Genre } from '@genre/domain/genre.entity';

import { REQUEST_USER_KEY } from '@iam/authentication/authentication.constants';
import { AuthorizationService } from '@iam/authorization/application/service/authorization.service';
import { AppAction } from '@iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@iam/user/domain/user.entity';

@Injectable()
export class DeleteGenrePolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Delete;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
    @Inject(GENRE_REPOSITORY_KEY)
    private readonly genreRepository: IGenreRepository,
  ) {
    this.policyHandlerStorage.add(DeleteGenrePolicyHandler, this);
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

  private async getSubject(request: Request): Promise<Genre | Type<Genre>> {
    const searchParam = request.params['id'];
    const subjectId = searchParam ? parseInt(searchParam) : undefined;
    const subject = await this.genreRepository.getOneById(subjectId);
    return subject ?? Genre;
  }
}
