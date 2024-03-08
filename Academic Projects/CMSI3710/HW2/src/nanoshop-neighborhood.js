/**
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing using a pixel's "neighborhood."
 */

/**
 * A basic "darkener"---this one does not even use the entire pixel neighborhood;
 * just the exact current pixel like the original Nanoshop.
 */
const darken = (x, y, rgbaNeighborhood) => [
  rgbaNeighborhood[4].r / 2,
  rgbaNeighborhood[4].g / 2,
  rgbaNeighborhood[4].b / 2,
  rgbaNeighborhood[4].a
]

/**
 * A basic "averager"---this one returns the average of all the pixels in the
 * given neighborhood.
 */
const average = (x, y, rgbaNeighborhood) => {
  let rTotal = 0
  let gTotal = 0
  let bTotal = 0
  let aTotal = 0

  for (let i = 0; i < 9; i += 1) {
    rTotal += rgbaNeighborhood[i].r
    gTotal += rgbaNeighborhood[i].g
    bTotal += rgbaNeighborhood[i].b
    aTotal += rgbaNeighborhood[i].a
  }

  return [rTotal / 9, gTotal / 9, bTotal / 9, aTotal / 9]
}

const exaggerate = (x, y, rgbaNeighborhood) => {
  let rTotal = 0
  let gTotal = 0
  let bTotal = 0

  for (let i = 0; i < 9; i += 1) {
    rTotal += rgbaNeighborhood[i].r
    gTotal += rgbaNeighborhood[i].g
    bTotal += rgbaNeighborhood[i].b
  }

  if (rTotal >= gTotal && rTotal >= bTotal) {
    return [rTotal / 9, 0, 0, rgbaNeighborhood[4].a]
  }
  if (gTotal >= rTotal && gTotal >= bTotal) {
    return [0, gTotal / 9, 0, rgbaNeighborhood[4].a]
  }
  if (bTotal >= rTotal && bTotal >= gTotal) {
    return [0, 0, bTotal / 9, rgbaNeighborhood[4].a]
  }
}

/**
 * This is a rudimentary edge detector---another filter that would not be possible
 * without knowing about the other pixels in our neighborhood.
 */
const basicEdgeDetect = (x, y, rgbaNeighborhood) => {
  let neighborTotal = 0
  for (let i = 0; i < 9; i += 1) {
    if (i !== 4) {
      neighborTotal += rgbaNeighborhood[i].r + rgbaNeighborhood[i].g + rgbaNeighborhood[i].b
    }
  }

  let myAverage = (rgbaNeighborhood[4].r + rgbaNeighborhood[4].g + rgbaNeighborhood[4].b) / 3
  let neighborAverage = neighborTotal / 3 / 8 // Three components, eight neighbors.

  return myAverage < neighborAverage ? [0, 0, 0, rgbaNeighborhood[4].a] : [255, 255, 255, rgbaNeighborhood[4].a]
}

const sharpen = (x, y, rgbaNeighborhood) => {
  let rTotal = 0
  let gTotal = 0
  let bTotal = 0

  const center = rgbaNeighborhood[4]

  // Apply the sharpening filter
  for (let i = 0; i < 9; i++) {
    if (i !== 4) {
      const pixel = rgbaNeighborhood[i]
      rTotal += pixel.r - center.r
      gTotal += pixel.g - center.g
      bTotal += pixel.b - center.b
    }
  }

  // Ensure the values are within the valid color range of 0 to 255
  const r = Math.max(Math.min(Math.round(center.r + rTotal), 255), 0)
  const g = Math.max(Math.min(Math.round(center.g + gTotal), 255), 0)
  const b = Math.max(Math.min(Math.round(center.b + bTotal), 255), 0)

  return [r, g, b, center.a]
}

const invertColors = (x, y, rgbaNeighborhood) => [
  255 - rgbaNeighborhood[4].r,
  255 - rgbaNeighborhood[4].g,
  255 - rgbaNeighborhood[4].b,
  rgbaNeighborhood[4].a
]

