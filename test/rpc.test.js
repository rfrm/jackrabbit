var assert = require('chai').assert;
var jackrabbit = require('..');
var Queue = require('../lib/queue');
var util = require('./util');

describe('jackrabbit', function() {

  describe('rpc', function() {

    before(function connect(done) {
      this.broker = jackrabbit(util.RABBIT_URL, 1);
      this.broker.once('connected', done);
    });

    before(function createQueue(done) {
      this.name = util.NAME + '.rpc-add';
      this.broker.create(this.name, done);
    });

    before(function createHandler() {
      this.broker.handle(this.name, function add(message, reply) {
        reply(message.a + message.b);
      });
    });

    after(function cleanup(done) {
      this.broker.destroy(this.name, done);
    });

    it('handles an rpc response', function(done) {
      this.broker.publish(this.name, { a: 2, b: 3 }, function onResponse(err, response) {
        assert.ok(!err);
        assert.equal(response, 5);
        done();
      });
    });

  });
});
