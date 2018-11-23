// To Test
/*
// Cloth code
//https://blog.raananweber.com/2016/04/03/cloth-physics-simulation-for-babylon-js/
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
qg.rotateVector_EulerVec = function(bvec3, rotEulerVec) {
    var quaternion = BABYLON.Quaternion.FromEulerVector(rotEulerVec);
    //var quaternion = new BABYLON.Quaternion.RotationAxis(axisBvec, angle); // check
    //console.log(bvec3, quaternion);
    return bvec3.rotateByQuaternionToRef(quaternion, bvec3);
}
