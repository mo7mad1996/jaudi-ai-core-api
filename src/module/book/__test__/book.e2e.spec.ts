import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import { BookResponseDto } from '@book/application/dto/book-response.dto';
import { CreateBookDto } from '@book/application/dto/create-book.dto';
import { UpdateBookDto } from '@book/application/dto/update-book.dto';

import { testModuleBootstrapper } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Book Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  beforeAll(async () => {
    await loadFixtures(`${__dirname}/fixture`, datasourceOptions);
    const moduleRef = await testModuleBootstrapper();
    app = moduleRef.createNestApplication({ logger: false });
    setupApp(app);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET - /book', () => {
    it('should return paginated books', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/book')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
              }),
            ]),
            pageNumber: expect.any(Number),
            pageSize: expect.any(Number),
            pageCount: expect.any(Number),
            itemCount: expect.any(Number),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should allow to filter by attributes', async () => {
      const title = 'Billy and the Cloneasaurus';

      await request(app.getHttpServer())
        .get(`/api/v1/book?filter[title]=${title}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                title,
              }),
            ]),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should allow to sort by attributes', async () => {
      const firstBook = { title: '' } as BookResponseDto;
      const lastBook = { title: '' } as BookResponseDto;
      let pageCount: number;

      await request(app.getHttpServer())
        .get('/api/v1/book?sort[title]=DESC')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          firstBook.title = body.data[0].name;
          pageCount = body.pageCount;
        });

      await request(app.getHttpServer())
        .get(`/api/v1/book?sort[title]=ASC&page[number]=${pageCount}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const resources = body.data;
          lastBook.title = resources[resources.length - 1].name;
          expect(lastBook.title).toBe(firstBook.title);
        });
    });

    it('should allow to select specific attributes', async () => {
      const attributes = ['title', 'description'] as (keyof BookResponseDto)[];

      await request(app.getHttpServer())
        .get(`/api/v1/book?fields[target]=${attributes.join(',')}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const resource = body.data[0];
          expect(Object.keys(resource).length).toBe(attributes.length);
          expect(resource).toEqual({
            title: expect.any(String),
            description: expect.any(String),
          });
        });
    });
  });

  describe('GET - /book/:id', () => {
    it('should return a specific book', async () => {
      const bookId = 1;

      await request(app.getHttpServer())
        .get(`/api/v1/book/${bookId}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: bookId,
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an error if book is not found', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/book/9999')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toBe('Book with ID 9999 not found');
        });
    });
  });

  describe('POST - /book', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Journey to the Center of the Earth',
        description:
          'This book is about the Journey to the Center of the Earth',
      } as CreateBookDto;

      await request(app.getHttpServer())
        .post('/api/v1/book/')
        .auth(adminToken, { type: 'bearer' })
        .send(createBookDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            title: createBookDto.title,
            description: createBookDto.description,
          });
          expect(body).toEqual(expectedResponse);
        });
    });
  });

  describe('PATCH - /book/:id', () => {
    it('should update an existing book', async () => {
      const createBookDto = {
        title: 'Vampire Hunter',
        description: 'This book is about the Vampire Hunter ',
      } as CreateBookDto;
      const updateBookDto = {
        title: 'Hunter Vampire',
        description: 'This book is about the Hunter Vampire',
      } as UpdateBookDto;
      let bookId: number;

      await request(app.getHttpServer())
        .post('/api/v1/book')
        .auth(adminToken, { type: 'bearer' })
        .send(createBookDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(Number),
            title: createBookDto.title,
            description: createBookDto.description,
          });
          expect(body).toEqual(expectedResponse);
          bookId = body.id;
        });

      await request(app.getHttpServer())
        .patch(`/api/v1/book/${bookId}`)
        .auth(adminToken, { type: 'bearer' })
        .send(updateBookDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: bookId,
            title: updateBookDto.title,
            description: updateBookDto.description,
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an error if book is not found', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/book/9999')
        .send({ title: 'non-existing-book' } as UpdateBookDto)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toBe('Book with ID 9999 not found');
        });
    });
  });

  describe('DELETE - /book/:id', () => {
    it('should delete a book', async () => {
      const createBookDto = {
        title: 'Journey to the planet',
        description: 'This book is about the Journey to the planet',
      } as CreateBookDto;
      let bookId: number;

      await request(app.getHttpServer())
        .post('/api/v1/book')
        .auth(adminToken, { type: 'bearer' })
        .send(createBookDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(Number),
            title: createBookDto.title,
            description: createBookDto.description,
          });
          expect(body).toEqual(expectedResponse);
          bookId = body.id;
        });

      await request(app.getHttpServer())
        .delete(`/api/v1/book/${bookId}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/api/v1/book/${bookId}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
