import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PointController } from './../src/point/point.controller';


// npm
describe('PointController (e2e)', () => {
  let app: INestApplication;
  let controller: PointController

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    // controller = module.get<PointController>(PointController)
    await app.init()
  })

  it('/point/:id (GET)', () => {
    return request(app.getHttpServer())
        .get('/point/1')
        .expect(200)
        .expect((res) =>{
          expect(res.body).toHaveProperty('id')
          expect(res.body).toHaveProperty('point')
          expect(res.body).toHaveProperty('updateMillis')
        })
  })

  it('/point/:id/charge (PATCH)', ()=> {
    return request(app.getHttpServer())
        .patch('/point/1/charge')
        .send({amount:100})
        .expect(200)
        .expect((res) => {
            expect(res.body.point).toBeGreaterThanOrEqual(100)
            expect(res.body.point).toBeLessThan(10000000)
        })
  })    
  it('point/:id/histories (GET)', () =>{
    return request(app.getHttpServer())
        .get('/point/1/histories')
        .expect(200)
        .expect((res)=> {
            expect(res.body).toBeInstanceOf(Array)
        })
  })
  // 실패 케이스
  it('/point/:id/charge (PATCH) - 음수인 경우 BadRequestException', () =>{
    return request(app.getHttpServer())
        .patch('/point/1/charge')
        .send({amount: -100 })
        .expect(400)
  })

  it('/point/:id/charge (PATCH) - 최대값 초과 BadRequestException', () =>{
    return request(app.getHttpServer())
        .patch('/point/1/charge')
        .send({amount:1000000000})
        .expect(400)
  })

  it('/point/:id/use (PATCH) - 인풋값이 음수인 경우 BadRequestException', () => {
    return request(app.getHttpServer())
        .patch('/point/1/use')
        .send({amount: -50})
        .expect(400)
        .expect({ 
            statusCode: 400,
            message: "Negetive number input not allowed",
            error: "Bad Request"
          })
  })

  it('/point/:id/use (PATCH) - 가지고 있는 포인트보다 많은 값을 사용하려는 경우', () => {
    const excessiveAmount = 1000000; 

    return request(app.getHttpServer())
      .patch('/point/1/use')
      .send({ amount: excessiveAmount })
      .expect(400)
      .expect({ 
        statusCode: 400,
        message: "Insufficient points",
        error: "Bad Request"
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
