
import { SpatialEntity } from './spatialentity'
import Vector from './vector'

export class Camera extends SpatialEntity {
  type = 'camera'
  setCamera = ({up = new Vector(1, 1, 0), Q = new Vector(0, 0, -1),P = new Vector(0, 0, 0)}) => {
    this.up=up;
    this.q=Q;
    this.p=P;
    const ze = P.subtract(Q).unit
    const ye = up.subtract(up.projection(ze)).unit
    const xe = ye.cross(ze)
    this.cameraMatrix = [
      xe.x, ye.x, ze.x, 0,
      xe.y, ye.y, ze.y, 0,
      xe.z, ye.z, ze.z, 0,
      -P.dot(xe), -P.dot(ye), -P.dot(ze), 1
    ]
  }
  constructor(position, type = 'perspective', L = -1920.0*1.5, R = 1920.0*1.5, B = -1920.0, T = 1920.0, N = 1000, F = 10000.0,up = new Vector(1, 1, 0), Q = new Vector(0, 0, -1),P = new Vector(0, 0, 0)) {
    super(position)

    this.setCamera({up:this.up,Q:this.q,P:this.p})
    this.projections = {
      orthographic: [
        2 / (R - L),
        0,
        0,
        0,
        0,
        2 / (T - B),
        0,
        0,
        0,
        0,
        -2 / (F - N),
        0,
        -(R + L) / (R - L),
        -(T + B) / (T - B),
        -(F + N) / (F - N),
        1
      ],
      perspective: [
        (2 * N) / (R - L),
        0,
        0,
        0,
        0,
        (2 * N) / (T - B),
        0,
        0,
        (R + L) / (L - R),
        (T + B) / (T - B),
        -(F + N) / (F - N),
        -1,
        0,
        0,
        (-2 * N * F) / (F - N),
        0
      ]
    }
    
    this.lookAt = (P) => {
      this.p=P
      this.setCamera({up:this.up,Q:this.q,P:P})
    }
    this.setUp = (up) => {
      this.up=up
      this.setCamera({up:up,Q:this.q,P:this.p})
    }
    this.setQ = (Q) => {
      this.q=Q
      this.setCamera({up:this.up,Q:Q,P:this.p})
    }
    this.projection = this.projections[type]
  }
}