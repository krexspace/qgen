'use strict'
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
    var scene = 
    new BABYLON.Scene(engine);

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

var createScene3 = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    createCommonSceneElements(scene);

    var spheres = [];
    var pos = qg.vec3(10,0,0);
    var C = 500;
    const pi = Math.PI;
    var deltaAngle = pi * 2/ C;
    const f = 2.0;
    const a = 0.5;
	for (var i = 1; i <= C; i++) {
        var s = BABYLON.MeshBuilder.CreateSphere("s" + i, { diameter: 0.5 }, scene);
        var scaleFactor = a + (Math.cos((i * 2 * f * pi)/ C) + 1) / 2;
        //console.log('scaleFactor=',scaleFactor);
        var pos2 = pos.scale(scaleFactor);
        s.position = pos2;
        
        pos = qg.rotateVector_EulerVec(pos, qg.vec3(0,deltaAngle, 0));
        
	}
	
    return scene;

};

var createScene4 = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    createCommonSceneElements(scene);

    let spheres = [];
    let spreadData = {
        radius: 100.0,
        count: 1000,
        r_amp: 0.2,
        freq: 20.0
    }
    let scaleVariator = (p) => {
        var scaleFactor = p.r_amp + (Math.cos((p.i * 2 * p.freq * Math.PI)/ p.count) + 1) / 2;
        return scaleFactor;
    }
    let pos_spread = qg.positionRadialSpreader(spreadData, scaleVariator);
	for(let i in pos_spread) {
        var s = BABYLON.MeshBuilder.CreateSphere("s" + i, { diameter: 0.5 }, scene);
        s.position = pos_spread[i];
    }
    return scene;
};

var createScene5 = function () {
    var scene = new BABYLON.Scene(engine);
    createCommonSceneElements(scene);

    //Array of paths to construct extrusion

    let spreadData = {
        radius: 10.0,
        count: 5,
        r_amp: 0.5,
        freq: 0.0
    }
    let scaleVariator = (p) => {
        var scaleFactor = p.r_amp + (Math.cos((p.i * 2 * p.freq * Math.PI)/ p.count) + 1) / 2;
        return scaleFactor;
    }
    let pos_spread = qg.positionRadialSpreader(spreadData, scaleVariator);
    qg.displayPreviewSpheresAtPositions(scene, pos_spread);
    //myShape.push(myShape[0]);
    let s = 3;
    var myPath = [
            new BABYLON.Vector3(10, 0, 0),
            new BABYLON.Vector3(10, 10, 0)
    ];
    
    //Create extrusion with updatable parameter set to true for later changes
    var extrusion = BABYLON.MeshBuilder.ExtrudeShape("star", {shape: pos_spread, path: myPath, scale:2,sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
            

    return scene;
}

var createScene6 = function () {
    var scene = new BABYLON.Scene(engine);
    createCommonSceneElements(scene);

	//Create a custom mesh  
	var customMesh = new BABYLON.Mesh("custom", scene);
	
	//Set arrays for positions and indices
	var positions = [-5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3];
	var indices = [0, 1, 2, 3, 4, 5];	
	var colors = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0,  0, 1, 0, 1];
	
	//Empty array to contain calculated values
	var normals = [];
	
	var vertexData = new BABYLON.VertexData();
	BABYLON.VertexData.ComputeNormals(positions, indices, normals);

	//Assign positions, indices and normals to vertexData
	vertexData.positions = positions;
	vertexData.indices = indices;
	vertexData.normals = normals;
	vertexData.colors = colors;

	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return scene;
};

var createScene8 = function () {
    var scene = new BABYLON.Scene(engine);
    createCommonSceneElements(scene);
    
	//Create a custom mesh  
	var customMesh = new BABYLON.Mesh("custom", scene);
	let posTransformer = (pos_vec, i, j) =>{
        let newPos = pos_vec.clone();
        newPos.y += 2;
        return newPos;
    }
	//Set arrays for positions and indices
	var positions = [0,0,0,10,0,0,10,0,10,0,0,10];
	//var indices = [0, 1, 2, 3];	
    //qg.displayPreviewSpheresAtPositions_2(scene, positions,0.02);
    //var exPos_array = qg.extrude_findNextExtrudedPositions(positions, posTransformer);
    
	//Empty array to contain calculated values
	var normals = [];
    
    let mesh_data = qg.genExtrudedMesh(positions, posTransformer, 10);
	var vertexData = new BABYLON.VertexData();
	

	//Assign positions, indices and normals to vertexData
	vertexData.positions = mesh_data.positions;
    vertexData.indices = mesh_data.indices;
    BABYLON.VertexData.ComputeNormals(mesh_data.positions, mesh_data.indices, normals);
	vertexData.normals = normals;
	//vertexData.colors = colors;
    qg.displayPreviewSpheresAtPositions_2(scene, mesh_data.positions, 0.1);
	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return scene;
};

var createScene_801 = function () {
    var scene = new BABYLON.Scene(engine);
    createCommonSceneElements(scene);
    
	//Create a custom mesh  
    var customMesh = new BABYLON.Mesh("custom", scene);
    
    var mat = new BABYLON.StandardMaterial("mat", scene);

    mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    //mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    mat.wireframe = false;
    mat.backFaceCulling = false;
    //mat.diffuseColor  =  new BABYLON.Color3(0.8, 0.2, 0.0);
    customMesh.material = mat;
    
	let posTransformer = (pos_vec, i, j) =>{
        let newPos = pos_vec.clone();
        newPos.y += 2;
        return newPos;
    }
	//Set arrays for positions and indices
	//var pos_spread = [0,0,0,10,0,0,10,0,10,0,0,10];
	//var indices = [0, 1, 2, 3];	
    //qg.displayPreviewSpheresAtPositions_2(scene, positions,0.02);
    //var exPos_array = qg.extrude_findNextExtrudedPositions(positions, posTransformer);
    let spreadData = {
        radius: 50.0,
        count: 1000,
        r_amp: 0.5,
        freq: 20
    }
    let scaleVariator = (p) => {
        var scaleFactor = p.r_amp + (Math.cos((p.i * 2 * p.freq * Math.PI)/ p.count) + 1) / 2;
        return scaleFactor;
    }
    let pos_spread = qg.flattenVec3Array(qg.positionRadialSpreader(spreadData, scaleVariator));
    //qg.displayPreviewSpheresAtPositions(scene, pos_spread);
    //console.log('pos_spread:', pos_spread);
    
	//Empty array to contain calculated values
	var normals = [];
    
    let mesh_data = qg.genExtrudedMesh(pos_spread, posTransformer, 10);
	var vertexData = new BABYLON.VertexData();
	

	//Assign positions, indices and normals to vertexData
	vertexData.positions = mesh_data.positions;
    vertexData.indices = mesh_data.indices;
    BABYLON.VertexData.ComputeNormals(mesh_data.positions, mesh_data.indices, normals, {useRightHandedSystem: true});
    //console.log('normals:', normals);
    vertexData.normals = normals;
    console.log('vertexData.indices:',vertexData.indices.length)
    console.log('vertexData.positions:',vertexData.positions.length/3)
    //vertexData.normals = qg.reverseAll_NumArray(normals);
    //console.log('rev normals:',vertexData.normals);
	//vertexData.colors = colors;
    //qg.displayPreviewSpheresAtPositions_2(scene, mesh_data.positions, 0.1);
	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return scene;
};