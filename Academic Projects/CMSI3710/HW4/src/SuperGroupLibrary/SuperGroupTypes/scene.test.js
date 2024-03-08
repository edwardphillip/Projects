import { PlaneMesh } from '../SuperGroupMeshes/PlaneMesh'
import { Scene } from './scene'

describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('Default to identity matrix', () => {
      const s0 = new Scene()
      let obj = new Object(new PlaneMesh(1,1), { x: 0, y: -20, z: -2900 }, 1000, 'lines')
      s0.add(obj)
      expect(s0.objectsToDraw[0]).toBe(obj)
    })
  })
})