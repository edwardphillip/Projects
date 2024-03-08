import { Mesh } from '../SuperGroupTypes/mesh'

function getVertices(X, Z) {
  return {
    vertices: [
      // Base (0-7)
      [-X, 0, -X],  //back left bottom    0
      [-X, 0, X],   //front left bottom   1
      [X, 0, X],    //front right bottom  2
      [X, 0, -X],   //back right bottom   3
      [-X * 0.8, 0.5, -X * 0.8],  //back left top    4
      [-X * 0.8, 0.5, X * 0.8],   //front left top    5
      [X * 0.8, 0.5, X * 0.8],    //front right top    6
      [X * 0.8, 0.5, -X * 0.8],   //back right top    7
      // Upper pyramid (8-12)
      [-X * 0.5, 4.0 - Z, -X * 0.5],
      [-X * 0.5, 4.0 - Z, X * 0.5],
      [X * 0.5, 4.0 - Z, X * 0.5],
      [X * 0.5, 4.0 - Z, -X * 0.5],
      [0, 4.0, 0],
      // Tip pyramid (13-21)
      [-X * 0.2, 4.0 + Z, -X * 0.2],
      [-X * 0.2, 4.0 + Z, X * 0.2],
      [X * 0.2, 4.0 + Z, X * 0.2],
      [X * 0.2, 4.0 + Z, -X * 0.2],
      [0, 4.0 + 2 * Z, 0],
      [-X * 0.1, 4.0 + 2 * Z, -X * 0.1],
      [-X * 0.1, 4.0 + 2 * Z, X * 0.1],
      [X * 0.1, 4.0 + 2 * Z, X * 0.1],
      [X * 0.1, 4.0 + 2 * Z, -X * 0.1]
    ],

    facesByIndex: [
      // Base
      [1, 4, 0],  //left side
      [5, 4, 1],  
      [2, 5, 1],  //front side
      [6, 5, 2],
      [3, 6, 2],  //right side
      [7, 6, 3],
      [0, 7, 3],  //back side
      [4, 7, 0],
      //next little section maybe? (I just added 4 to what you did above for base because of how you structured it)
      [5, 8, 4],  //left side
      [9, 8, 5],  
      [6, 9, 5],  //front side
      [10, 9, 6],
      [7, 10, 6],  //right side
      [11, 10, 7],
      [4, 11, 7],  //back side
      [8, 11, 4],

      // Upper pyramid
      [9, 16, 8],
      [17, 16, 9],
      [10, 17, 9],
      [18, 17, 10],
      [11, 18, 10],
      [19, 18, 11],
      [8, 19, 11],
      [16, 19, 8],
      // Tip pyramid...?
   
      [16, 17, 13], //
      [21, 17, 13],
      [18, 21, 17], //
      [20, 21, 18],
      [15, 20, 18], //
      [14, 20, 15],
      [13, 20, 14], //
      [17, 20, 13]
    ]
  }
}

export class ObeliskMesh extends Mesh {
  constructor(X, Z, color, smooth=false) {
    const {vertices, facesByIndex} = getVertices(X, Z)
    super(vertices,facesByIndex, color, smooth)
  }
}
