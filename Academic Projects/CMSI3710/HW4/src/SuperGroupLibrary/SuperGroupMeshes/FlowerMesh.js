import { Mesh } from '../SuperGroupTypes/mesh'

function getVertices() {
  const vertices = [
    //front view
    [-4, 9, 1],
    [-4, 4, 1],
    [-2, 7, 1],
    [0, 9, 1],
    [2, 7, 1],
    [4, 9, 1],
    [4, 4, 1],
    [0, 0, 1]
  ]
  const facesByIndex = [
    [1, 2, 0],
    [7, 2, 1],
    [6, 4, 7],
    [6, 5, 4],
    [7, 4, 2],
    [2, 4, 3]
  ]
  return { vertices: vertices, facesByIndex: facesByIndex }
}

export class FlowerMesh extends Mesh {
  constructor(color, smooth = false) {
    const { vertices, facesByIndex } = getVertices()
    super(vertices, facesByIndex, color, smooth)
  }
}
