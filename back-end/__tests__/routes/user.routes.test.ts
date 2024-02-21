import request from "supertest";

import app from "../../src/app";

describe('GET /users', () => {
  it('GET /users => array of items', () => {
    return request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            page: expect.any(Number),
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
              }),
            ])
          }),
        );
      });
  });

  it('GET /users/:id => items by ID', () => {
    return request(app)
      .get('/users/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        console.log(response.body)
        expect(response.body).toEqual(
          expect.objectContaining({
            data:  expect.objectContaining({
              id: expect.any(Number),
            }),
          })
        );
      });
  });

  it('GET users/:id => 404 if item not found', () => {
    return request(app).get('/users/10000000000').expect(404);
  });

  it('POST /users/create => create NEW item', () => {
    return (
      request(app)
        .post('/users/create')
        .send({
          name: 'Cyrus',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              name: 'Cyrus',
            })
          );
        })
    );
  });
});