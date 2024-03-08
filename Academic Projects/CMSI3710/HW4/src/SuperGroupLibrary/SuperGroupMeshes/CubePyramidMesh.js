import { Group } from '../SuperGroupTypes/group'
import { CustomObject } from '../SuperGroupTypes/object'
import { CubeMesh } from '../SuperGroupMeshes/CubeMesh.js'

export class CubePyramidMesh extends Group {
  constructor(position, mode) {
    super(position)
    

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const cube = new CubeMesh(1, { r: 1, g: 0.8, b: 0 })
        const cubeObj = new CustomObject(cube, { x: -1000, y: 0, z: -2100 }, 1000, mode)
        cubeObj.setScaling(100, 100, 100)
        cubeObj.setTranslation(1000 + 120 * i, -2000, -500 + 120 * j)
        this.add(cubeObj)
      }
    }
    for (let i = 1; i < 6; i++) {
      for (let j = 1; j < 6; j++) {
        const cube = new CubeMesh(1, { r: 1, g: 0.8, b: 0 })
        const cubeObj = new CustomObject(cube, { x: -1000, y: 0, z: -2100 }, 1000, mode)
        cubeObj.setScaling(100, 100, 100)
        cubeObj.setTranslation(1000 + 120 * i, -1880, -500 + 120 * j)
        this.add(cubeObj)
      }
    }
    for (let i = 2; i < 5; i++) {
      for (let j = 2; j < 5; j++) {
        const cube = new CubeMesh(1, { r: 1, g: 0.8, b: 0 })
        const cubeObj = new CustomObject(cube, { x: -1000, y: 0, z: -2100 }, 1000, mode)
        cubeObj.setScaling(100, 100, 100)
        cubeObj.setTranslation(1000 + 120 * i, -1760, -500 + 120 * j)
        this.add(cubeObj)
      }
    }
    for (let i = 3; i < 4; i++) {
      for (let j = 3; j < 4; j++) {
        const cube = new CubeMesh(1, { r: 1, g: 0.8, b: 0 })
        const cubeObj = new CustomObject(cube, { x: -1000, y: 0, z: -2100 }, 1000, mode)
        cubeObj.setScaling(100, 100, 100)
        cubeObj.setTranslation(1000 + 120 * i, -1640, -500 + 120 * j)
        this.add(cubeObj)
      }
    }
  }
}
