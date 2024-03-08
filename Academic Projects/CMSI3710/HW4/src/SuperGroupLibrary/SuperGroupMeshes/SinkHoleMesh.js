import { PlaneMesh } from './PlaneMesh'

export class SinkHoleMesh extends PlaneMesh {
  constructor(length, width, precision, color, smooth, timestamp, maxDepth, slope=1) {
    super(length, width, precision, color, smooth, (x, z) => {
      const radius = timestamp*.75
      const depth = slope * timestamp
      const distanceFromCenter = Math.sqrt(x ** 2 + z ** 2)
      if (distanceFromCenter < radius) {
        return Math.max(-Math.sqrt(radius ** 2 - distanceFromCenter ** 2) - depth, maxDepth)
      } else {
        return (
          0.05 * Math.max(0.25 * Math.sin((x + z) * 10) + 0.75 * Math.sin((x + z) * 10), Math.sin((x + z) * 10) - 0.1) +
          0.1 * Math.sin((x - z) * 2) +
          0.02 * Math.sin((50 * x - z) * 2)
        )
      }
    })
  }
}
