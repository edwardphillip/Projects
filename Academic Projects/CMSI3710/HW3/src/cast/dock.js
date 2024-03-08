import { CylinderGeometry, TextureLoader, MeshPhongMaterial, Mesh, BoxGeometry, Group } from 'three'
import { Tween, Ease } from '@createjs/tweenjs'
// Credits of the image to FWStudio - Brown Wooden Board
// https://www.pexels.com/photo/brown-wooden-board-164005/
import dock from '../textures/pexels-engin-akyurt.jpg'

class Dock {
  constructor() {
    const geometry = new CylinderGeometry(10, 10, 15, 10)
    const texture = new TextureLoader().load(dock)
    const material = new MeshPhongMaterial({ map: texture })
    const cylinder = new Mesh(geometry, material)

    cylinder.position.x = -2.0
    cylinder.position.y = -1.5
    cylinder.position.z = -3.0
    cylinder.scale.x *= 0.1
    cylinder.scale.y *= 0.1
    cylinder.scale.z *= 0.1

    const geometry1 = new CylinderGeometry(10, 10, 15, 10)
    const cylinder1 = new Mesh(geometry1, material)

    cylinder1.position.x = 2.0
    cylinder1.position.y = -1.5
    cylinder1.position.z = 3.0
    cylinder1.scale.x *= 0.1
    cylinder1.scale.y *= 0.1
    cylinder1.scale.z *= 0.1

    const geometry2 = new CylinderGeometry(10, 10, 15, 10)
    const cylinder2 = new Mesh(geometry2, material)

    cylinder2.position.x = 2.0
    cylinder2.position.y = -1.5
    cylinder2.position.z = -3.0
    cylinder2.scale.x *= 0.1
    cylinder2.scale.y *= 0.1
    cylinder2.scale.z *= 0.1

    const geometry3 = new CylinderGeometry(10, 10, 15, 10)
    const cylinder3 = new Mesh(geometry3, material)

    cylinder3.position.x = -2.0
    cylinder3.position.y = -1.5
    cylinder3.position.z = 3.0
    cylinder3.scale.x *= 0.1
    cylinder3.scale.y *= 0.1
    cylinder3.scale.z *= 0.1

    const geometry4 = new BoxGeometry(60, 2, 300)
    const surface = new Mesh(geometry4, material)

    surface.position.x = 0.0
    surface.position.y = -1.0
    surface.position.z = 11.8
    surface.scale.x *= 0.1
    surface.scale.y *= 0.1
    surface.scale.z *= 0.1

    this.group = new Group()
    this.group.add(cylinder)
    this.group.add(cylinder1)
    this.group.add(cylinder2)
    this.group.add(cylinder3)
    this.group.add(surface)
  }
  reset() {
    Tween.get(this.group.rotation).to({ x: 0, y: 0, z: 0 }, 2000, Ease.sineInOut)
  }
}
export default Dock
