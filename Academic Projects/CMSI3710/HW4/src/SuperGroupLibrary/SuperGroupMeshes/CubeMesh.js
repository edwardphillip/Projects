import { Mesh } from '../SuperGroupTypes/mesh'

function getVertices(size) {
  const a = size / 2
  const vertices = []
  for (let x of [-1, 1]) {
    for (let y of [-1, 1]) {
      for (let z of [-1, 1]) {
        vertices.push([x * a, y * a, z * a])
      }
    }
  }

  const facesByIndex = [
    [2, 0, 1],
    [1, 3, 2],
    [2, 4, 0],
    [4, 2, 6],
    [7, 3, 1],
    [5, 7, 1],
    [5, 4, 7],
    [7, 4, 6],
    [1, 4, 5],
    [0, 4, 1],
    [3, 6, 2],
    [3, 7, 6]
  ]

  return {vertices: vertices, facesByIndex: facesByIndex}
}

export class CubeMesh extends Mesh {
  constructor(size, color,smooth=false) {
    const { vertices, facesByIndex } = getVertices(size)
    super(vertices, facesByIndex, color, smooth)
  }
}


