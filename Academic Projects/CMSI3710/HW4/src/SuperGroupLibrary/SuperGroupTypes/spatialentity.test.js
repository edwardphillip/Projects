import {SpatialEntity} from './spatialentity'

describe('doing rotation test', () => {
    describe('creation and test', () => {
      it('should rotate', () => {
        const se = new SpatialEntity({ x: 0, y: 0, z: 0 })
        se.setRotationY(0,0)
        expect(se.transformations.rotation.y.values).toEqual([1, 0, 0, 0,
                                                       0, 1, 0, 0,
                                                       0, 0, 1, 0, 
                                                       0, 0, 0, 1])
        se.setRotationX(Math.PI/4,Math.PI/4)
        expect(se.transformations.rotation.x.values).toEqual([1, 0, 0, 0,
                                                      0, Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0, 
                                                      0, -Math.sin(Math.PI/4), Math.cos(Math.PI/4), 0,
                                                        0, 0, 0, 1])
        se.setRotationZ(Math.PI/2,Math.PI/2)                                               
        expect(se.transformations.rotation.z.values).toEqual([Math.cos(Math.PI/2), Math.sin(Math.PI/2), 0, 0,
                                                      -Math.sin(Math.PI/2), Math.cos(Math.PI/2), 0, 0,
                                                        0, 0, 1, 0, 
                                                        0, 0, 0, 1])
      })
      it('should set scaling', () => {
        const se = new SpatialEntity({ x: 0, y: 0, z: 0 })
        se.setScaling(2, 3, 4)
        expect(se.transformations.scaling.values).toEqual([2, 0, 0, 0,
                                                     0, 3, 0, 0,
                                                     0, 0, 4, 0,
                                                     0, 0, 0, 1])
      })
  
      it('should set translation', () => {
        const se = new SpatialEntity({ x: 0, y: 0, z: 0 })
        se.setTranslation(5, 6, 7)
        expect(se.transformations.translation.values).toEqual([1, 0, 0, 0,
                                                          0, 1, 0, 0,
                                                          0, 0, 1, 0,
                                                          5, 6, 7, 1])
      })
  
      it('should set position', () => {
        const se = new SpatialEntity({ x: 0, y: 0, z: 0 })
        se.setPosition(1, 2, 3)
        expect(se.position).toEqual({ x: 1, y: 2, z: 3 })
      })
  
      it('should do translation', () => {
        const se = new SpatialEntity({ x: 0, y: 0, z: 0 })
        se.translateBy(1, 2, 3)
        expect(se.transformations.translation.values).toEqual([1, 0, 0, 0,
                                                          0, 1, 0, 0,
                                                          0, 0, 1, 0,
                                                          1, 2, 3, 1])
      })
  
      it('should do scaling', () => {
        const se = new SpatialEntity({ x: 0, y: 0, z: 0 })
        se.setScaling(2, 3, 4)
        expect(se.transformations.scaling.values).toEqual([2, 0, 0, 0,
                                                     0, 3, 0, 0,
                                                     0, 0, 4, 0,
                                                     0, 0, 0, 1])
      })
  
    })
  })