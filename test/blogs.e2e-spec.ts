import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';
import { HttpStatusCode } from '../src/helpers/httpStatusCode';

describe('Blogs (e2e)', () => {
  let app: INestApplication;
  let httpServer

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    appSettings(app)

    await app.init();

    httpServer = app.getHttpServer()
  });

  afterAll(async() => {
    await app.close()
  })

  describe('Get blogs', () => {
    it('sould return no blogs', function() {
      request(httpServer).get('/blogs').expect(HttpStatusCode.OK_200)
    })
  })
});
