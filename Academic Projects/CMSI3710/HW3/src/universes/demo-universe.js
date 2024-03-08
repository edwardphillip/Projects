/**
 * The scene-manager module serves as an entry point to all scene-related activities, from initialization
 * to access to objects to anything else.
 *
 * The starter version of the scene manager is adapted from the introductory code provided by three.js.
 */
import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  ShaderLib
} from 'three'

import Boat from '../cast/boat'
import Dock from '../cast/dock'
import Shark from '../cast/shark'
import Moon from '../cast/moon'
import Sun from '../cast/sun'
import Starfish from '../cast/starfish'
import Ocean from '../cast/ocean'
import House from '../cast/house'
import Sunset from '../cast/sunset'

const createDemoUniverse = ({ fieldOfView, width, height, nearPlane, farPlane }) => {
  const scene = new Scene()
  const camera = new PerspectiveCamera(fieldOfView, width / height, nearPlane, farPlane)

  const renderer = new WebGLRenderer()
  renderer.setSize(width, height)

  scene.add(new AmbientLight('white', 0.5))
  var blueLight = new AmbientLight('Blue', 0.5)
  var redLight = new AmbientLight('Red', 0.5)
  var whiteLight = new AmbientLight('white', 0.5)

  const directionalLight = new DirectionalLight('white', 1)
  directionalLight.position.set(-1.5, 1, -2)
  directionalLight.target.position.set(0, 0, 0)
  scene.add(directionalLight)
  scene.add(directionalLight.target)

  renderer.setClearColor(new Color(0xabddfc))

  const dock = new Dock()
  scene.add(dock.group)

  const house = new House()
  scene.add(house.group)

  const boat = new Boat()
  scene.add(boat.group)

  const shark = new Shark()
  shark.group.position.z = -3
  shark.group.position.x = 5
  scene.add(shark.group)

  const sharks = new Group()

  const shark1 = new Shark()
  shark1.group.position.set(5, -2, -15)
  sharks.add(shark1.group)

  const shark2 = new Shark()
  shark2.group.position.set(-5, -2, -20)
  shark2.group.rotateY(4)
  sharks.add(shark2.group)

  const shark3 = new Shark()
  shark3.group.position.set(2, -2, -25)
  shark3.group.rotateY(2)
  sharks.add(shark3.group)

  scene.add(sharks)

  const starfish = new Starfish()
  scene.add(starfish.group)

  const ocean = new Ocean()
  scene.add(ocean.group)

  const sun = new Sun()
  const sunset = new Sunset()
  const moon = new Moon()

  let movingSun = false
  const doDay = () => {
    scene.add(sun.group)
    scene.remove(sunset.group)
    scene.remove(moon.group)
    movingSun = true
    renderer.setClearColor(new Color(0x87ceeb))
    scene.remove(blueLight)
    scene.remove(redLight)
    scene.add(whiteLight)
  }

  let movingSunset = false
  const doSunset = () => {
    scene.add(sunset.group)
    scene.remove(sun.group)
    scene.remove(moon.group)
    movingSunset = true
    renderer.setClearColor(new Color(0xfd841f))
    scene.remove(blueLight)
    scene.remove(whiteLight)
    scene.add(redLight)
  }

  let movingMoon = false
  const doNight = () => {
    scene.add(moon.group)
    scene.remove(sunset.group)
    scene.remove(sun.group)
    movingMoon = true
    renderer.setClearColor(new Color(0x00000))
    scene.remove(whiteLight)
    scene.remove(redLight)
    scene.add(blueLight)
  }

  const addStar = () => {
    for (var z = 0; z < 2000; z += 2) {
      var geometry = new SphereGeometry(0.5, 30, 30)
      var material = new MeshBasicMaterial({ color: 0xffffff })
      var star = new Mesh(geometry, material)
      star.position.x = Math.random() * 1000 - 500 // https://codepen.io/GraemeFulton/pen/BNyQMM
      star.position.y = Math.random() * 1000 - 500
      star.position.z = Math.random() * 1000 - 500

      star.scale.x = star.scale.y = 1

      scene.add(star)
    }
  }

  const stop = () => {
    movingSun = false
    movingSunset = false
    movingMoon = false
    scene.remove(sun.group)
    scene.remove(sunset.group)
    scene.remove(moon.group)
    scene.remove(whiteLight)
    scene.remove(redLight)
    scene.remove(blueLight)
    renderer.setClearColor(new Color(0xabddfc))
  }

  let moveShark = true
  let moveSharkForward = true
  let turnSharkLeft = true
  let starFishForward = true
  const radius = 5 // radius of the circle
  const centerX = 0 // x-coordinate of the center of the circle
  // const centerY = 0; // y-coordinate of the center of the circle
  const centerZ = -20 // z-coordinate of the center of the circle
  let angle = 0

  const animate = () => {
    window.requestAnimationFrame(animate)

    angle += 0.01 // increase the angle by a small value in each frame

    shark1.group.position.x = centerX + radius * Math.sin(angle)
    shark1.group.position.z = centerZ + radius * Math.cos(angle)
    shark1.group.rotateY(0.01)

    shark2.group.position.x = centerX + radius * Math.sin(angle + (4 * Math.PI) / 3) // offset the angle by 1/3 of a circle
    shark2.group.position.z = centerZ + radius * Math.cos(angle + (4 * Math.PI) / 3)
    shark2.group.rotateY(0.01)

    shark3.group.position.x = centerX + radius * Math.sin(angle + (2 * Math.PI) / 3) // offset the angle by 2/3 of a circle
    shark3.group.position.z = centerZ + radius * Math.cos(angle + (2 * Math.PI) / 3)
    shark3.group.rotateY(0.01)

    if (movingMoon) {
      moon.group.rotation.x += 0.0001
      moon.group.rotation.y += 0.001
      moon.group.rotation.z += 0.0001
    }

    if (movingSun) {
      sun.group.rotation.x += 0.0001
      sun.group.rotation.y += 0.001
      sun.group.rotation.z += 0.0001
    }

    if (movingSunset) {
      sunset.group.rotation.x -= 0.0001
      sunset.group.rotation.y -= 0.0001
    }

    if (moveShark) {
      //shark moving back and forth
      if (shark.group.position.x > 10) {
        moveSharkForward = false
        shark.group.scale.x *= -1
      }
      if (shark.group.position.x < -10) {
        moveSharkForward = true
        shark.group.scale.x *= -1
      }
      if (moveSharkForward === true) {
        shark.group.position.x += 0.04
      } else {
        shark.group.position.x -= 0.04
      }
      //shark moving left to right
      if (shark.group.rotation.y > 0.15) {
        turnSharkLeft = false
      }
      if (shark.group.rotation.y < -0.15) {
        turnSharkLeft = true
      }
      if (turnSharkLeft === true) {
        shark.group.rotation.y += 0.007
      } else {
        shark.group.rotation.y -= 0.007
      }

      if (Math.abs(shark.group.position.x - dock.group.position.x) < 5) {
        moveSharkForward = !moveSharkForward
        shark.group.scale.x *= -1
        if (starFishForward) {
          starFishForward = !starFishForward
          starfish.group.position.z += 0.15
        } else {
          starFishForward = !starFishForward
          starfish.group.position.z -= 0.15
        }
      }
    }
    
    renderer.render(scene, camera)
  }

  return {
    camera,
    renderer,
    animate,
    stop,
    doDay,
    doSunset,
    doNight,
    addStar,
    cast: {}
  }
}

export { createDemoUniverse }
