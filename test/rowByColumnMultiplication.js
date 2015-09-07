
var algebra = require('algebra'),
    should  = require('should')

var mul = require('../src/rowByColumnMultiplication')

var real = {
  addition      : function (a, b) { return a + b },
  multiplication: function (a, b) { return a * b }
}

var scalar,
    leftMatrix,
    leftIndices,
    rightMatrix,
    rightIndices,
    data

describe('rowByColumnMultiplication', function () {
  it('implements row by column multiplication', function () {
    scalar       = real
    leftMatrix   = [1, 0,
                    0, 1]
    rightMatrix  = [1, 0,
                    0, 1]

    data = mul(scalar, leftMatrix, 2, rightMatrix, 2)

    data.should.eql([1, 0,
                     0, 1])
  })
})
