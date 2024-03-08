import { toRawTriangleArray, toRawLineArray } from './shapes'
import { Mesh} from '../SuperGroupLibrary/SuperGroupTypes/mesh'
    describe('toRawTriangleArray', () => {
        it('start with empty geometry', () => {
          const protoGeometry = new Mesh([],[])
          const result = toRawTriangleArray(protoGeometry);
          expect(result).toEqual([]);
        })
        it('fill the geometry up', () => {
          const protoGeometry = {
            facesByIndex: [
              [0,2,1],
              [2,1,0]
            ],
            vertices: [
            [1,3,5],
            [2,4,6],
            [1,1,3]
            ]
          }
        const result = toRawTriangleArray(protoGeometry);
        expect(result).toEqual([1,3,5,1,1,3,2,4,6,1,1,3,2,4,6,1,3,5]);
        })
      })
    
      describe('toRawLineArray', () => {
        it('start with empty geometry', () => {
          const protoGeometry = new Mesh([],[])
          const result = toRawLineArray(protoGeometry);
          expect(result).toEqual([]);
        })
        it('fill the geometry up', () => {
          const protoGeometry = {
            facesByIndex: [
              [2,1,4],
              [3,2,1]
            ],
            vertices: [
            [0,1,4],
            [2,5,3],
            [1,1,3],
            [0,1,3],
            [3,1,2]
            ]
          }
          const result = toRawLineArray(protoGeometry);
          console.log(result)
          expect(result).toEqual([1,1,3,2,5,3,2,5,3,3,1,2,3,1,2,1,1,3,0,1,3,1,1,3,1,1,3,2,5,3,2,5,3,0,1,3]);
    })
  })
