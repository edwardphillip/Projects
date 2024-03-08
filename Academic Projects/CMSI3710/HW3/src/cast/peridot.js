import { BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh, Group } from 'three'
import { Tween, Ease } from '@createjs/tweenjs'

// Here’s a case where Prettier doesn’t quite do the best job so we take the responsibility of formatting
// this ourselves.
//
// prettier-ignore
const BASE_VERTICES = [
  [-1,    0,    0], // 0: Left middle.
  [ 0,    0,  0.5], // 1: Front middle.
  [ 1,    0,    0], // 2: Right middle.
  [ 0,    0, -0.5], // 3: Back middle.
  [ 0, 1.75,    0], // 4: Top.
  [ 0, -2,    0],  // 5: Bottom.
]

// prettier-ignore
const BASE_COLORS = [
  [   1,    1,   0.5], // 0: Bright yellow-ish.
  [ 0.5,    1,   1], // 1: Light green.
  [   1,    1,   0.5], // 2: Bright yellow-ish.
  [   0,  0.5,     1], // 3. Medium green.
  [0.25,    1,  0.75], // 4: Light cyan-ish.
  [ 0.5,  0.2,     1]  // 5: Dark orange-ish.
]

/**
 * Creates a custom geometry out of a raw listing of vertices. Working this out on graph paper can be
 * a good first step here! Alternatively, you can write some code to generate these vertices, if the
 * shape that you have in mind can be computed in some way.
 */
const createFacetedPeridotGeometry = () => {
  const geometry = new BufferGeometry()

  // We build each triangle as a separate face, copying a vertex if needed. Remember, counterclockwise
  // is the “front.”
  //
  // prettier-ignore
  const vertices = new Float32Array([
    ...BASE_VERTICES[0], ...BASE_VERTICES[1], ...BASE_VERTICES[4], // Front upper-left quadrant.
    ...BASE_VERTICES[1], ...BASE_VERTICES[2], ...BASE_VERTICES[4], // Front upper-right quararnt.
    ...BASE_VERTICES[0], ...BASE_VERTICES[5], ...BASE_VERTICES[1], // Front bottom-left quadrant.
    ...BASE_VERTICES[1], ...BASE_VERTICES[5], ...BASE_VERTICES[2], // Front bottom-right quadrant.
    ...BASE_VERTICES[0], ...BASE_VERTICES[4], ...BASE_VERTICES[3],
    // ^^^^^ Rear upper-left quadrant (if looking at it from the front).
    ...BASE_VERTICES[3], ...BASE_VERTICES[4], ...BASE_VERTICES[2], // Rear upper-right quadrant.
    ...BASE_VERTICES[0], ...BASE_VERTICES[3], ...BASE_VERTICES[5], // Rear bottom-left quadrant.
    ...BASE_VERTICES[2], ...BASE_VERTICES[5], ...BASE_VERTICES[3] // Rear bottom-right quadrant.
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  // We coordinate our colors to match the corresopnding vertex.
  //
  // prettier-ignore
  const colors = new Float32Array([
    ...BASE_COLORS[0], ...BASE_COLORS[1], ...BASE_COLORS[4],
    ...BASE_COLORS[1], ...BASE_COLORS[2], ...BASE_COLORS[4],
    ...BASE_COLORS[0], ...BASE_COLORS[5], ...BASE_COLORS[1],
    ...BASE_COLORS[1], ...BASE_COLORS[5], ...BASE_COLORS[2],
    ...BASE_COLORS[0], ...BASE_COLORS[4], ...BASE_COLORS[3],
    ...BASE_COLORS[3], ...BASE_COLORS[4], ...BASE_COLORS[2],
    ...BASE_COLORS[0], ...BASE_COLORS[3], ...BASE_COLORS[5],
    ...BASE_COLORS[2], ...BASE_COLORS[5], ...BASE_COLORS[3]
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
const createSmoothPeridotGeometry = () => {
  const geometry = new BufferGeometry()

  // This effectively “flattens” our base vertices.
  const vertices = new Float32Array([
    ...BASE_VERTICES[0],
    ...BASE_VERTICES[1],
    ...BASE_VERTICES[2],
    ...BASE_VERTICES[3],
    ...BASE_VERTICES[4],
    ...BASE_VERTICES[5]
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  const colors = new Float32Array([
    ...BASE_COLORS[0],
    ...BASE_COLORS[1],
    ...BASE_COLORS[2],
    ...BASE_COLORS[3],
    ...BASE_COLORS[4],
    ...BASE_COLORS[5]
  ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // Note that this is effectively the same as the faceted version’s triangles, except that the use of
  // index values lets us _genuinely share_ a vertex (well, at least at this level) rather than copying
  // them for adjacent triangles.
  //
  // prettier-ignore
  geometry.setIndex([
    0, 1, 4, // Front upper-left quadrant.
    1, 2, 4, // Front upper-right quararnt.
    0, 5, 1, // Front bottom-left quadrant.
    1, 5, 2, // Front bottom-right quadrant.
    0, 4, 3, // Rear upper-left quadrant (if looking at it from the front).
    3, 4, 2, // Rear upper-right quadrant.
    0, 3, 5, // Rear bottom-left quadrant.
    2, 5, 3  // Rear bottom-right quadrant.
  ])

  // Using `setIndex` causes faces/triangles to share vertices, which then causes vertex normal computation
  // to _average out_ the normals of multiple faces, thus creating a “smoothing” effect.
  geometry.computeVertexNormals()
  return geometry
}

class Peridot {
  constructor() {
    const material = new MeshPhongMaterial({ vertexColors: true })

    const facetedGeometry = createFacetedPeridotGeometry()
    const facetedMesh = new Mesh(facetedGeometry, material)
    facetedMesh.position.x = -2

    const smoothGeometry = createSmoothPeridotGeometry()
    const smoothMesh = new Mesh(smoothGeometry, material)
    smoothMesh.position.x = 2

    this.group = new Group()
    this.group.add(facetedMesh)
    this.group.add(smoothMesh)
  }

  reset() {
    Tween.get(this.group.rotation).to({ x: 0, y: 0, z: 0 }, 2000, Ease.sineInOut)
  }
}

export default Peridot
