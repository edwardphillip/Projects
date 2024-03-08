import {Mesh} from './mesh'

describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('Default to identity matrix', () => {
      const m0 = new Mesh([1,1,1,0,0,0,10,10,10])
      expect(m0.vertices).toEqual([1,1,1,0,0,0,10,10,10])
    })
  })
})