import { Mesh } from '../SuperGroupTypes/mesh'

function getSphereVertices(radius, widthSegments, heightSegments) {
  const vertices = []

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments
    const theta = v * Math.PI

    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments
      const phi = u * Math.PI * 2

      const px = -radius * Math.cos(phi) * Math.sin(theta)
      const py = radius * Math.cos(theta)
      const pz = radius * Math.sin(phi) * Math.sin(theta)

      vertices.push([px, py, pz])
    }
  }

  return vertices
}

function getSphereFaces(widthSegments, heightSegments) {
  const faces = []

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const i = y * (widthSegments + 1) + x
      const j = i + (widthSegments + 1) 
     if (i < 16) {
        faces.push([i, j, j + 1])
      } else{
        faces.push([i, j, j + 1])
        faces.push([i, j + 1, i + 1])
      }
    }
  }

  return faces
}

export class Sphere2Mesh extends Mesh {
  constructor(radius, color, widthSegments = 16, heightSegments = 16) {
    const vertices = getSphereVertices(radius, widthSegments, heightSegments)
    const facesByIndex = getSphereFaces(widthSegments, heightSegments)
    super(vertices, facesByIndex, color)
  }
}