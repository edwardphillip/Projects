import { BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh, Group, DoubleSide, CylinderGeometry } from 'three'
//import { Tween, Ease } from '@createjs/tweenjs'

// Here’s a case where Prettier doesn’t quite do the best job so we take the responsibility of formatting
// this ourselves.
//
// prettier-ignore
const BASE_VERTICES = [
  [-1, 0, 0], // 0: Left middle.
  [0, 0, 0.5], // 1: Front middle.
  [1, 0, 0], // 2: Right middle.
  [0, 0, -0.5], // 3: Back middle.
  [-0.4, 0.2, 0.1], // 4: Top. - front
  [-0.7, -0.5, 0.2], // 5: Left Bottom - front.
  [0.5, -0.5, 0.2], // 6: Right Bottom - front.
  [-0.7, -0.5, -0.2], // 7: Left Bottom - back.
  [0.5, -0.5, -0.2], // 8: Right Bottom - back.
  [-0.4, 0.2, -0.1], // 9: Top. - back
  [0.1, 0.2, 0.1], // 10 top right - front
  [0.1, 0.2, -0.1], // 11 top right - back
  [-0.6, 1.2, 0] // 12 top point
]

// prettier-ignore
const BASE_COLORS = [
  [1, 1, 0.5], // 0: Bright yellow-ish.
  [0.5, 1, 0.5], // 1: Light green.
  [1, 1, 0.5], // 2: Bright yellow-ish.
  [0, 0.5, 0], // 3. Medium green.
  [0.25, 1, 0.75], // 4: Light cyan-ish.
  [0.5, 0.2, 0], // 5: Dark orange-ish.
  [0.5, 0.2, 0], // 6: Dark orange-ish.
  [226 / 255, 226 / 255, 227 / 255], // 7: Light grey.
  [145 / 255, 145 / 255, 145 / 255], // 8: grey
  [71 / 255, 71 / 255, 71 / 255] // 9: dark grey.
]

/**
 * Creates a custom geometry out of a raw listing of vertices. Working this out on graph paper can be
 * a good first step here! Alternatively, you can write some code to generate these vertices, if the
 * shape that you have in mind can be computed in some way.
 */
