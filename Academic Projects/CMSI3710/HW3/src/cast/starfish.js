import { BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh, Group } from 'three'
import { Tween, Ease } from '@createjs/tweenjs'

// Here’s a case where Prettier doesn’t quite do the best job so we take the responsibility of formatting
// this ourselves.
//
// prettier-ignore
const BASE_VERTICES = [
  [0,    2,  0], 
  [-2,    1,   0], 
  [-1,   -1,  0], 
  [1,   -1,  0], 
  [2,  1, 0], 
  [0,    0.5, 0.5], 
  [0, 0.5, -0.5], 
  [-0.5,   1,  0], 
  [0.5,    1,  0],
  [0.5,   0.25,  0], 
  [-0.5,   0.25,   0], 
  [0,      0,      0]
]

// prettier-ignore
const BASE_COLORS = [
  [   1,    1,   0.5], 
  [ 0.5,    1,   0.5], 
  [   1,    1,   0.5], 
  [   0,  0.5,     0], 
  [0.25,    1,  0.75], 
  [ 0.5,  0.2,     0], 
  [ 0.5,  0.2,     0],  
  [ 0.5,  0.2,     0], 
  [ 0.5,  0.2,     0],  
  [ 0.5,  0.2,     0], 
  [ 0.5,  0.2,     0],  
  [ 0.5,  0.2,     0]
]

/**
 * Creates a custom geometry out of a raw listing of vertices. Working this out on graph paper can be
 * a good first step here! Alternatively, you can write some code to generate these vertices, if the
 * shape that you have in mind can be computed in some way.
 */
const createFacetedStarfishGeometry = () => {
  const geometry = new BufferGeometry()

  // We build each triangle as a separate face, copying a vertex if needed. Remember, counterclockwise
  // is the “front.”
  //
  // prettier-ignore
  const vertices = new Float32Array([
    ...BASE_VERTICES[0], ...BASE_VERTICES[7], ...BASE_VERTICES[5],
    ...BASE_VERTICES[0], ...BASE_VERTICES[5], ...BASE_VERTICES[8], 
    ...BASE_VERTICES[1], ...BASE_VERTICES[5], ...BASE_VERTICES[7], 
    ...BASE_VERTICES[1], ...BASE_VERTICES[10], ...BASE_VERTICES[5], 

    // ^^^^^ Rear upper-left quadrant (if looking at it from the front).
    ...BASE_VERTICES[2], ...BASE_VERTICES[5], ...BASE_VERTICES[10],
    ...BASE_VERTICES[11], ...BASE_VERTICES[5], ...BASE_VERTICES[2], 
    ...BASE_VERTICES[11], ...BASE_VERTICES[3], ...BASE_VERTICES[5], 
    ...BASE_VERTICES[3], ...BASE_VERTICES[9], ...BASE_VERTICES[5], 
    ...BASE_VERTICES[5], ...BASE_VERTICES[9], ...BASE_VERTICES[4], 
    ...BASE_VERTICES[8], ...BASE_VERTICES[5], ...BASE_VERTICES[4],
    ...BASE_VERTICES[0], ...BASE_VERTICES[6], ...BASE_VERTICES[7], 
    ...BASE_VERTICES[0], ...BASE_VERTICES[8], ...BASE_VERTICES[6], 
    ...BASE_VERTICES[1], ...BASE_VERTICES[7], ...BASE_VERTICES[6], 
    ...BASE_VERTICES[1], ...BASE_VERTICES[6], ...BASE_VERTICES[10], 
    ...BASE_VERTICES[11], ...BASE_VERTICES[3], ...BASE_VERTICES[6], 
    ...BASE_VERTICES[3], ...BASE_VERTICES[6], ...BASE_VERTICES[9], 
    ...BASE_VERTICES[6], ...BASE_VERTICES[4], ...BASE_VERTICES[9], 
    ...BASE_VERTICES[8], ...BASE_VERTICES[4], ...BASE_VERTICES[6],
    ...BASE_VERTICES[2], ...BASE_VERTICES[10], ...BASE_VERTICES[6], 
    ...BASE_VERTICES[2], ...BASE_VERTICES[11], ...BASE_VERTICES[6]
    
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  // We coordinate our colors to match the corresopnding vertex.
  //
  // prettier-ignore
  const colors = new Float32Array([
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],
    ...BASE_COLORS[5], ...BASE_COLORS[6], ...BASE_COLORS[7],

  ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // With every face having its “own” vertex (since vertices are always copied), the computed normals correspond
  // exactly to the faces’ directions, leading to a faceted look.
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Creates nearly the same geometry, but with a smooth look.
 */
const createSmoothStarfishGeometry = () => {
  const geometry = new BufferGeometry()

  // This effectively “flattens” our base vertices.
  const vertices = new Float32Array([
    ...BASE_VERTICES[0],
    ...BASE_VERTICES[1],
    ...BASE_VERTICES[2],
    ...BASE_VERTICES[3],
    ...BASE_VERTICES[4],
    ...BASE_VERTICES[5],
    ...BASE_VERTICES[6],
    ...BASE_VERTICES[7],
    ...BASE_VERTICES[8],
    ...BASE_VERTICES[9],
    ...BASE_VERTICES[10],
    ...BASE_VERTICES[11],
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  const colors = new Float32Array([
    ...BASE_COLORS[0],
    ...BASE_COLORS[1],
    ...BASE_COLORS[2],
    ...BASE_COLORS[3],
    ...BASE_COLORS[4],
    ...BASE_COLORS[5],
    ...BASE_COLORS[6],
    ...BASE_COLORS[7],
    ...BASE_COLORS[8],
    ...BASE_COLORS[9],
    ...BASE_COLORS[10],
    ...BASE_COLORS[11],
  ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // Note that this is effectively the same as the faceted version’s triangles, except that the use of
  // index values lets us _genuinely share_ a vertex (well, at least at this level) rather than copying
  // them for adjacent triangles.
  //
  // prettier-ignore
  geometry.setIndex([
    0, 5, 7, 
    0, 8, 5, 
    1, 7, 5, 
    1, 10, 5,
    11, 2, 5, 
    11, 3, 5, 
    3, 5, 9, 
    5, 9, 4,  
    8, 4, 5, 
    0, 6, 7, 
    0, 8, 6, 
    1, 7, 6, 
    1, 10, 6, 
    11, 2, 6, 
    11, 3, 6, 
    3, 6, 9,  
    6, 9, 4, 
    8, 4, 6,  
    2, 6, 10,
    2, 6, 11

  ])
  
  // Using `setIndex` causes faces/triangles to share vertices, which then causes vertex normal computation
  // to _average out_ the normals of multiple faces, thus creating a “smoothing” effect.
  geometry.computeVertexNormals()
  return geometry
}

class Starfish {
  constructor() {
    const starfishMaterial = new MeshPhongMaterial({ vertexColors: true })
    const starfishGeometry = createFacetedStarfishGeometry()
    const starfishMesh = new Mesh( starfishGeometry, starfishMaterial )
    starfishMesh.position.z = -5.1
    starfishMesh.position.y = 1
    starfishMesh.position.x = -2
    starfishMesh.scale.x = 0.5
    starfishMesh.scale.y = 0.5
    starfishMesh.scale.z = 0.5

    // facetedMesh.position.x = -6


    this.group = new Group()
    this.group.add(starfishMesh).position.y=4;
    this.group.add(starfishMesh).rotation.x=5;
    // this.group.add(smoothMesh)
  }

  reset() {
    Tween.get(this.group.rotation).to({ x: 0, y: 0, z: 0 }, 2000, Ease.sineInOut)
  }
}

export default Starfish
