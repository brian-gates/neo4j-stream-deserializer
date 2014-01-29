var should                  = require("should");
var Neo4jStreamDeserializer = require('../index');
var fs                      = require('fs');
var request                 = require('request');

describe('Neo4j deserializer', function () {

  it('should be able to parse a file', function (done) {
    var results = 0;
    fs
      .createReadStream('./test/mock/neo4j_response.json')
      .pipe(new Neo4jStreamDeserializer())
      .on('data', function (result){
        results++;
        result.n.test.should.be.ok;
      })
      .on('end', function() {
        results.should.eql(10);
        done();
      })
    ;
  });

  // it('should be able to parse a request response', function (done) {
  //   var results = 0;
  //   request.post({
  //       url     : 'http://localhost:7474/db/data/cypher',
  //       form    : { query: 'match (n {test: true}) return n limit 10' },
  //       headers : { "X-Stream": true, "Accept": "application/json" }
  //     })
  //     .pipe(new Neo4jStreamDeserializer())
  //     .on('data', function (result){
  //       results++;
  //       result.n.test.should.be.ok;
  //     })
  //     .on('end', function() {
  //       results.should.eql(10);
  //       done();
  //     })
  //   ;
  // });

});