'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newFeed;

describe('Feed API:', function() {
  describe('GET /api/feeds', function() {
    var feeds;

    beforeEach(function(done) {
      request(app)
        .get('/api/feeds')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          feeds = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(feeds).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/feeds', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/feeds')
        .send({
          name: 'New Feed',
          info: 'This is the brand new feed!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFeed = res.body;
          done();
        });
    });

    it('should respond with the newly created feed', function() {
      expect(newFeed.name).to.equal('New Feed');
      expect(newFeed.info).to.equal('This is the brand new feed!!!');
    });
  });

  describe('GET /api/feeds/:id', function() {
    var feed;

    beforeEach(function(done) {
      request(app)
        .get(`/api/feeds/${newFeed._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          feed = res.body;
          done();
        });
    });

    afterEach(function() {
      feed = {};
    });

    it('should respond with the requested feed', function() {
      expect(feed.name).to.equal('New Feed');
      expect(feed.info).to.equal('This is the brand new feed!!!');
    });
  });

  describe('PUT /api/feeds/:id', function() {
    var updatedFeed;

    beforeEach(function(done) {
      request(app)
        .put(`/api/feeds/${newFeed._id}`)
        .send({
          name: 'Updated Feed',
          info: 'This is the updated feed!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFeed = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFeed = {};
    });

    it('should respond with the updated feed', function() {
      expect(updatedFeed.name).to.equal('Updated Feed');
      expect(updatedFeed.info).to.equal('This is the updated feed!!!');
    });

    it('should respond with the updated feed on a subsequent GET', function(done) {
      request(app)
        .get(`/api/feeds/${newFeed._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let feed = res.body;

          expect(feed.name).to.equal('Updated Feed');
          expect(feed.info).to.equal('This is the updated feed!!!');

          done();
        });
    });
  });

  describe('PATCH /api/feeds/:id', function() {
    var patchedFeed;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/feeds/${newFeed._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Feed' },
          { op: 'replace', path: '/info', value: 'This is the patched feed!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFeed = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFeed = {};
    });

    it('should respond with the patched feed', function() {
      expect(patchedFeed.name).to.equal('Patched Feed');
      expect(patchedFeed.info).to.equal('This is the patched feed!!!');
    });
  });

  describe('DELETE /api/feeds/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/feeds/${newFeed._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when feed does not exist', function(done) {
      request(app)
        .delete(`/api/feeds/${newFeed._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
