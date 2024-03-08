import { SpatialEntity } from './spatialentity'
import { toRawLineArray, toRawTriangleArray } from '../shapes'
export class CustomObject extends SpatialEntity {
  dtype = 'object'
  constructor(mesh, position, scale = 1, mode = 'triangles') {
    super(position)
    this.mesh = mesh
    this.setScaling(scale, scale, scale)
    this.colors = mesh.colors
    this.color = mesh.color
    this.vertices = mode === 'triangles' ? toRawTriangleArray(mesh) : toRawLineArray(mesh)
    this.normals = mesh.normals
    this.scale = scale
    this.mode = mode
    this.uv = mesh.uv
  }
}
