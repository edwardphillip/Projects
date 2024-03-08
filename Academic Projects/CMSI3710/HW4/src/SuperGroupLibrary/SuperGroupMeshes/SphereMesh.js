
import { Mesh } from '../SuperGroupTypes/mesh'

function getVertices(X, Z) {
   let vertices = [
    [-X, 0.0, Z],
    [X, 0.0, Z],
    [-X, 0.0, -Z],
    [X, 0.0, -Z],
    [0.0, Z, X],
    [0.0, Z, -X],
    [0.0, -Z, X],
    [0.0, -Z, -X],
    [Z, X, 0.0],
    [-Z, X, 0.0],
    [Z, -X, 0.0],
    [-Z, -X, 0.0]
  ]

  // Normalize vertices to form a sphere
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i]
    const magnitude = Math.sqrt(vertex[0] ** 2 + vertex[1] ** 2 + vertex[2] ** 2)
    vertices[i] = [vertex[0] / magnitude ** 4, vertex[1] / magnitude ** 4, vertex[2] / magnitude ** 4]
  }

  // Calculate center of icosahedron
  const center = vertices
    .reduce(
      (acc, vertex) => {
        return [acc[0] + vertex[0], acc[1] + vertex[1], acc[2] + vertex[2]]
      },
      [0, 0, 0]
    )
    .map(val => val / vertices.length)

   let facesByIndex = [
    [1, 4, 0],
    [4, 9, 0],
    [4, 5, 9],
    [8, 5, 4],
    [1, 8, 4],
    [1, 10, 8],
    [10, 3, 8],
    [8, 3, 5],
    [3, 2, 5],
    [3, 7, 2],
    [3, 10, 7],
    [10, 6, 7],
    [6, 11, 7],
    [6, 0, 11],
    [6, 1, 0],
    [10, 1, 6],
    [11, 0, 9],
    [2, 11, 9],
    [5, 2, 9],
    [11, 2, 7]
  ]

  // Divide each face into smaller triangles
  const newFacesByIndex = []
  for (let i = 0; i < facesByIndex.length; i++) {
    const face = facesByIndex[i]
    const v1 = vertices[face[0]]
    const v2 = vertices[face[1]]
    const v3 = vertices[face[2]]
    const centerToV1 = [v1[0] - center[0], v1[1] - center[1], v1[2] - center[2]]
    const centerToV2 = [v2[0] - center[0], v2[1] - center[1], v2[2] - center[2]]
    const centerToV3 = [v3[0] - center[0], v3[1] - center[1], v3[2] - center[2]]
    const newVertices = [
      v1,
      v2,
      v3,
      [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2],
      [(v2[0] + v3[0]) / 2, (v2[1] + v3[1]) / 2, (v2[2] + v3[2]) / 2],
      [(v3[0] + v1[0]) / 2, (v3[1] + v1[1]) / 2, (v3[2] + v1[2]) / 2],
      [(v1[0] + v2[0] + v3[0]) / 3, (v1[1] + v2[1] + v3[1]) / 3, (v1[2] + v2[2] + v3[2]) / 3]
    ]
    const newVerticesIndices = [0, 1, 2, 3, 4, 5, 6].map(index => {
      const vertex = newVertices[index]
      const magnitude = Math.sqrt(vertex[0] ** 2 + vertex[1] ** 2 + vertex[2] ** 2)
      const normalizedVertex = [vertex[0] / magnitude, vertex[1] / magnitude, vertex[2] / magnitude]
      const existingVertexIndex = vertices.findIndex(existingVertex => {
        return (
          Math.abs(existingVertex[0] - normalizedVertex[0]) < 0.00001 &&
          Math.abs(existingVertex[1] - normalizedVertex[1]) < 0.00001 &&
          Math.abs(existingVertex[2] - normalizedVertex[2]) < 0.00001
        )
      })
      if (existingVertexIndex !== -1) {
        return existingVertexIndex
      }
      vertices.push(normalizedVertex)
      return vertices.length - 1
    })
    newFacesByIndex.push([newVerticesIndices[0], newVerticesIndices[3], newVerticesIndices[5]])
    newFacesByIndex.push([newVerticesIndices[3], newVerticesIndices[1], newVerticesIndices[4]])
    newFacesByIndex.push([newVerticesIndices[5], newVerticesIndices[4], newVerticesIndices[2]])
    newFacesByIndex.push([newVerticesIndices[3], newVerticesIndices[4], newVerticesIndices[5]])
  }

  return {
    vertices: vertices,
    facesByIndex: newFacesByIndex
  }
}

export class SphereMesh extends Mesh {
  constructor(X, Z) {
    const { vertices, facesByIndex } = getVertices(X, Z)
    super(vertices, facesByIndex)
  }
}
