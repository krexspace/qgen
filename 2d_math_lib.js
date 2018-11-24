'use strict'
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

/*
// Sample usage:
let spreadData = {
    radius: 20.0, // Overall radius
    count: 300, // Spread count
    r_amp: 0.5, // Radial ampliude ratio
    freq: 20.0 // Variation frequency
}
let scaleVariator = (p) => {
    var scaleFactor = p.r_amp + (Math.cos((p.i * 2 * p.freq * Math.PI)/ p.count) + 1) / 2;
    return scaleFactor;
}
let pos_spread = qg.positionRadialSpreader(spreadData, scaleVariator);
*/
qg.positionRadialSpreader = (p, f_radialScaleVariator)=> {
    const C = p.count;
    const pi = Math.PI;
    let deltaAngle = pi * 2/ C;
    let pos_list = [];

    let next_pos = qg.vec3(p.radius, 0, 0); 
    for (var i = 1; i <= C; i++) {
        p.i = i;
        var scaleFactor = f_radialScaleVariator(p);
        //console.log('scaleFactor:', scaleFactor);
        var scaled_pos = next_pos.scale(scaleFactor);
        pos_list.push(scaled_pos);
        next_pos = qg.rotateVector_EulerVec(next_pos, qg.vec3(0, deltaAngle, 0));
    }
    return pos_list;
}

qg.displayPreviewSpheresAtPositions = (scene, pos_list, diameter) => {
    let dia = diameter?diameter:0.5;
    for(let i in pos_list) {
        var s = BABYLON.MeshBuilder.CreateSphere("s" + i, { dia: diameter }, scene);
        s.position = pos_list[i];
    }
}