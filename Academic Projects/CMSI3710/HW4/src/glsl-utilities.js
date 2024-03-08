const getGL = canvas => canvas.getContext('webgl')

const textureMapping = (gl, path = './smiley.jpeg') => {
  let texture

  texture = gl.createTexture()

  const image = new Image()

  image.src = path

  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

const initVertexBuffer = (gl, vertices) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  return buffer
}

const compileShader = (gl, shaderSource, shaderType, compileError) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (compileError) {
      compileError(shader)
    }

    return null
  } else {
    return shader
  }
}

const linkShaderProgram = (gl, vertexShader, fragmentShader) => {
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  return shaderProgram
}

const initSimpleShaderProgram = (gl, vertexShaderSource, fragmentShaderSource, compileError, linkError) => {
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER, compileError)
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER, compileError)

  if (!vertexShader || !fragmentShader) {
    return null
  }

  const shaderProgram = linkShaderProgram(gl, vertexShader, fragmentShader)
  if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return shaderProgram
  }

  if (linkError) {
    linkError(shaderProgram)
  }

  return null
}

export { getGL, initVertexBuffer, compileShader, linkShaderProgram, initSimpleShaderProgram }
