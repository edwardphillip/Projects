import {
  TextureLoader,
  MeshPhongMaterial,
  Mesh,
  BoxGeometry,
  Group,
  OctahedronGeometry,
  CylinderGeometry,
  MeshBasicMaterial
} from 'three'
import { Tween, Ease } from '@createjs/tweenjs'
// Origin of the House Textures:
// http://cherba.com/wcs/tutorials/vns/061231/index.html
import fullhouse from '../textures/House1.jpeg'
// Credits for the image to Novaesky - Wooden Door
// https://www.filterforge.com/filters/15754.html
import doors from '../textures/doors.jpg'
// Credits of the image to FWStudio - Brown Wooden Board
// https://www.pexels.com/photo/brown-wooden-board-164005/
import dock from '../textures/pexels-engin-akyurt.jpg'

class House {
  constructor() {
    const texture = new TextureLoader().load(fullhouse)
    const texture2 = new TextureLoader().load(doors)
    const texture3 = new TextureLoader().load(dock)

    const geometry1 = new BoxGeometry(180, 100, 180)
    const material1 = new MeshPhongMaterial({ map: texture })
    const surface = new Mesh(geometry1, material1)

    surface.position.x = 0.0
    surface.position.y = 4
    surface.position.z = 23
    surface.scale.x *= 0.1
    surface.scale.y *= 0.1
    surface.scale.z *= 0.1

    const geometry2 = new OctahedronGeometry(130)
    const material2 = new MeshBasicMaterial({ color: 0x000000 })
    const surface2 = new Mesh(geometry2, material2)

    surface2.position.x = 0.0
    surface2.position.y = 9
    surface2.position.z = 23.3
    surface2.scale.x *= 0.1
    surface2.scale.y *= 0.1
    surface2.scale.z *= 0.1
    surface2.rotation.y = 0.8

    const geometry3 = new BoxGeometry(40, 40, 2)
    const material3 = new MeshPhongMaterial({ map: texture2 })
    const dors = new Mesh(geometry3, material3)

    dors.position.x = 0.0
    dors.position.y = 1
    dors.position.z = 14
    dors.scale.x *= 0.1
    dors.scale.y *= 0.1
    dors.scale.z *= 0.1

    const geometry4 = new CylinderGeometry(10, 10, 15, 10)
    const material4 = new MeshPhongMaterial({ map: texture3 })
    const cylinder = new Mesh(geometry4, material4)

    cylinder.position.x = 8
    cylinder.position.y = -1.5
    cylinder.position.z = 15
    cylinder.scale.x *= 0.1
    cylinder.scale.y *= 0.1
    cylinder.scale.z *= 0.1

    const geometry5 = new CylinderGeometry(10, 10, 15, 10)
    const cylinder2 = new Mesh(geometry5, material4)

    cylinder2.position.x = -8
    cylinder2.position.y = -1.5
    cylinder2.position.z = 15
    cylinder2.scale.x *= 0.1
    cylinder2.scale.y *= 0.1
    cylinder2.scale.z *= 0.1

    this.group = new Group()
    this.group.add(surface)
    this.group.add(dors)
    this.group.add(cylinder)
    this.group.add(cylinder2)
    this.group.add(surface2)
  }
  reset() {
    Tween.get(this.group.rotation).to({ x: 0, y: 0, z: 0 }, 2000, Ease.sineInOut)
  }
}
export default House
