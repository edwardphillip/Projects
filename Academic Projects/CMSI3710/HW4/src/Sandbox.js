/**
 * Build out this component to display a “sandbox” scene—see the description below.
 */
// sup
import { useRef } from 'react'
import { ObeliskMesh } from './SuperGroupLibrary/SuperGroupMeshes/ObeliskMesh.js'
import { PyramidMesh } from './SuperGroupLibrary/SuperGroupMeshes/PyramidMesh.js'
import { Camera } from './SuperGroupLibrary/SuperGroupTypes/camera.js'
import { CustomObject } from './SuperGroupLibrary/SuperGroupTypes/object'
import { Group } from './SuperGroupLibrary/SuperGroupTypes/group'
import { Scene } from './SuperGroupLibrary/SuperGroupTypes/scene'
import { PlaneMesh } from './SuperGroupLibrary/SuperGroupMeshes/PlaneMesh'
import { CactusMesh } from './SuperGroupLibrary/SuperGroupMeshes/CactusMesh'
import { SphereMesh } from './SuperGroupLibrary/SuperGroupMeshes/SphereMesh'
import { Sphere2Mesh } from './SuperGroupLibrary/SuperGroupMeshes/Sphere2Mesh'
import { CubeMesh } from './SuperGroupLibrary/SuperGroupMeshes/CubeMesh.js'
import Vector from './SuperGroupLibrary/SuperGroupTypes/vector.js'
import { CubeTwisterMesh } from './SuperGroupLibrary/SuperGroupMeshes/TwisterMesh.js'
import { FlowerMesh } from './SuperGroupLibrary/SuperGroupMeshes/FlowerMesh.js'
import SuperRender from './SuperGroupLibrary/SuperRender.js'

const CANVAS_WIDTH = 512+256
const CANVAS_HEIGHT = 512

const smooth = true
const equation = (x, z) => {
  return (
    0.05 * Math.max(0.25 * Math.sin((x + z) * 10) + 0.75 * Math.sin((x + z) * 10), Math.sin((x + z) * 10) - 0.1) +
    0.1 * Math.sin((x - z) * 2) +
    0.02 * Math.sin((50 * x - z) * 2)
  )
}

