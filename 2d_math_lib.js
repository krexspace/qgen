// To Test
/*    
// Creation of a lines mesh
	var lines = BABYLON.Mesh.CreateLines("lines", [
        new BABYLON.Vector3(-10, 0, 0),
        new BABYLON.Vector3(10, 0, 0),
        new BABYLON.Vector3(0, 0, -10),
        new BABYLON.Vector3(0, 0, 10)
    ], scene);


  // ---SLERP---
  //https://www.babylonjs-playground.com/#74G81U#6
      let makeAnimKeys = function(startQuat, endQuat) {
        let keys = [];
        let k = 40;
        for (let i = 0; i<40; i++){
            let frameQuat = BABYLON.Quaternion.Slerp(startQuat, endQuat, i/k)
            keys.push({frame: i, value: frameQuat});
        }
        return keys;
    }
*/

// param: var angle = Math.PI / 8;
qg.rotateVector_AxisAngle = function(bvec3, axisBvec, angle) {
    var axis = new BABYLON.Vector3(0, 1, 0);
    var quaternion = new BABYLON.Quaternion.RotationAxis(axisBvec, angle);
    
    return bvec3.rotateByQuaternionToRef(quaternion);
}
