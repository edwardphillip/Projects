
import Vector from "./SuperGroupTypes/vector.js"
/**
 * Utility function for turning our nascent geometry object into a “raw” coordinate array
 * arranged as triangles.
 */
const toRawTriangleArray = protoGeometry => {
  const result = []

  protoGeometry.facesByIndex.forEach(face => {
    face.forEach(vertexIndex => {
      result.push(...protoGeometry.vertices[vertexIndex])
    })
  })

  return result
}

const computeVertexNormals = (object, smooth=false) => {
  const results = []
  const idxToVertex = {}
  object.facesByIndex.forEach(face=>{
    // Access each vertex of the triangle
    const p0 = new Vector(...object.vertices[face[0]])
    const p1 = new Vector(...object.vertices[face[1]])
    const p2 = new Vector(...object.vertices[face[2]])
    const v1 = p1.subtract(p0)
    const v2 = p2.subtract(p0)
    const n = v1.cross(v2).unit
    if(smooth){
      idxToVertex[face[0]] = idxToVertex[face[0]]!==undefined ? idxToVertex[face[0]].add(n) : n
      idxToVertex[face[1]] = idxToVertex[face[1]]!==undefined ? idxToVertex[face[1]].add(n) : n
      idxToVertex[face[2]] = idxToVertex[face[2]]!==undefined ? idxToVertex[face[2]].add(n) : n
    } else {
      results.push(n.x,n.y,n.z)
      results.push(n.x,n.y,n.z)
      results.push(n.x,n.y,n.z)
    }
  })
  if (smooth) {
    object.facesByIndex.forEach(face=>{
      face.forEach(item=>{
        const n = idxToVertex[item].unit
        results.push(n.x,n.y,n.z)
      })
    })
  }
  return results
}

/*
 * Utility function for turning indexed vertices into a “raw” coordinate array
 * arranged as line segments.
 */
const toRawLineArray = protoGeometry => {
  const result = []

  protoGeometry.facesByIndex.forEach(face => {
    // Oddly enough, the inner loop here is clearer as a `for` loop because we
    // need to access the current vertex index and the one after that (wrapping
    // around once we get to the end).
    for (let i = 0, maxI = face.length; i < maxI; i += 1) {
      // “Connect the dots.”
      result.push(
        ...protoGeometry.vertices[face[i]],
        ...protoGeometry.vertices[face[(i + 1) % maxI]] // Lets us wrap around to 0.
      )
    }
  })

  return result
}

export { toRawTriangleArray, toRawLineArray, computeVertexNormals }
