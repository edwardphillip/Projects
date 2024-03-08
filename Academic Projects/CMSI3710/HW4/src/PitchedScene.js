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
import { SinkHoleAnimator } from './SuperGroupLibrary/SuperGroupMeshes/SinkHoleAnimator.js'

const CANVAS_WIDTH = 512 + 256
const CANVAS_HEIGHT = 512
const maxPyramidCount = 4
let currentPyramidCount = 1

const smooth = true

const Sandbox = () => {
  const isWireframe = useRef(false)
  const mosesMode = useRef(false)
  const orthographic = useRef(false)

  const sinkHole = new SinkHoleAnimator({ maxDepth: -300 })
  const sinkHoleObj = sinkHole.getObj()
  sinkHoleObj.setRotationX(Math.PI / 6, Math.PI / 6)
  sinkHoleObj.setTranslation(0, -2500, -100)

  const underGround = new PlaneMesh(4, 4, 2, { r: 0.6, g: 0.4, b: 0.2 })
  const underGroundObj = new CustomObject(underGround, { x: 0, y: -300, z: -5900 }, 10000, 'triangles', smooth)
  underGroundObj.setRotationX(Math.PI / 5.5, Math.PI / 5.5)
  underGroundObj.setTranslation(0, -4000, 0)

  const sky = new PlaneMesh(4, 4, 2, { r: 0.5, g: 0.8, b: 1 })
  const skyObj = new CustomObject(sky, { x: 0, y: -20, z: -5900 }, 6000, 'triangles', smooth)
  skyObj.setTranslation(0, -5000, -8000)
  skyObj.setRotationX(Math.PI / 2, Math.PI / 2)
  skyObj.setScaling(15000, 15000, 15000)

  const obelisk = new ObeliskMesh(0.5, 0.3, { r: 1, g: 1, b: 1 })
  const obeliskObj = new CustomObject(obelisk, { x: 0, y: 0, z: -2100 }, 800, 'triangles', !smooth)
  obeliskObj.setTranslation(-2000, -2700, -4000)
  obeliskObj.setScaling(750, 750, 750)
  // obeliskObj.setRotationY(Math.PI/8, Math.PI/8)

  const pyramid = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj = new CustomObject(pyramid, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj.setTranslation(-3000, -2700, -2000)

  const pyramid2 = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj2 = new CustomObject(pyramid2, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj2.setTranslation(0, -2700, -4000)

  const pyramid3 = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj3 = new CustomObject(pyramid3, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj3.setTranslation(-3000, -2400, -3800)

  const pyramid4 = new PyramidMesh(0.5, 0.5, { r: 1, g: 1, b: 0 })
  const pyramidObj4 = new CustomObject(pyramid4, { x: 0, y: -5500, z: -2100 }, 3000, 'triangles')
  pyramidObj4.setTranslation(6000, -2200, -4000)


  const cube = new CubeMesh(1, { r: 0, g: 1, b: 0 })
  const cubeObj = new CustomObject(cube, { x: 0, y: 0, z: -2100 }, 1000, 'triangles')
  cubeObj.setScaling(500, 500, 500)
  cubeObj.setTranslation(1000, 2000, -2100)

  const TwisterMesh = new CubeTwisterMesh({ x: 0, y: 0, z: -2100 }, 'triangles')

  const flower = new FlowerMesh({ r: 1, g: 0, b: 0 })
  const flowerObj = new CustomObject(flower, { x: 0, y: 0, z: -2100 }, 1000, 'triangles')
  flowerObj.setScaling(50, 50, 50)
// 50 was originally good 
  const cactus = new CactusMesh({ r: 0, g: 1, b: 0 })
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
  const CactusGroup = new Group({ x: -1000, y: 200, z: -3000 })
  CactusGroup.transformations.rotationOrder = ['z', 'y', 'x']
  CactusGroup.setTranslation(-3000, -2400, -3000)
  const SkyGroup = new Group({ x: 0, y: 0, z: 0 })
  SkyGroup.transformations.rotationOrder = ['z', 'y', 'x']
  const obeliskGroup = new Group({ x: -1000, y: 200, z: -3000 })
  obeliskGroup.transformations.rotationOrder = ['z', 'y', 'x']

  function addPyramid() {
    if (currentPyramidCount > maxPyramidCount) {
      alert('Cannot add more pyramids')
    }
    if (currentPyramidCount === 0) {
      scene.add(pyramidObj)
    } else if (currentPyramidCount === 1) {
      scene.add(pyramidObj2)
    } else if (currentPyramidCount === 2) {
      scene.add(pyramidObj3)
    } else {
      scene.add(pyramidObj4)
    }
    currentPyramidCount += 1
  }

  function removePyramid() {
    if (currentPyramidCount < 0) {
      alert('Cannot remove more pyramids')
    }
    if (currentPyramidCount === 1) {
      scene.remove(pyramidObj)
    } else if (currentPyramidCount === 2) {
      scene.remove(pyramidObj2)
    } else if (currentPyramidCount === 3) {
      scene.remove(pyramidObj3)
    } else {
      scene.remove(pyramidObj4)
    }
    currentPyramidCount -= 1
  }

  scene.add(skyObj)
  scene.add(Sphere2Obj)
  scene.add(underGroundObj)
  //scene.add(planeObj)
  //scene.add(cactusObj)
  //scene.add(cubeObj)
  scene.add(obeliskObj)
  scene.add(pyramidObj)
  // scene.add(pyramid5Obj)
  scene.add(TwisterMesh)
  scene.add(sinkHoleObj)
  scene.add(cactusObj)
  //scene.add(CactusGroup)
  scene.add(flowerObj)
  scene.add(SphereObj)
  scene.add(obeliskGroup)
  entireSceneGroup.add(SkyGroup)
  entireSceneGroup.add(allPyramidsGroup)
  entireSceneGroup.add(obeliskGroup)
  entireSceneGroup.add(CactusGroup)

  scene.add(entireSceneGroup)

  const x = useRef(Math.PI / 8)

  const animate = timestamp => {
    //group.setRotationY(x.current, x.current)
    flowerObj.setRotationY(x.current * 0.5, x.current * 0.5)
    x.current += timestamp*.000008

    // Sphere2Obj.setTranslation(x.current * x.current, 1000, -2000)
    Sphere2Obj.setRotationY(x.current, x.current)
    SphereObj.setRotationY(x.current * 0.3, x.current * 0.3)

    TwisterMesh.setRotationY(x.current * 0.3, x.current * 0.3)

    const sinkHoleObj = sinkHole.objs[(sinkHole.timestamp + 1) % sinkHole.objs.length]
    sinkHoleObj.setRotationX(Math.PI / 6, Math.PI / 6)
    sinkHoleObj.setTranslation(0, -2500, -100)
    scene.setWireFrame(isWireframe.current)
    if (mosesMode.current) {
      sinkHole.animate(x.current, scene)
    }
    camera.projection = camera.projections[orthographic.current? 'orthographic': 'perspective']
  }

  return (
    <article>
      <p>
        The sandbox scene is where you can demonstrate features/capabilities of your library solely for the purpose of
        demonstrating them. It doesn’t have to fit any particular pitch or application.
      </p>

      <SuperRender scene={scene} animate={animate} />
      
      <button onClick={removePyramid}>Remove Pyramid</button>
      <button onClick={addPyramid}>Add Pyramid</button>
      <button onClick={()=>{isWireframe.current= !isWireframe.current}}>Wireframe/Solid</button>
      <button onClick={()=>{mosesMode.current = !mosesMode.current}}>Moses</button>
      <button onClick={()=>{
        orthographic.current = !orthographic.current
        }}>Orthographic/Perspective</button>
    </article>
  )
}

export default Sandbox
