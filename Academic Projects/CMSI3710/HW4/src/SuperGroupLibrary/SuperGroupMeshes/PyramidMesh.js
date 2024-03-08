import { Mesh } from '../SuperGroupTypes/mesh'

function getVertices(b, h) {
  return {
    vertices: [
      [-b / 2, 0.0, -b / 2],
      [b / 2, 0.0, -b / 2],
      [b / 2, 0.0, b / 2],
      [-b / 2, 0.0, b / 2],
      [0.0, h, 0.0]
    ],

    facesByIndex: [
      [4, 1, 0],
      [4, 2, 1],
      [4, 3, 2],
      [4, 0, 3],
      [3, 0, 1],
      [1, 2, 3]
    ]
  }
}

export class PyramidMesh extends Mesh {
  constructor(b, h, color) {
    const {vertices,facesByIndex} = getVertices(b, h)
    super(vertices,facesByIndex, color)
  }
}
