// Transforms neo4j results to clean json
var util       = require('util');
var JSONStream = require('JSONStream');
var Transform  = require('stream').Transform;

util.inherits(Neo4jStreamDeserializer, Transform);

function Neo4jStreamDeserializer () {
  Transform.call(this, {
    objectMode: true
  });
  var columns = [];
  var column_parse = JSONStream.parse("columns");
  var data_parse   = JSONStream.parse("data.*");

  column_parse.on('data', function (c){
    this.emit('columns', c);
    columns = c;
  });
  data_parse.on('data', function (data){
    var result = {};
    columns.forEach(function (column, i) {
      result[column] = data[i].data;
    });
    this.push(result);
  }.bind(this));

  this._transform = function(data, format, done){
    // there's probably a more efficient way than doubling the streams here.
    column_parse.write(data, format);
    data_parse.write(data, format);
    done();
  }
}

module.exports = Neo4jStreamDeserializer;