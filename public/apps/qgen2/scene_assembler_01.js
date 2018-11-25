'use strict'
qg_scene_lib.HDR_SCENE_01 = (qscene) => {
    let scene = qscene.scene;

    const scenePlugins = [
        QG_PLUGIN.ArcRotateCamera,
        QG_PLUGIN.HemisphericLight,
        QG_PLUGIN.DefaultMaterial,
        //QG_PLUGIN.GizmoManager,
        //QG_PLUGIN.SceneAxisDisplay,
        QG_PLUGIN.HDRSkyBox
    ];
    qscene.addScenePlugins(scenePlugins);

    // --------- Add custom scene elements ---------
    var sphereGlass = BABYLON.Mesh.CreateSphere("sphereGlass", 48, 1.0, scene);
    sphereGlass.translate(new BABYLON.Vector3(1, 0, 0), -3);
    var sphereMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 48, 1.0, scene);
    sphereMetal.translate(new BABYLON.Vector3(1, 0, 0), 3);
    var spherePlastic = BABYLON.Mesh.CreateSphere("spherePlastic", 48, 1.0, scene);
    spherePlastic.translate(new BABYLON.Vector3(0, 0, 1), -3);
    var woodPlank = BABYLON.MeshBuilder.CreateBox("plane", {
        width: 3,
        height: 0.1,
        depth: 3
    }, scene);
    var glass = new BABYLON.PBRMaterial("glass", scene);
    glass.reflectionTexture = qscene.textures.env_hdr;
    glass.refractionTexture = qscene.textures.env_hdr;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    sphereGlass.material = glass;
    var metal = new BABYLON.PBRMaterial("metal", scene);
    metal.reflectionTexture = qscene.textures.env_hdr;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
    sphereMetal.material = metal;
    var plastic = new BABYLON.PBRMaterial("plastic", scene);
    plastic.reflectionTexture = qscene.textures.env_hdr;
    plastic.microSurface = 0.96;
    plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
    plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
    spherePlastic.material = plastic;
    var wood = new BABYLON.PBRMaterial("wood", scene);
    wood.reflectionTexture = qscene.textures.env_hdr;
    wood.environmentIntensity = 1;
    wood.specularIntensity = 0.3;
    wood.reflectivityTexture = new BABYLON.Texture("textures/reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;
    wood.albedoColor = BABYLON.Color3.White();
    wood.albedoTexture = new BABYLON.Texture("textures/albedo.png", scene);
    woodPlank.material = wood;
}

qg_scene_lib.PROCEDURAL_SCENE_01 = (qscene) => {
    let scene = qscene.scene;

    const scenePlugins = [
        QG_PLUGIN.ArcRotateCamera,
        QG_PLUGIN.HemisphericLight,
        QG_PLUGIN.DefaultMaterial,
        QG_PLUGIN.SceneAxisDisplay,
        QG_PLUGIN.GizmoManager,
        QG_PLUGIN.HDRSkyBox
    ];
    qscene.addScenePlugins(scenePlugins);

    // --------- Add custom scene elements ---------
    //Create a custom mesh  
    var customMesh = new BABYLON.Mesh("custom", scene);
    customMesh.position = qg.vec3(0, -30, 0);
    /*
    var mat = new BABYLON.StandardMaterial("mat", scene);

    mat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    //mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    mat.wireframe = false;
    mat.backFaceCulling = false;
    //mat.diffuseColor  =  new BABYLON.Color3(0.8, 0.2, 0.0);
    */
    
    var glass = new BABYLON.PBRMaterial("glass", scene);
    glass.reflectionTexture = qscene.textures.env_hdr;
    glass.refractionTexture = qscene.textures.env_hdr;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    glass.backFaceCulling = false;
    //glass.wireframe = true;
    customMesh.material = glass;
      

    var metal = new BABYLON.PBRMaterial("metal", scene);
    metal.reflectionTexture = qscene.textures.env_hdr;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new BABYLON.Color3(0.05, 0.85, 0.85);
    metal.albedoColor = new BABYLON.Color3(0.01, 0.81, 0.01);
    metal.backFaceCulling = false;
    //metal.wireframe = true;
    //sphereMetal.material = metal;
    //customMesh.material = metal;
    const STEPS = 50;
    let posTransformer = (pos_vec_orig, pos_vec, i, j) => {
        let newPos = pos_vec.clone();
        j = j + 1;
        newPos.y += 1;
        newPos.x = pos_vec_orig.x;
        newPos.z = pos_vec_orig.z;
        const STEP_1 = STEPS/2;
        const scaleX = (1 - j*j/(STEPS*STEPS)) + Math.cos(j*2)/100;
        const scaleZ = (1 - STEP_1*STEP_1/(STEPS*STEPS)) + Math.cos(j*2)/100;
        

        //let pxz = new BABYLON.Vector2(newPos.x, newPos.z);
        // j = 0 S=1 j=30, S=0  1 - (j/30)
        //pxz = pxz.scale(1 - j/STEPS);
        //newPos.x += Math.cos(j*2)/10;
        newPos.x *= j<STEPS/2?scaleX:scaleZ;
        newPos.z *= j<STEPS/2?scaleX:scaleZ;
        //newPos.x = newPos.x / (j+1);
        //newPos.z += Math.sin(j*2)/10;
        //console.log(pos_vec_orig, newPos, i, j);
        return newPos;
    }

    let spreadData = {
        radius: 50.0,
        count: 200,
        r_amp: 0.05,
        freq: 10
    }

    let scaleVariator = (p) => {
        var scaleFactor = 1 + (Math.cos((p.i * 2 * p.freq * Math.PI) / p.count) + 1) * p.r_amp;
        return scaleFactor;
    }
    let pos_spread = qg.flattenVec3Array(qg.positionRadialSpreader(spreadData, scaleVariator));
    //qg.displayPreviewSpheresAtPositions_2(scene, pos_spread, 0.02, metal);
    //console.log('pos_spread:', pos_spread);

    //Empty array to contain calculated values
    var normals = [];

    let mesh_data = qg.genExtrudedMesh(pos_spread, posTransformer, STEPS);
    var vertexData = new BABYLON.VertexData();

    //Assign positions, indices and normals to vertexData
    vertexData.positions = mesh_data.positions;
    vertexData.indices = mesh_data.indices;
    BABYLON.VertexData.ComputeNormals(mesh_data.positions, mesh_data.indices, normals, {
        useRightHandedSystem: true
    });
    
    //console.log('normals:', normals);
    vertexData.normals = normals;
    console.log('vertexData.indices:', vertexData.indices.length)
    console.log('vertexData.positions:', vertexData.positions.length / 3)

    //qg.displayPreviewSpheresAtPositions_2(scene, mesh_data.positions, 0.02, metal);
    //Apply vertexData to custom mesh
    vertexData.applyToMesh(customMesh);
}