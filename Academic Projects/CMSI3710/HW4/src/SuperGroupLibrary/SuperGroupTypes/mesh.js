import { computeVertexNormals } from '../shapes'

export class Mesh {
  constructor(vertices, facesByIndex, color = { r: 0, g: 0, b: 1 }, smooth = true) {
    this.vertices = vertices
    this.facesByIndex = facesByIndex
    if (color?.r !== null) {
      this.color = color
    } else {
      this.colors = color
    }
    this.normals = computeVertexNormals({ vertices: this.vertices, facesByIndex: this.facesByIndex }, smooth)
  }
}
