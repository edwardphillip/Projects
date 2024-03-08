import { CustomObject } from "../SuperGroupTypes/object"
import { SinkHoleMesh } from "./SinkHoleMesh"

export class SinkHoleAnimator {
    constructor({duration=1, precision=100, delay=1, maxDepth}){
        this.duration = duration
        this.maxDepth = maxDepth
        this.precision=precision
        this.objs = []
        this.delay=delay
        for (let i = 0; i<duration; i+=(duration/precision)) {
            const sinkHoleMesh = new SinkHoleMesh(4, 4, 4, { r: 0.2, g: 0.5, b: 0.8 }, true, i,this.maxDepth)
            this.objs.push(
                new CustomObject(sinkHoleMesh, { x: 0, y: -20, z: -5900 }, 6000, 'triangles')
            )
        }
    }
    
    timestamp = 0

    getObj = () => {
        return this.objs[this.timestamp%(this.objs.length)]
    }

    nextObj = timestamp => {
        this.timestamp = timestamp
        return this.getObj()
    }

    animate = (timestamp,scene) => {
        timestamp = Math.floor(timestamp*(1/this.delay))
        scene.remove(this.getObj())
        scene.add(this.nextObj(timestamp))
    }
}