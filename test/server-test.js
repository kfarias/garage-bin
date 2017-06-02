process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const server = require('../server');

const configuration = require('../knexfile').test;
const database = require('knex')(configuration);


chai.use(chaiHttp)

describe('Server testing', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() =>  database.seed.run())
      .then(() => {
        done();
    });
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('GET /api/v1/items', () => {
    it('should retreive all the items', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.should.have.length(5)
        response.body[0].should.have.property('name')
        response.body[0].should.have.property('whyItStays')
        response.body[0].should.have.property('cleanliness')
        done()
      })
    })
    it('should return error is path does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/itemssss')
      .end((error, response) => {
        response.should.have.status(404)
        done()
      })
    })
  })
  describe('POST /api/v1/items', () => {
    it.skip('should be able to add new item', (done) => {
      chai.request(server)
      .post('/api/v1/items')
        .send({
          id: 382,
          name: 'bags',
          whyItStays: 'idk',
          cleanliness: 'sparklking',
        })
        .end((error, response) => {
        response.should.have.status(201)
        response.should.be.json
        response.body.should.be.a('object')
        response.body.id.should.equal(382)
        response.body.name.should.equal('bags')
        response.body.whyItStays.should.equal('idk')
        response.body.cleanliness.should.equal('sparkling')
        done()
      })
    })
    it('should return 422 if your post is missing data', (done) => {
      chai.request(server)
      .post('/api/v1/items')
      .send({
        id: 4,
        name: 'car',
        cleanliness: 'Sparkling',
      })
      .end((error, response) => {
        response.should.have.status(422);
        done();
        });
      });
    });
  describe('PUT /api/v1/items/:id/edit', () => {
    it.skip('should update an item in the garage', (done) => {
      chai.request(server)
      .put('/api/v1/garage/1/edit')
      .end((error, response) => {
        response.body[0].id.should.equal(1);
        response.body[0].name.should.equal('christmass decorations');
      });

      chai.request(server)
      .patch('/api/v1/garage/1')
      .send({
        name: 'cats',
      })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.id.should.equal(1);
        response.body.name.should.equal('cats');
        done();
      });
    });
    it('should return 404 if the attribute does not exist', (done) => {
      chai.request(server)
      .put('/api/v1/items/1')
      .send({
        blah: 'cats',
      })
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });
  describe('DELETE /api/v1/items/:id', () => {
    it.skip('should be able to delete item', (done) => {
      chai.request(server)
      .delete('/api/v1/items/1')
      .end((error, response) => {
      response.should.have.status(200)
      done()
    })
  })
    it('should return 404 if your post is missing data', (done) => {
      chai.request(server)
      .delete('/api/v1/items')
      .end((error, response) => {
        response.should.have.status(404);
        done();
        });
      });
    });
  })
