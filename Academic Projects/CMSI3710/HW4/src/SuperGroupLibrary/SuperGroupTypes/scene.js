import { createRef } from 'react'
import { getGL, initVertexBuffer, initSimpleShaderProgram } from '../.././glsl-utilities'
import { Group } from './group'
import { mat4 } from './matrix'
import Vector from './vector'
const traverseGroupInit = (group,gl, isWireFrame)=>{
  group.group.map((object,i)=>{
    if (object instanceof Group) {
      return traverseGroupInit(object,gl,isWireFrame)
    } else {
      object.mode = ((object.mode === 'triangles'|| object.mode===gl.TRIANGLES) && !isWireFrame) ? gl.TRIANGLES : gl.LINES 
      return object
    }
  })
  return group
}
const getMatTransforms = (object) => {
  let mat = new mat4()    //identity matrix
  const transforms = object.getTransforms()
  transforms.forEach(item => {
    mat = mat.mul(item)
  })
  return mat
}

export class Scene {
    perspective = []
    lightingVector = new Vector(0,1,1)
    camera = []
    VERTEX_SHADER = `
      #ifdef GL_ES
      precision highp float;
      #endif
  
      attribute vec3 vertexPosition;

      attribute vec3 vertexColor;
      varying vec4 finalVertexColor;

      attribute vec3 normalVector;

      uniform mat4 cameraProjection;
      uniform mat4 instanceMatrixView;
      uniform mat4 cameraMatrix;
      uniform vec3 lightingVector;

      
      void main(void) {
  
        float lightContribution = dot(normalize(normalVector), normalize(lightingVector));
      
  
        gl_Position = cameraProjection * cameraMatrix * instanceMatrixView * vec4(vertexPosition, 1.0);
        finalVertexColor = lightContribution * vec4(vertexColor,1.0);
      }
    `
    //add instanceMatrixView after hardcodedZ for transforms
    FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 finalVertexColor;

