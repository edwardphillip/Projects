import { useEffect, useRef } from 'react'

import cafe from './cafe-scene/cafe'
import { applyFilter, randomSwap, darken, randomScale, brightness, blueify, contrast } from './nanoshop'

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the nanoshop module.
 */
const NanoshopDemo = props => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    cafe.draw(canvas.getContext('2d'))
  }, [canvasRef])

  const filterAndWrite = filter => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Filter time.
    const renderingContext = canvas.getContext('2d')
    renderingContext.putImageData(
      applyFilter(renderingContext.getImageData(0, 0, canvas.width, canvas.height), filter),
      0,
      0
    )
  }

  const handleBrightness = event => filterAndWrite(brightness)
  const handleDarken = event => filterAndWrite(darken)
  const handleBlueify = event => filterAndWrite(blueify)
  const handleRandomScalar = event => filterAndWrite(randomScale)
  const handleContrast = event => filterAndWrite(contrast)

  return (
    <article>
      <section className="instructions-buttons">
        Click a button to apply a simple filter!
        <span>
          <button onClick={handleBrightness}>Brightness</button>
          <button onClick={handleRandomScalar}>Randomscale</button>
          <button onClick={handleBlueify}>Blueify</button>
          <button onClick={handleContrast}>Increase Contrast</button>
        </span>
      </section>

      <canvas width="800" height="440" ref={canvasRef}>
        All your <code>canvas</code> are belong to us!
      </canvas>

      <p>Reload the page to start over.</p>
    </article>
  )
}

export default NanoshopDemo
