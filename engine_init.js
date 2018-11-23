var qg = {
    vec3: function(x, y, z) {
        return new BABYLON.Vector3(x, y, z);
    }
}

function createCommonSceneElements(scene) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //scene.defaultMaterial.wireframe = true;
    scene.defaultMaterial.diffuseColor  =  new BABYLON.Color3(0.8, 0.2, 0.0);

    scene.clearColor = new BABYLON.Color3(0.03, 0.03, 0.02);

    qg.showAxis(8, scene);
}