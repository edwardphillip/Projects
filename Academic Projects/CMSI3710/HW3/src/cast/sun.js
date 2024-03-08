import { SphereGeometry, MeshBasicMaterial, Mesh, Group } from 'three'

class Sun {
  constructor() {
    this.geometry = new SphereGeometry(4, 60, 60)
    this.material = new MeshBasicMaterial({ color: 0xf9d71c })
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.position.z = -10
    this.mesh.position.y = 10
    this.mesh.position.x = 20

    this.group = new Group()
    this.group.add(this.mesh)
  }
}

export default Sun