const rgbify = (x, y, rgbaNeighborhood) => {
  let whichRgb = x % 3
  let red = 0
  let blue = 0
  let green = 0
  rgbaNeighborhood.forEach((x, i) => (red += x.r))
  rgbaNeighborhood.forEach((x, i) => (green += x.g))
  rgbaNeighborhood.forEach((x, i) => (blue += x.b))

  if (red > green && red > blue && whichRgb === 0) {
    return [255, green / 9, blue / 9, rgbaNeighborhood[4].a]
  } else if (green > red && green > blue && whichRgb === 1) {
    return [red / 9, 255, blue / 9, rgbaNeighborhood[4].a]
  } else if (blue > green && blue > red && whichRgb === 2) {
    return [red / 9, green / 9, 255, rgbaNeighborhood[4].a]
  }
  return [rgbaNeighborhood[4].r * 0.9, rgbaNeighborhood[4].g * 0.9, rgbaNeighborhood[4].b * 0.9, rgbaNeighborhood[4].a]
}

/**
 * Applies the given filter to the given ImageData object,
 * then modifies its pixels according to the given filter.
 *
 * A filter is a function ({r, g, b, a}[9]) that returns another
 * color as a 4-element array representing the new RGBA value
 * that should go in the center pixel.
 */
const applyNeighborhoodFilter = (renderingContext, imageData, filter) => {
  // For every pixel, replace with something determined by the filter.
  const result = renderingContext.createImageData(imageData.width, imageData.height)
  const rowWidth = imageData.width * 4
  const sourceArray = imageData.data
  const destinationArray = result.data

  // A convenience function for creating an rgba object.
  const rgba = startIndex => ({
    r: sourceArray[startIndex],
    g: sourceArray[startIndex + 1],
    b: sourceArray[startIndex + 2],
    a: sourceArray[startIndex + 3]
  })

  for (let i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
    // The 9-color array that we build must factor in image boundaries.
    // If a particular location is out of range, the color supplied is that
    // of the extant pixel that is adjacent to it.
    const iAbove = i - rowWidth
    const iBelow = i + rowWidth
    const pixelColumn = i % rowWidth
    const firstRow = sourceArray[iAbove] === undefined
    const lastRow = sourceArray[iBelow] === undefined

    const pixelIndex = i / 4
    const pixel = filter(pixelIndex % imageData.width, Math.floor(pixelIndex / imageData.height), [
      // The row of pixels above the current one.
      firstRow ? (pixelColumn ? rgba(i - 4) : rgba(i)) : pixelColumn ? rgba(iAbove - 4) : rgba(iAbove),

      firstRow ? rgba(i) : rgba(iAbove),

      firstRow
        ? pixelColumn < rowWidth - 4
          ? rgba(i + 4)
          : rgba(i)
        : pixelColumn < rowWidth - 4
        ? rgba(iAbove + 4)
        : rgba(iAbove),

      // The current row of pixels.
      pixelColumn ? rgba(i - 4) : rgba(i),

      // The center pixel: the filter's returned color goes here
      // (based on the loop, we are at least sure to have this).
      rgba(i),

      pixelColumn < rowWidth - 4 ? rgba(i + 4) : rgba(i),

      // The row of pixels below the current one.
      lastRow ? (pixelColumn ? rgba(i - 4) : rgba(i)) : pixelColumn ? rgba(iBelow - 4) : rgba(iBelow),

      lastRow ? rgba(i) : rgba(iBelow),

      lastRow
        ? pixelColumn < rowWidth - 4
          ? rgba(i + 4)
          : rgba(i)
        : pixelColumn < rowWidth - 4
        ? rgba(iBelow + 4)
        : rgba(iBelow)
    ])

    // Apply the color that is returned by the filter.
    for (let j = 0; j < 4; j += 1) {
      destinationArray[i + j] = pixel[j]
    }
  }

  return result
}

export { darken, average, exaggerate, basicEdgeDetect, sharpen, applyNeighborhoodFilter, rgbify, invertColors }
