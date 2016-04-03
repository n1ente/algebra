var determinant = require('laplace-determinant')
var inherits = require('inherits')
var no = require('not-defined')
var matrixToArrayIndex = require('./matrixToArrayIndex')
var operators = require('./operators.json')
var rowByColumnMultiplication = require('./rowByColumnMultiplication')
var staticProps = require('static-props')
var TensorSpace = require('./TensorSpace')
var tensorContraction = require('tensor-contraction')
var toData = require('./toData')
var VectorSpace = require('./VectorSpace')

/**
 * Space of m x n matrices
 *
 * ```
 * var R = algebra.R
 *
 * var R2x2 = algebra.MatrixSpace(R)(2)
 * ```
 *
 * @param {Object} Scalar
 *
 * @returns {Function} anonymous with signature (numRows[, numCols])
 */

function MatrixSpace (Scalar) {
  var contraction = tensorContraction.bind(null, Scalar.addition)

  /**
   *
   * @param {Number} numRows
   * @param {Number} [numCols] defaults to a square matrix.
   *
   * @returns {Function} Matrix
   */

  return function (numRows, numCols) {
    // numCols defaults to numRows
    if (no(numCols)) numCols = numRows

    var isSquare = (numRows === numCols)
    var indices = [numRows, numCols]

    var AbstractMatrix = TensorSpace(Scalar)(indices)

    /**
     * Calculates the matrix trace.
     *
     * https://en.wikipedia.org/wiki/Trace_(linear_algebra)
     *
     * @param {Object|Array} matrix
     *
     * @returns {Object} scalar
     */

    function trace (matrix) {
      var matrixData = toData(matrix)

      return contraction([0, 1], indices, matrixData)
    }

    /**
     * Multiplies row by column to the right.
     *
     * @param {Object|Array} rightMatrix
     *
     * @returns {Object} matrix
     */

    function multiplication (leftMatrix, rightMatrix) {
      var leftMatrixData = toData(leftMatrix)
      var rightMatrixData = toData(rightMatrix)

      // For this static version, it is assumed that leftMatrix is numRows by numCols.
      var leftNumRows = numRows
      var leftNumCols = numCols

      var rightNumRows = leftNumCols
      var rightNumCols = rightMatrixData.length / rightNumRows

      return rowByColumnMultiplication(Scalar, leftMatrixData, leftNumRows, rightMatrixData, rightNumCols)
    }

    /**
     * Calculates the transpose of a matrix.
     *
     * @param {Object|Array} matrix
     *
     * @returns {Array} matrix
     */

    function transpose (matrix) {
      var matrixData = toData(matrix)
      var transposedData = []

      for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
          var index = matrixToArrayIndex(i, j, numCols)
          var transposedIndex = matrixToArrayIndex(j, i, numRows)

          transposedData[transposedIndex] = matrixData[index]
        }
      }

      return transposedData
    }

    /**
     * @class
     */

    function Matrix (data) {
      AbstractMatrix.call(this, data)

      staticProps(this)({
        numCols: numCols,
        numRows: numRows
      })

      function computeDeterminant () {
        var det = determinant(data, Scalar, numRows)

        return new Scalar(det)
      }

      if (isSquare) {
        staticProps(this)({
          trace: trace(data)
        })

        Object.defineProperties(this, {
          determinant: { get: computeDeterminant },
          det: { get: computeDeterminant }
        })
      }

      function transposed () {
        var result = transpose(data)

        if (numRows === 1) {
          var Vector = VectorSpace(Scalar)(numCols)
          return new Vector(result)
        } else {
          var Matrix = MatrixSpace(Scalar)(numCols, numRows)
          return new Matrix(result)
        }
      }

      Object.defineProperties(this, {
        transposed: { get: transposed },
        tr: { get: transposed }
      })
    }

    inherits(Matrix, AbstractMatrix)

    if (isSquare) {
      Matrix.trace = trace
    }

    Matrix.prototype.multiplication = function (rightMatrix) {
      var leftMatrixData = this.data
      var result = multiplication(leftMatrixData, rightMatrix)

      var rightNumRows = numCols
      var rightNumCols = result.length / rightNumRows

      var Matrix = MatrixSpace(Scalar)(rightNumRows, rightNumCols)

      return new Matrix(result)
    }

    // Static operators.

    Matrix.multiplication = multiplication
    Matrix.transpose = transpose

    // Aliases

    Matrix.tr = Matrix.transpose
    Matrix.mul = Matrix.multiplication

    Matrix.prototype.mul = Matrix.prototype.multiplication

    operators.group.forEach((operator) => {
      operators.aliasesOf[operator].forEach((alias) => {
        Matrix[alias] = Matrix[operator]
        Matrix.prototype[alias] = Matrix.prototype[operator]
      })
    })

    operators.group.forEach((operator) => {
      Matrix[operator] = AbstractMatrix[operator]
    })

    staticProps(Matrix)({
      numCols: numCols,
      numRows: numRows
    })

    return Matrix
  }
}

module.exports = MatrixSpace