  void main(void) {
    gl_FragColor = vec4(finalVertexColor.rgb, 1.0);
  }
`
    constructor(height, width, camera,lighting=null) {
      this.lightingVector = lighting?lighting:this.lightingVector
      this.height = height
      this.width = width
      this.objectTree = []
      this.camera = camera
      this.initialized = false
      this.isWireFrame = false
      this.canvasRef = createRef()
    }
    gl
    setWireFrame = boolean => {this.isWireFrame=boolean}
    init = () => {
      this.gl = getGL(this.canvasRef.current)
      const gl = this.gl
      let abort = false
      this.shaderProgram = initSimpleShaderProgram(
        gl,
        this.VERTEX_SHADER,
        this.FRAGMENT_SHADER,
  
        // Very cursory error-checking here...
        shader => {
          abort = true
          alert('Shader problem: ' + gl.getShaderInfoLog(shader))
        },
  
        shaderProgram => {
          abort = true
          alert('Could not link shaders...sorry.')
        }
      )
  
      if (abort) {
        alert('Fatal errors encountered; we cannot continue.')
        return
      }
      const canvas = this.canvasRef.current;
      const main = document.getElementById('SuperGroupMegaExtremeCanvasLocationOfEpicNessAndUniqueNess');
      main.appendChild(canvas);
      gl.enable(gl.DEPTH_TEST)
      gl.clearColor(0.0, 0.0, 0.0, 0.0)
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (!gl) {
        alert('No WebGL context found...sorry.')

        return
      }
      this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'vertexPosition')
      this.vertexColor = gl.getAttribLocation(this.shaderProgram, 'vertexColor')
      this.normalVector = gl.getAttribLocation(this.shaderProgram, 'normalVector')
      this.scaleMatrix = gl.getUniformLocation(this.shaderProgram, 'instanceScaleMatrix')
      this.matrixView = gl.getUniformLocation(this.shaderProgram, 'instanceMatrixView')
      this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'cameraProjection')
      this.cameraMatrix = gl.getUniformLocation(this.shaderProgram, 'cameraMatrix')
      this.lightingVectorBuffer = gl.getUniformLocation(this.shaderProgram, 'lightingVector')
      gl.enableVertexAttribArray(this.vertexPosition)
      gl.enableVertexAttribArray(this.vertexColor)
      gl.enableVertexAttribArray(this.normalVector)
    }

    drawObject = (object, groupTransform) => {
      const scaleFactor = object.scale
      const gl = this.gl
      gl.uniformMatrix4fv(this.projectionMatrix, gl.FALSE, new Float32Array(this.camera.projection))
      gl.uniformMatrix4fv(this.cameraMatrix, gl.FALSE, new Float32Array(this.camera.cameraMatrix))
      gl.uniform3f(this.lightingVectorBuffer, this.lightingVector.elements[0],this.lightingVector.elements[1],this.lightingVector.elements[2])
      let mat = groupTransform.mul(getMatTransforms(object))
      gl.uniformMatrix4fv(this.matrixView, gl.FALSE, new Float32Array(mat.values))
      if (scaleFactor === undefined) {
        // No scale factor defaults to 1.
        gl.uniformMatrix4fv(this.scaleMatrix, gl.FALSE, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]))
      } else {
        gl.uniformMatrix4fv(
          this.scaleMatrix,
          gl.FALSE,
          new Float32Array(
            // prettier-ignore
            [
              scaleFactor, 0, 0, 0,
              0, scaleFactor, 0, 0,
              0, 0, scaleFactor, 0,
              0, 0, 0, 1
            ]
          )
        )
        gl.uniform3f(gl.getUniformLocation(this.shaderProgram, 'finalVertexColor'), object.color.r, object.color.g, object.color.b)
        gl.bindBuffer(gl.ARRAY_BUFFER, object.verticesBuffer)
        gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, 0, 0)
        
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorsBuffer)
        gl.vertexAttribPointer(this.vertexColor, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalsBuffer)
        gl.vertexAttribPointer(this.normalVector, 3, gl.FLOAT, false, 0, 0)
        gl.drawArrays(object.mode, 0, object.vertices.length / 3)
      }
      
    }

    drawScene = (objects, groupTransform=new mat4()) => {
      const gl = this.gl
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      objects.forEach(item=>{
        if (item instanceof Group) {
         // console.log('GROUP!')
          item = traverseGroupInit(item,gl,this.isWireFrame)
          this.drawScene(item.group, groupTransform.mul(getMatTransforms(item)))
        } else {
          item = { ...item, mode: ((item.mode === 'triangles'|| item.mode===gl.TRIANGLES) && !this.isWireFrame) ? gl.TRIANGLES : gl.LINES  }
          //console.log('OBJECT!')
          if (!item.colors) {
            // If we have a single color, we expand that into an array
            // of the same color over and over.
            item.colors = []
            for (let i = 0, maxi = item.vertices.length / 3; i < maxi; i += 1) {
              item.colors = item.colors.concat(
                item.color.r,
                item.color.g,
                item.color.b
              )
            }
          }
          item.verticesBuffer = initVertexBuffer(gl, item.vertices)
          item.colorsBuffer = initVertexBuffer(gl, item.colors)
          item.normalsBuffer = initVertexBuffer(gl, item.normals)
          
          this.drawObject(item, groupTransform)
        }
      })
      
    }
    
    run = () => {
      this.gl.useProgram(this.shaderProgram)
      this.drawScene(this.objectTree,new mat4())
      this.gl.flush()
    }
    add = object => {
      if (object.dtype === 'object') {
        this.objectTree.push(object)
      } else {
        this.objectTree.unshift(object)
      }
    }
    remove = object => {
      // keeping all the objects that that are not the same
      this.objectTree = this.objectTree.filter(currentObject => currentObject !== object)
    }
  }