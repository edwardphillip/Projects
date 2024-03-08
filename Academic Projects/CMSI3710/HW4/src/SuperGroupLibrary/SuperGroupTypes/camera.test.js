import {Camera} from './camera'

describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('Default to identity matrix', () => {
      let position = { x: 0, y: -20, z: -2900 }
      const m0 = new Camera(position)
      expect(m0.position).toEqual(position)
    })
  })
})