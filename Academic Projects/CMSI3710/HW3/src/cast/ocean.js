import { Group, PlaneGeometry, MeshBasicMaterial, DoubleSide, Mesh } from 'three'

class Ocean {
  constructor() {
    this.geometry = new PlaneGeometry(1000, 1000, 32)
    this.material = new MeshBasicMaterial({ color: 0x1da2d8, side: DoubleSide })
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.rotation.x = Math.PI / 2
    this.mesh.position.y = -2

    this.group = new Group()
    this.group.add(this.mesh)
  }
}
export default Ocean
