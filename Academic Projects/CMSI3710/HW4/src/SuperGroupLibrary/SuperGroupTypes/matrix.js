export class mat4 {
  values = []
  constructor(list=[1,0,0,0,
                    0,1,0,0,
                    0,0,1,0,
                    0,0,0,1]) {
    this.values = Object.assign([], list.map(number=>parseFloat(number)))
  }
  mul(matrix) {
    if (this.values !== []) {
      let newValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum1 = this.values[i] * matrix.values[0 + j * 4]
          let sum2 = this.values[i + 4] * matrix.values[1 + j * 4]
          let sum3 = this.values[i + 8] * matrix.values[2 + j * 4]
          let sum4 = this.values[i + 12] * matrix.values[3 + j * 4]
          newValue[j * 4 + i] = sum1 + sum2 + sum3 + sum4
        }
      }
      const ans = new mat4(Object.assign([], newValue))
      return ans
    }
  }
}
