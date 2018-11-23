function createCommonSceneElements(scene) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //scene.defaultMaterial.wireframe = true;
    scene.defaultMaterial.diffuseColor  =  new BABYLON.Color3(0.2, 1, 0.2);

    scene.clearColor = new BABYLON.Color3(0.03, 0.03, 0.02);
}
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    createCommonSceneElements(scene);

    //Array of paths to construct extrusion
    var myShape = [
             new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 10, 0),
            new BABYLON.Vector3(10.5, 10, 0.5),
            new BABYLON.Vector3(10, 0, 0)
            //new BABYLON.Vector3(1, -1, 0)
            /*
            new BABYLON.Vector3(0, -5, 0),
            new BABYLON.Vector3(-1, -1, 0),
            new BABYLON.Vector3(-5, 0, 0),
            new BABYLON.Vector3(-1, 1, 0)
            */
    ];
    
    myShape.push(myShape[0]);
    let s = 3;
    var myPath = [
            new BABYLON.Vector3(0, 0, 0 * s),
            new BABYLON.Vector3(0, 1, 2 * s),
            new BABYLON.Vector3(0, 3, 4 * s),
            new BABYLON.Vector3(0, 3, 6 * s),
            new BABYLON.Vector3(0, 1, 8 * s),
            new BABYLON.Vector3(0, 0, 10 * s)
    ];
    
    //Create extrusion with updatable parameter set to true for later changes
    var extrusion = BABYLON.MeshBuilder.ExtrudeShape("star", {shape: myShape, path: myPath, scale:2,sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
            

    return scene;
}

var createScene2 = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    createCommonSceneElements(scene);

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 1, scene, true);
	
	var positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var spheres = [];
	for (var i = 0; i < positions.length; i = i + 3) {
		var v = BABYLON.Vector3.FromArray(positions, i);
		
		var s = BABYLON.MeshBuilder.CreateSphere("s" + i, { diameter: 0.5 }, scene);
		s.position.copyFrom(v);
		spheres.push(s);
	}
	
	ground.registerBeforeRender(function () {
		spheres[3].position.x += 0.01;
		var positions = [];
		spheres.forEach(function (s) {
			positions.push(s.position.x, s.position.y, s.position.z);

		});
		ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
		ground.refreshBoundingInfo();
	});

    return scene;

};