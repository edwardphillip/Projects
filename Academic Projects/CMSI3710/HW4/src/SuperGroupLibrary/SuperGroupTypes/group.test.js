import { Group } from './group'
import { SphereMesh } from '../SuperGroupMeshes/SphereMesh'
  describe('creation' , () => {
    describe('adding two objects to a group', () => {
      it('Checking group', () => {
      const g1 = new Group({x: 1, y: 1, z:0})
      let sphere1 = new SphereMesh(1,1)
      let sphere2 = new SphereMesh(2,2)
      g1.add(sphere1)
      g1.add(sphere2)
      expect(g1.group[0]).toBe(sphere1)
      expect(g1.group[1]).toBe(sphere2)
    })
    it('Checking group addition and removal', () => {
      const g1 = new Group({x: 1, y: 1, z:0})
      let sphere1 = new SphereMesh(1,1)
      let sphere2 = new SphereMesh(2,2)
      let toBeRemoved = new SphereMesh(-4,5)
      g1.add(sphere1)
      g1.add(toBeRemoved)
      g1.add(sphere2)
      expect(g1.group.length).toBe(3)
      expect(g1.group[1]).toBe(toBeRemoved)
      g1.remove(toBeRemoved)
      expect(g1.group.length).toBe(2)
      expect(g1.group[1]).toBe(sphere2)
    })
     it('Checking empty group', () => {
      const g1 = new Group({x: 1, y: 1, z:0})
      let sphere1 = new SphereMesh(1,1)
      g1.add(sphere1)
      g1.remove(sphere1)
      expect(g1.group.length).toBe(0)
    })
    })
  })



  