import { SphereGeometry, MeshBasicMaterial, Mesh, TextureLoader, Group } from 'three'

// Image copied from: https://raw.githubusercontent.com/CoryG89/MoonDemo/master/img/maps/moon.jpg
import fullMoon from '../textures/full-moon.jpg'

class Moon {
  constructor() {
    const textureLoader = new TextureLoader()

    this.geometry = new SphereGeometry(4, 60, 60)
    this.material = new MeshBasicMaterial({ map: textureLoader.load(fullMoon) })
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.position.z = -10
    this.mesh.position.y = 10
    this.mesh.position.x = 20

    this.group = new Group()
    this.group.add(this.mesh)
  }
}

export default Moon
