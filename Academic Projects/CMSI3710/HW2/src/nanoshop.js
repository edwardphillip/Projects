/**
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing.
 */

/**
 * A basic "darkener."
 */
const darken = (x, y, r, g, b, a) => [r / 2, g / 2, b / 2, a]
const brightness = (x, y, r, g, b, a) => {
  const factor = 15
  return [r + factor, g + factor, b + factor, a]
}
const randomScale = (x, y, r, g, b, a) => {
  const redScalar = Math.random() * 2
  const greenScalar = Math.random() * 2
  const blueScalar = Math.random() * 2
  return [r * redScalar, b * blueScalar, g * greenScalar, a]
}
const blueify = (x, y, r, g, b, a) => [r * 0.8, g * 0.8, b * 1.2, a]

/**
 * Applies the given filter to the given ImageData object,
 * then modifies its pixels according to the given filter.
 *
 * A filter is a function (x, y, r, g, b, a) that returns another
 * pixel as a 4-element array representing an RGBA value.
 */
const applyFilter = (imageData, filter) => {
  // For every pixel, replace with something determined by the filter.
  const pixelArray = imageData.data

  for (let i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
    const pixelIndex = i / 4

    const pixel = filter(
      pixelIndex % imageData.width,
      Math.floor(pixelIndex / imageData.height),
      pixelArray[i],
      pixelArray[i + 1],
      pixelArray[i + 2],
      pixelArray[i + 3]
    )

    for (let j = 0; j < 4; j += 1) {
      pixelArray[i + j] = pixel[j]
    }
  }

  return imageData
}

const contrast = (x, y, r, g, b, a) => {
  const factor = 1.5 // adjust this to change the amount of contrast
  const avg = (r + g + b) / 3
  const newR = avg + factor * (r - avg)
  const newG = avg + factor * (g - avg)
  const newB = avg + factor * (b - avg)
  return [newR, newG, newB, a]
}

export { brightness, darken, applyFilter, blueify, randomScale, contrast }
