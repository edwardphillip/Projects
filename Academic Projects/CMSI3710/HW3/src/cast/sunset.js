import { SphereGeometry, MeshBasicMaterial, Mesh, Group } from 'three'

class Sunset {
  constructor() {
    this.geometry = new SphereGeometry(60, 60, 60)
    this.material = new MeshBasicMaterial({ color: 0xcd1818 })
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.position.z = -200
    this.mesh.position.y = -2
    this.mesh.position.x = 0

    this.group = new Group()
    this.group.add(this.mesh)
  }
}

export default Sunset
