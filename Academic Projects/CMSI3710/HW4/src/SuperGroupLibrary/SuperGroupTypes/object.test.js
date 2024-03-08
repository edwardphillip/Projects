import {CustomObject} from './object'
import { PlaneMesh } from '../SuperGroupMeshes/PlaneMesh'


describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('Default to identity matrix', () => {
      let mesh = new PlaneMesh(1,1);
      const m0 = new CustomObject(mesh, { x: 0, y: -20, z: -2900 }, 1000, 'lines');
      expect(m0.mesh).toBe(mesh);
    })
  })
})