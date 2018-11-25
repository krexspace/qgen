var qg = {
    vec3: (x, y, z) => {
        return new BABYLON.Vector3(x, y, z);
    },

    flattenVec3Array: (vec3_array) => {
        let pl = [];
        for(let v of vec3_array) {
            pl.push(v.x,v.y,v.z);
        }
        return pl;
    },

    reverseAll_NumArray: (num_array) => {
        let pl = [];
        for(let v of num_array) {
            pl.push(-v);
        }
        return pl;
    }
}

function createCommonSceneElements(scene) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 0, 0);
	light.specular = new BABYLON.Color3(0, 1, 0);
	light.groundColor = new BABYLON.Color3(0, 1, 0);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.3;

    //scene.defaultMaterial.wireframe = true;
    scene.defaultMaterial.diffuseColor  =  new BABYLON.Color3(0.8, 0.2, 0.0);
    scene.defaultMaterial.backFaceCulling = true;
    scene.clearColor = new BABYLON.Color3(0.03, 0.03, 0.02);

    qg.showAxis(8, scene);
}