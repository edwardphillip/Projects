import { BufferGeometry, BufferAttribute, MeshPhongMaterial,DoubleSide, Mesh, Group, TextureLoader} from 'three'
import { Tween, Ease } from '@createjs/tweenjs'
// Credits of the image to tensaisaisai - Notebook Texture
// https://pixabay.com/photos/notebook-paper-paper-texture-lines-1806473/
import garnetSmule from '../textures/notebook-paper.jpg'

// prettier-ignore
const BASE_VERTICES = [
  [-1,    0,    0], // 0: Left middle.
  [ 0,    0,  0.5], // 1: Front middle.
  [ 1,    0,    0], // 2: Right middle.
  [ 0,    0, -0.5], // 3: Back middle.
  [ 0,    0.6, 0], // 4: Top.
  [ -0.5, -0.5, 0], // 5: Left Bottom.
  [ 0.5, -0.5,  0]  // 5: Right Bottom.
]

// prettier-ignore
const BASE_COLORS = [
  [   1,    1,   0.5], // 0: Bright yellow-ish.
  [ 0.5,    1,   0.5], // 1: Light green.
  [   1,    1,   0.5], // 2: Bright yellow-ish.
  [   0,  0.5,     0], // 3. Medium green.
  [0.25,    1,  0.75], // 4: Light cyan-ish.
  [ 0.5,  0.2,     0], // 5: Dark orange-ish.
  [ 0.5,  0.2,     0]  // 5: Dark orange-ish.
]

const createFacetedBoatGeometry = () => {
  const geometry = new BufferGeometry()

  const vertices = new Float32Array([
    ...BASE_VERTICES[4], ...BASE_VERTICES[5], ...BASE_VERTICES[6], // Front upper quadrant.
    ...BASE_VERTICES[0], ...BASE_VERTICES[5], ...BASE_VERTICES[1], // Front bottom-left quadrant.
    ...BASE_VERTICES[1], ...BASE_VERTICES[5], ...BASE_VERTICES[6], // Front bottom-middle quadrant.
    ...BASE_VERTICES[2], ...BASE_VERTICES[1], ...BASE_VERTICES[6], // Front bottom-right quadrant.

    // ^^^^^ Rear upper-left quadrant (if looking at it from the front).
    ...BASE_VERTICES[4], ...BASE_VERTICES[6], ...BASE_VERTICES[5], // Rear upper quadrant.
    ...BASE_VERTICES[0], ...BASE_VERTICES[3], ...BASE_VERTICES[5], // Rear bottom-left quadrant.
    ...BASE_VERTICES[3], ...BASE_VERTICES[6], ...BASE_VERTICES[5], // Rear bottom-middle quadrant.
    ...BASE_VERTICES[2], ...BASE_VERTICES[6], ...BASE_VERTICES[3] // Rear bottom-right quadrant.
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

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

  const uv = new Float32Array([
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0, //
      0, 0, 0.5, 1, 1, 0 //
  ])
  geometry.setAttribute('uv', new BufferAttribute(uv, 2))
  geometry.computeVertexNormals()
  return geometry
}

const createSmoothBoatGeometry = () => {
  const geometry = new BufferGeometry()

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

  geometry.computeVertexNormals()
  return geometry
}

class Boat {
  constructor() {
    const facetedGeometry = createFacetedBoatGeometry()
    const texture = new TextureLoader().load(garnetSmule);
    const material = new MeshPhongMaterial({ map: texture });
    material.side = DoubleSide
    const facetedMesh = new Mesh(facetedGeometry, material);



    facetedMesh.position.z = -20
    facetedMesh.position.y = -1.5

    
    this.group = new Group()
    this.group.add(facetedMesh)

  }

  reset() {
    Tween.get(this.group.rotation).to({ x: 0, y: 0, z: 0 }, 2000, Ease.sineInOut)
  }
}

export default Boat
