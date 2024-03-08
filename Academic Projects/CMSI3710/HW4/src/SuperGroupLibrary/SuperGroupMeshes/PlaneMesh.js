import { Mesh } from '../SuperGroupTypes/mesh'
/** A Clayton special
 *
 * @param {*length of my plane} length
 * @param {*width of plane} width
 * @param {*equation of plane x, z => y} equation
 * @param {*number of splits in x and z} precision
 * @returns {*vertices and facesByIndex} verticesObj
 */

function getVertices(length, width, equation, p) {
  const precision = 2 ** p
  //equation=(x,z)=>{return Math.sin(Math.tan(x*z))}
  const maxZ = length / 2
  const minZ = -maxZ
  const maxX = width / 2
  const minX = -maxX
  const vertices = []
  const facesByIndex = []
  for (let x = minX; x <= maxX; x += width / precision) {
    for (let z = minZ; z <= maxZ; z += length / precision) {
      vertices.push([x, equation(x / 2, z / 2), z])
    }
  }

  for (let row = 0; row <= precision; row++) {
    for (let column = 0; column < precision; column++) {
      const rp = row * precision
      const rp1 = (row + 1) * precision
      if ((column + rp) % (precision + 1) !== precision) {
        facesByIndex.push([column + rp, column + 1 + rp, column + 1 + rp1])
      } else {
        facesByIndex.push([column + rp, column + 1 + rp1, column + 1 + rp1])
      }
      if ((column + rp) % (precision + 1) !== 0) {
        facesByIndex.push([column + rp, column + 1 + rp1, column + rp1])
      }
    }
  }
  return { vertices: vertices, facesByIndex: facesByIndex }
}
/**
 * Plane Mesh with equation
 */
export class PlaneMesh extends Mesh {
  /**
   *
   * @param {*length of my plane} length
   * @param {*width of plane} width
   * @param {*number of splits in x and z} precision
   * @param {*equation of plane x, z => y} equation
   * @returns {*vertices and facesByIndex}
   */
  constructor(
    length,
    width,
    precision = 10,
    color = { r: 1, g: 0, b: 0 },
    smooth = true,
    equation = (_x, _z) => {
      return 0
    }
  ) {
    const { vertices, facesByIndex } = getVertices(length, width, equation, precision)
    super(vertices, facesByIndex, color, smooth)
    this.length = length
    this.width = width
    this.precision = precision
  }
}