const createFacetedFinGeometry = () => {
  const geometry = new BufferGeometry()

  // We build each triangle as a separate face, copying a vertex if needed. Remember, counterclockwise
  // is the “front.”
  //

  // prettier-ignore
  const vertices = new Float32Array([
    //front faces
    ...BASE_VERTICES[4], ...BASE_VERTICES[5], ...BASE_VERTICES[6], // Front bottom quadrant.
    ...BASE_VERTICES[4], ...BASE_VERTICES[10], ...BASE_VERTICES[6], //mid
    ...BASE_VERTICES[4], ...BASE_VERTICES[10], ...BASE_VERTICES[12], //upper

    //back faces
    ...BASE_VERTICES[9], ...BASE_VERTICES[8], ...BASE_VERTICES[7], // Rear bottom quadrant.
    ...BASE_VERTICES[9], ...BASE_VERTICES[11], ...BASE_VERTICES[8], //mid
    ...BASE_VERTICES[9], ...BASE_VERTICES[11], ...BASE_VERTICES[12], //upper

    //right faces
    ...BASE_VERTICES[10], ...BASE_VERTICES[11], ...BASE_VERTICES[12],
    ...BASE_VERTICES[10], ...BASE_VERTICES[6], ...BASE_VERTICES[8], 
    ...BASE_VERTICES[10], ...BASE_VERTICES[8], ...BASE_VERTICES[11],

    //left faces
    ...BASE_VERTICES[4], ...BASE_VERTICES[9], ...BASE_VERTICES[12],
    ...BASE_VERTICES[4], ...BASE_VERTICES[9], ...BASE_VERTICES[5],
    ...BASE_VERTICES[9], ...BASE_VERTICES[5], ...BASE_VERTICES[7],

    //bottom faces
    ...BASE_VERTICES[5], ...BASE_VERTICES[6], ...BASE_VERTICES[7], 
    ...BASE_VERTICES[6], ...BASE_VERTICES[7], ...BASE_VERTICES[8]
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  // We coordinate our colors to match the corresopnding vertex.
  //
  // prettier-ignore
  const colors = new Float32Array([
    ...BASE_COLORS[8], ...BASE_COLORS[7], ...BASE_COLORS[7],
    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[7],
    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[9],

    ...BASE_COLORS[8], ...BASE_COLORS[7], ...BASE_COLORS[7],
    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[7],
    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[9],

    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[9],
    ...BASE_COLORS[8], ...BASE_COLORS[7], ...BASE_COLORS[7],
    ...BASE_COLORS[8], ...BASE_COLORS[7], ...BASE_COLORS[8],

    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[9],
    ...BASE_COLORS[8], ...BASE_COLORS[8], ...BASE_COLORS[7],
    ...BASE_COLORS[8], ...BASE_COLORS[7], ...BASE_COLORS[7],

    ...BASE_COLORS[7], ...BASE_COLORS[7], ...BASE_COLORS[7],
    ...BASE_COLORS[7], ...BASE_COLORS[7], ...BASE_COLORS[7]
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
const createSmoothBoatGeometry = () => {
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
    ...BASE_VERTICES[12]
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  const colors = new Float32Array([
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8],
    ...BASE_COLORS[8]
  ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // Note that this is effectively the same as the faceted version’s triangles, except that the use of
  // index values lets us _genuinely share_ a vertex (well, at least at this level) rather than copying
  // them for adjacent triangles.
  //

  // prettier-ignore
  geometry.setIndex([
    //front
    4, 5, 6, 
    4, 10, 6, 
    4, 10, 12, 

    //back
    9, 8, 7, 
    9, 11, 8, 
    9, 11, 12, 

    //right
    10, 11, 12, 
    10, 6, 8,  
    10, 8, 11,  

    //left
    4, 9, 12, 
    4, 9, 5,  
    9, 5, 7,  

    //bottom
    5, 6, 7, 
    6, 7, 8  
  ])

  // Using `setIndex` causes faces/triangles to share vertices, which then causes vertex normal computation
  // to _average out_ the normals of multiple faces, thus creating a “smoothing” effect.
  geometry.computeVertexNormals()
  return geometry
}

class Shark {
  constructor() {
    const material = new MeshPhongMaterial({ vertexColors: true })
    material.side = DoubleSide
    const facetedGeometry = createFacetedFinGeometry()
    const topFinMesh = new Mesh(facetedGeometry, material)

    const material2 = new MeshPhongMaterial({ vertexColors: true })
    material2.side = DoubleSide
    const facetedGeometry2 = createFacetedFinGeometry()
    const leftFinMesh = new Mesh(facetedGeometry2, material2)

    const material3 = new MeshPhongMaterial({ vertexColors: true })
    material3.side = DoubleSide
    const facetedGeometry3 = createFacetedFinGeometry()
    const rightFinMesh = new Mesh(facetedGeometry3, material3)

    const material4 = new MeshPhongMaterial({ color: 0x919191 })
    material4.side = DoubleSide
    const facetedGeometry4 = new CylinderGeometry(0.5, 0.3, 1.5, 10)
    const frontBodyMesh = new Mesh(facetedGeometry4, material4)

    const material5 = new MeshPhongMaterial({ color: 0x919191 })
    material5.side = DoubleSide
    const facetedGeometry5 = new CylinderGeometry(0.5, 0.3, 1.5, 10)
    const backBodyMesh = new Mesh(facetedGeometry5, material5)

    const material6 = new MeshPhongMaterial({ vertexColors: true })
    material6.side = DoubleSide
    const facetedGeometry6 = createFacetedFinGeometry()
    const backTopFinMesh = new Mesh(facetedGeometry6, material6)

    const material7 = new MeshPhongMaterial({ vertexColors: true })
    material7.side = DoubleSide
    const facetedGeometry7 = createFacetedFinGeometry()
    const backBottomFinMesh = new Mesh(facetedGeometry3, material3)

    topFinMesh.position.y = 0.2
    topFinMesh.position.x = 0

    leftFinMesh.position.y = -0.5
    leftFinMesh.position.z = 0.7
    leftFinMesh.rotation.x = Math.PI / 2

    rightFinMesh.position.y = -0.5
    rightFinMesh.position.z = -0.7
    rightFinMesh.rotation.x = -Math.PI / 2

    frontBodyMesh.position.y = -0.5
    frontBodyMesh.position.x = 0.75
    frontBodyMesh.rotation.z = Math.PI / 2

    backBodyMesh.position.y = -0.5
    backBodyMesh.position.x = -0.75
    backBodyMesh.rotation.z = -Math.PI / 2

    backTopFinMesh.position.y = 0
    backTopFinMesh.position.x = -1.5
    backTopFinMesh.rotation.z = Math.PI / 8
    backTopFinMesh.scale.x *= 0.5

    backBottomFinMesh.position.y = -1
    backBottomFinMesh.position.x = -1.5
    backBottomFinMesh.rotation.x = Math.PI
    backBottomFinMesh.rotation.z = Math.PI / 8
    backBottomFinMesh.scale.x *= 0.5

    this.group = new Group()
    this.group.add(topFinMesh)
    this.group.add(leftFinMesh)
    this.group.add(rightFinMesh)
    this.group.add(frontBodyMesh)
    this.group.add(backBodyMesh)
    this.group.add(backTopFinMesh)
    this.group.add(backBottomFinMesh)

    this.group.position.y = -1.4
    this.group.position.z = -8
  }
}

export default Shark
