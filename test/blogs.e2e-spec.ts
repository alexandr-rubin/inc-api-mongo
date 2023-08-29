import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { appSettings } from '../src/app.settings';
import { HttpStatusCode } from '../src/helpers/httpStatusCode';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { getTestConfiguration } from './config/test.config';

describe('Blogs (e2e)', () => {
  let app: INestApplication;
  let httpServer
  // let mongoServer: MongoMemoryServer

  beforeEach(async () => {
    // mongoServer = await MongoMemoryServer.create()
    // const mongoUri = mongoServer.getUri()
    // await mongoose.connect(mongoUri)
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(ConfigService) // Переопределение провайдера ConfigService
    .useValue({
      get: () => getTestConfiguration().db.mongo.mongodb_uri, // Использование тестового URI из тестовой конфигурации
    })
    .compile();

    app = moduleFixture.createNestApplication();

    appSettings(app)

    await app.init();

    httpServer = app.getHttpServer()
  });

  afterAll(async() => {
    await app.close()
    await mongoose.disconnect()
    // await mongoServer.stop()
  })

  const user =
    {
      "login": "zxc228",
      "password": "zxc228",
      "email": "zxc@mail.com"
    }
  describe('Delete all data', () => {
    it('Delete all', async function() {
      await request(httpServer).delete('/testing/all-data').expect(HttpStatusCode.NO_CONTENT_204)
    })
    it('sould return no users', async function() {
      //await request(httpServer).post('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send(user).expect(HttpStatusCode.CREATED_201)
      const usersRes = await request(httpServer).get('/sa/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').expect(HttpStatusCode.OK_200)
      expect(usersRes.body.items.length).toBe(0)
    })
    it('sould return no blogs', async function() {
      const blogsRes = await request(httpServer).get('/blogs').expect(HttpStatusCode.OK_200)
      expect(blogsRes.body.items.length).toBe(0)
    })
    it('sould return no posts', async function() {
      const postsRes = await request(httpServer).get('/posts').expect(HttpStatusCode.OK_200)
      expect(postsRes.body.items.length).toBe(0)
    })
  })
});
