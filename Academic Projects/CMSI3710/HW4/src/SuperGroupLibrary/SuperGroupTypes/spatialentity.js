import { mat4 } from "./matrix"

export class SpatialEntity {
    constructor(position) {
      this.position = { x: position.x, y: position.y, z: position.z }
      
      this.transformationOrder = ['rotation','scaling', 'translation']
      this.transformations = {
        rotationOrder: ['x', 'y', 'z'],
        rotation: {
          x: new mat4(),
          y: new mat4(),
          z: new mat4()
        },
        translation: new mat4(),
        scaling: new mat4()
      }
      this.setTranslation(this.position.x, this.position.y,this.position.z)
    }
  
    setScaling = (x = 1, y = 1, z = 1) => {
      //set x,y,z scaling
      this.transformations.scaling = new mat4([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1])
    }
    setTranslation = (x = 0, y = 0, z = 0) => {
      //set translation to x y z
      this.transformations.translation = new mat4([1, 0, 0, 0, 
                                                   0, 1, 0, 0, 
                                                   0, 0, 1, 0, 
                                                   x, y, z, 1])
    }
    setRotationX = (cv = 0, sv = 0) => {
      let c = Math.cos(cv)
      let s = Math.sin(sv)
      this.transformations.rotation.x = new mat4([1, 0, 0, 0,
                                         0, c, s, 0, 
                                         0, -s, c, 0,
                                          0, 0, 0, 1])
    }
    setRotationY = (cv = 0, sv = 0) => {
      let c = Math.cos(cv)
      let s = Math.sin(sv)
      this.transformations.rotation.y = new mat4([c, 0, -s, 0,
                                         0, 1, 0, 0, 
                                         s, 0, c, 0, 
                                         0, 0, 0, 1])
    }
    setRotationZ = (cv = 0, sv = 0) => {
      let c = Math.cos(cv)
      let s = Math.sin(sv)
      this.transformations.rotation.z = new mat4([c, s, 0, 0,
                                         -s, c, 0, 0,
                                          0, 0, 1, 0, 
                                          0, 0, 0, 1])
    }
    translateBy = (x = 0, y = 0, z = 0) => {
      //change translation by x y z
      this.transformations.translation.values[12] += x
      this.transformations.translation.values[13] += y
      this.transformations.translation.values[14] += z
    }
    setPosition = (x, y, z) => {
      //sets position
      this.position = {
        x: x,
        y: y,
        z: z
      }
    }
    getTransforms = () => {
      //returns array of transformation according to transformation order and rotation order
      const transforms = []
      const transformPushes = {
        rotation: () => {
          this.transformations.rotationOrder.forEach(item => transforms.unshift(this.transformations.rotation[item]))
        },
        translation: () => {
          transforms.unshift(this.transformations.translation)
        },
        scaling: () => {
          transforms.unshift(this.transformations.scaling)
        }
      }
      this.transformationOrder.forEach(item => transformPushes[item]())
      return transforms
    }
  }