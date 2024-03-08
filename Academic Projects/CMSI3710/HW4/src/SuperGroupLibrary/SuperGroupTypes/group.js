import { SpatialEntity } from "./spatialentity"
export class Group extends SpatialEntity {
    dtype = 'group'
    constructor(position) {
      super(position)
      this.group = []
    }
    add = object => {
        if (object.dtype === 'object') {
          this.group.push(object)
        } else {
          this.group.unshift(object)
        }
      }
    remove = object => {
    // keeping all the objects that that are not the same
    this.group = this.group.filter(currentObject => currentObject !== object)
    }
  }