const Sandbox = () => {
  const plane = new PlaneMesh(4, 4, 4, { r: 0.8, g: 0.5, b: 0.2 },!smooth,equation)
  const planeObj = new CustomObject(plane, { x: 0, y: -20, z: -5900 }, 10000, 'triangles')
  // planeObj.setRotationX(Math.PI / 4, Math.PI / 4)
  planeObj.setTranslation(0, -3000, 0)

  const sky = new PlaneMesh(4, 4, 1, { r: .75, g: .75, b: 1 },smooth)
  const skyObj = new CustomObject(sky, { x: 0, y: 0, z: 0 }, 600000, 'triangles')
  skyObj.setTranslation(8000, -5000, -8000)
  skyObj.setRotationX(Math.PI / 2, Math.PI / 2)



  const sky1 = new PlaneMesh(40, 40, 1, { r: .7, g: .8, b: 1 },smooth)
  const skyObj1 = new CustomObject(sky1, { x: 0, y: 0, z: 0 }, 600000, 'triangles')
  skyObj1.setTranslation(-8000, -5000, 1000)
  skyObj1.setRotationX(Math.PI / 2, Math.PI / 2)
  skyObj1.setRotationY(Math.PI*3/2, Math.PI*3/2)


  const sky2 = new PlaneMesh(40, 40, 1, { r: .8, g: .7, b: 1 },smooth)
  const skyObj2 = new CustomObject(sky2, { x: 0, y: 0, z: 0 }, 600000, 'triangles')
  skyObj2.setTranslation(8000, -5000, -1000)
  skyObj2.setRotationX(Math.PI / 2, Math.PI / 2)
  skyObj2.setRotationY(3*Math.PI/4, 3*Math.PI/4)

  
  const obelisk = new ObeliskMesh(0.5, 0.3, { r: 1, g: 1, b: 1 })
  const obeliskObj = new CustomObject(obelisk, { x: 0, y: 0, z: -2100 }, 800, 'triangles')
  obeliskObj.setTranslation(-2000, -2700, -4000)
  obeliskObj.setScaling(750, 750, 750)
  // obeliskObj.setRotationY(Math.PI/8, Math.PI/8)

  const pyramid = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj = new CustomObject(pyramid, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj.setTranslation(-3000, -2700, -2000)

  const pyramid2 = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj2 = new CustomObject(pyramid2, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj2.setTranslation(8000, -2700, 89000)

  const pyramid3 = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj3 = new CustomObject(pyramid3, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj3.setTranslation(3000, -2700, -6000)

  const cube = new CubeMesh(1, { r: 0, g: 1, b: 0 })
  const cubeObj = new CustomObject(cube, { x: 0, y: 0, z: -2100 }, 1000, 'triangles')
  cubeObj.setScaling(500, 500, 500)
  cubeObj.setTranslation(1000, 2000, -2100)

  const TwisterMesh = new CubeTwisterMesh({ x: 0, y: 0, z: -2100 })

  const flower = new FlowerMesh({ r: 0, g: 1, b: 1 })
  const flowerObj = new CustomObject(flower, { x: 0, y: 0, z: -2100 }, 1000, 'triangles')
  flowerObj.setScaling(50, 50, 50)

  const cactus = new CactusMesh({ r: 1, g: 0, b: 0 })
  const cactusObj = new CustomObject(cactus, { x: 0, y: 0, z: -2100 }, 300, 'triangles')
  //cactusObj.setRotationY(Math.PI / 16, Math.PI / 16)

  const sphere = new SphereMesh(1, 0.5, { r: 1, g: 0, b: 0 })
  const SphereObj = new CustomObject(sphere, { x: 0, y: 0, z: -2100 }, 100, 'triangles')
  SphereObj.setTranslation(-1200, 350, -2400)

  const sphere2 = new Sphere2Mesh(1, { r: 1, g: 0, b: 0 })
  const Sphere2Obj = new CustomObject(sphere2, { x: 0, y: 0, z: -2100 }, 600, 'triangles')
  Sphere2Obj.setTranslation(3000, 5000, -4100)

  const camera = new Camera({ x: 0, y: 0, z: 5 }, 'perspective')
  const scene = new Scene(CANVAS_HEIGHT, CANVAS_WIDTH, camera, new Vector(1, 1, 1))

  camera.setCamera({ up: new Vector(0, 1, 0), Q: new Vector(0, 1, -1), P: new Vector(0, 1, 0) })
  camera.lookAt(new Vector(0, 1, 0))

  const entireSceneGroup = new Group({ x: 0, y: 0, z: 0 })
  entireSceneGroup.transformations.rotationOrder = ['z', 'y', 'x']
  const allPyramidsGroup = new Group({ x: 0, y: 0, z: 0 })
  allPyramidsGroup.transformations.rotationOrder = ['z', 'y', 'x']
  const CactusGroup = new Group({ x: 0, y: 0, z: 0 })
  CactusGroup.transformations.rotationOrder = ['z', 'y', 'x']
  CactusGroup.setTranslation(-1000, 200, -3000)
  const SkyGroup = new Group({ x: 0, y: 0, z: 0 })
  SkyGroup.transformations.rotationOrder = ['z', 'y', 'x']
  const obeliskGroup = new Group({ x: -1000, y: 200, z: -3000 })
  obeliskGroup.transformations.rotationOrder = ['z', 'y', 'x']

  scene.add(skyObj)
  scene.add(skyObj1)
  scene.add(skyObj2)
  scene.add(Sphere2Obj)
  scene.add(planeObj)
  scene.add(pyramidObj)
  scene.add(pyramidObj2)
  scene.add(TwisterMesh)
  scene.add(pyramidObj3)
  scene.remove(pyramidObj3)

  CactusGroup.add(flowerObj)
  CactusGroup.add(cactusObj)
  scene.add(CactusGroup)
  scene.add(obeliskGroup)
  entireSceneGroup.add(SkyGroup)
  entireSceneGroup.add(allPyramidsGroup)

  scene.add(entireSceneGroup)

  const x = useRef(Math.PI / 8)

  const animate = (timesincelastframe) => {
    flowerObj.setRotationY(x.current * 2, x.current * 2)
    x.current += timesincelastframe*.00001
    camera.lookAt(new Vector(-Math.cos(x.current)*100-1100,0,2100))
    Sphere2Obj.setRotationY(x.current, x.current)
    SphereObj.setRotationY(x.current * 0.3, x.current * 0.3)
  }

  return (
    <article>
      <p>
        The sandbox scene is where you can demonstrate features/capabilities of your library solely for the purpose of
        demonstrating them. It doesn’t have to fit any particular pitch or application.
      </p>
      <SuperRender scene={scene} animate={animate} />
    </article>
  )
}

export default Sandbox
