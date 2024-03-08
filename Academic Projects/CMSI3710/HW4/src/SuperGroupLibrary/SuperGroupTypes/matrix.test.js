import { mat4 } from './matrix'

describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('Default to identity matrix', () => {
      const m0 = new mat4()
      expect(m0.values).toStrictEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    })
  })
})

describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('should instantiate and access 4x4 matrixes properly', () => {
      const m0 = new mat4([5, 0, 3, 1, 2, 6, 8, 8, 6, 2, 1, 5, 1, 0, 4, 6])
      const m1 = new mat4([7, 1, 9, 5, 5, 8, 4, 3, 8, 2, 3, 7, 0, 6, 8, 9])
      expect(m0.values).toStrictEqual([5, 0, 3, 1, 2, 6, 8, 8, 6, 2, 1, 5, 1, 0, 4, 6])
      expect(m1.values).toStrictEqual([7, 1, 9, 5, 5, 8, 4, 3, 8, 2, 3, 7, 0, 6, 8, 9])
      
    })
  })
})

describe('mat4 implementation', () => {
  describe('creation and data access', () => {
    it('multiplication works properly', () => {
      const m0 = new mat4([5, 0, 3, 1, 2, 6, 8, 8, 6, 2, 1, 5, 1, 0, 4, 6])
      const m1 = new mat4([7, 1, 9, 5, 5, 8, 4, 3, 8, 2, 3, 7, 0, 6, 8, 9])
      const m2 = new mat4([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
      expect(m0.mul(m1).values).toEqual([96, 24, 58, 90, 68, 56, 95, 107, 69, 18, 71, 81, 69, 52, 92, 142])
      expect(m0.mul(m2).values).toEqual(m0.values)
      expect(m1.mul(m2).values).toEqual(m1.values)
      
    })
    it('multiplication with negatives', () => {
      const m0 = new mat4([-1,2,-3,3,2,3,-5,3,3,3,5,-2,4,-2,3,3])
      const m1 = new mat4([-1,-2,1,-3,-2,-8,1,-2,-3,4,2,4,-5,9,2,2])
      const sol = new mat4([-12,1,9,-20,-19,-21,45,-38,33,4,11,11,37,19,-14,14])
      expect(m0.mul(m1).values).toEqual(sol.values)
    })
       it('associative property with multiplication', () => {
      const m0 = new mat4([1,2,1,2,1,2,-1,3,1,4,1,2,2,1,3,3])
      const m1 = new mat4([-1,1,1,2,2,1,1,2,4,0,2,0,1,2,2,2])
      const m2 = new mat4([1,2,3,1,1,1,1,1,0,2,3,4,-1,4,-2,3])
      const mres = new mat4([5,6,5,9,8,12,8,15,6,16,6,12,9,16,7,18])
      const sol = new mat4([48,94,46,93,28,50,26,54,70,136,62,138,42,58,36,81])
      expect(m0.mul(m1).values).toStrictEqual(mres.values)
      expect((m0.mul(m1)).mul(m2).values).toStrictEqual(sol.values)
      expect(m0.mul((m1).mul(m2)).values).toStrictEqual(sol.values)
    })
  })
})

describe('addition and subtraction', () => {
  it('should perform addition correctly', () => {
    const m0 = new mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    const m1 = new mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    const m2 = new mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    let val = m0.mul(m1)
    expect(m0.values).toHaveLength(16)
    expect(m0.values[0]).toEqual(1)
    expect(m0.values[2]).toEqual(0)
    expect(m0.values[3]).toEqual(0)
    expect(m0.values[4]).toEqual(0)
    let val2 = m1.mul(m2)
    expect(m1.values).toHaveLength(16)
  })
})
