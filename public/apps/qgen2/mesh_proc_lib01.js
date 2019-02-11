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
param: direction is 1 or -1 (clockwise/anti clockwise)
@PUBLIC_METHOD 
@USES_LAMBDA: f_radialScaleVariator
*/
qg.positionRadialSpreader = (p, f_radialScaleVariator, direction=1) => {
    const C = p.count;
    const pi = Math.PI;
    let deltaAngle = -pi * 2 * direction / C;
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

//pos_list is an array of Vector3
qg.displayPreviewSpheresAtPositions = (scene, pos_list, diameter, material) => {
    let dia = diameter ? diameter : 0.5;
    for (let i in pos_list) {
        var s = BABYLON.MeshBuilder.CreateSphere("s" + i, {
            dia: diameter
        }, scene);
        s.position = pos_list[i];
        if(material) s.material = material;
    }
}

// Raw pos_list array
qg.displayPreviewSpheresAtPositions_2 = (scene, pos_list, diameter, material) => {
    let dia = diameter ? diameter : 0.5;
    for (let i = 0; i < pos_list.length; i += 3) {
        var s = BABYLON.MeshBuilder.CreateSphere("s" + i, {
            dia: diameter
        }, scene);
        s.position = qg.vec3(pos_list[i], pos_list[i + 1], pos_list[i + 2]);
        if(material) s.material = material;
    }
}

/*
Assumes source indexes are in order
@LOCAL_LAMBDA
*/
qg.extrude_findIndexOrderOfStrip = (baseSize, startIndex = 0, isClosed = true) => {
    let indices = [];
    const N = baseSize;
    const eN = N - 1;
    for (let i = 0; i < N; i++) {
        let k = startIndex + i;
        if (i == eN) { // end of strip joined to start, if closed, else do not join
            // Create 1 quad face, i.e 2 tris
            if (isClosed) indices.push(
                k, startIndex, k + 1, // Tri 1
                k + 1, k + N, k       // Tri 2
            );
        } else {
            // Create 1 quad face, i.e 2 tris
            indices.push(
                k, k + 1, k + 1 + N, // Tri 1
                k + 1 + N, k + N, k  // Tri 2 
            );
        }
    }
    //console.log('indices:', indices);
    return indices;
}

/*
Assumes source indexes are in order
@LOCAL_LAMBDA
*/
qg.extrude_generateFaces_b = (baseSize, startIndex = 0, index_face_map, isClosed = true) => {
    let indices = [];
    const N = baseSize;
    const eN = N - 1;
    for (let i = 0; i < N; i++) {
        let k = startIndex + i;
        if (i == eN) { // end of strip joined to start, if closed, else do not join
            // Create 1 quad face, i.e 2 tris
            if (isClosed) {
                let tri_1 = [k, startIndex, k + 1];
                let tri_2 = [k + 1, k + N, k];
                
                indices.push(
                    tri_1[0],tri_1[1], tri_1[2], // Tri 1
                    tri_2[0],tri_2[1], tri_2[2] // Tri 2
                );
                for(let j in tri_1) {
                    qg.p_pushToIndexTriMap(tri_1[i], tri_1, index_face_map);
                    qg.p_pushToIndexTriMap(tri_2[i], tri_2, index_face_map);
                }
            }
        } else {
            // Create 1 quad face, i.e 2 tris
            let tri_1 = [k, k + 1, k + 1 + N];
            let tri_2 = [k + 1 + N, k + N, k];
                
            indices.push(
                tri_1[0],tri_1[1], tri_1[2], // Tri 1
                tri_2[0],tri_2[1], tri_2[2] // Tri 2
            );
            for(let j in tri_1) {
                qg.p_pushToIndexTriMap(tri_1[i], tri_1, index_face_map);
                qg.p_pushToIndexTriMap(tri_2[i], tri_2, index_face_map);
            }
        }
    }
    //console.log('indices:', indices);
    return indices;
}


// Map key:index -> value:{ faces:[tri1, tri2 ] } List of tris for the index
// @private
qg.p_pushToIndexTriMap = (index, tri, map) => {
    if(map[index]) {
        // Assumes faces key exists
        map[index].faces.push(tri);
    } else {
        // Create new if not exists
        map[index] = {faces: [tri] };
    }
}
/*
Inputs are flat float arrays of x,y,z coords, and not vector arrays
@LOCAL_LAMBDA
*/
qg.extrude_findNextExtrudedPositions = (orig_vpos_array, src_vpos_array, f_posTranformer, steps_j = 0) => {
    let vx_array = [];
    for (let i = 0; i < src_vpos_array.length; i += 3) {

        // Apply the transformation for each vertex. Returns a new vector.
        // Inputs are also converted to vectors
        let vx = f_posTranformer(
            qg.vec3(orig_vpos_array[i], orig_vpos_array[i + 1], orig_vpos_array[i + 2]),
            qg.vec3(src_vpos_array[i], src_vpos_array[i + 1], src_vpos_array[i + 2]),
            i, steps_j, src_vpos_array);
        vx_array.push(vx.x, vx.y, vx.z);
    }
    return vx_array;
}

/*
@PUBLIC_METHOD
@USES_LAMBDA: private: extrude_findNextExtrudedPositions, extrude_findIndexOrderOfStrip
*/
qg.genExtrudedMesh = (base_vpos_array, f_posTranformer, steps, isClosed = true) => {
    let index_face_map = {};
    let final_pos_array = base_vpos_array;
    let final_index_array = [];
    const N = base_vpos_array.length / 3;
    let next_pos_array = base_vpos_array; // Full array value copy is not necessary
    for (let m = 0; m < steps; m++) {
        // Full array value copy is not necessary
        next_pos_array = qg.extrude_findNextExtrudedPositions(base_vpos_array, next_pos_array, f_posTranformer, m);
        let strip_indices = qg.extrude_generateFaces_b(N, N * m, index_face_map, isClosed);
        final_pos_array.push(...next_pos_array);
        final_index_array.push(...strip_indices);
    }
    return {
        positions: final_pos_array,
        indices: final_index_array,
        index_face_map: index_face_map
    };
}