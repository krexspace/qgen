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

var qg_scene_lib = {
};

class QScene {
    constructor(engine) {
        this.scene = new BABYLON.Scene(engine);
        this.textures = {};
    }
    addScenePlugins(plugins) {
        for(let p of plugins) p(this.scene, this);
    }
    addScenePlugin(plugin) {
        plugin(this.scene, this);
    }
    assemble(sceneId) {
        sceneId(this);
    }
}

var QG_PLUGIN = {};
// Cameras
QG_PLUGIN.ArcRotateCamera = (scene) => {
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.minZ = 0.1;
}

// Lights
QG_PLUGIN.HemisphericLight = (scene) => {
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 0, 0);
    light.specular = new BABYLON.Color3(0, 1, 0);
    light.groundColor = new BABYLON.Color3(0, 1, 0);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.3;
}

// Default Materials
QG_PLUGIN.DefaultMaterial = (scene) => {
    //scene.defaultMaterial.wireframe = true;
    scene.defaultMaterial.diffuseColor  =  new BABYLON.Color3(0.8, 0.2, 0.0);
    scene.defaultMaterial.backFaceCulling = true;
    scene.clearColor = new BABYLON.Color3(0.03, 0.03, 0.02);
}

QG_PLUGIN.SceneAxisDisplay = (scene) => {
    qg.showAxis(8, scene);
}

// Gizmo Manager
QG_PLUGIN.GizmoManager = (scene) => {
    // Initialize GizmoManager
    var gizmoManager = new BABYLON.GizmoManager(scene)

    // Initialize all gizmos
    gizmoManager.boundingBoxGizmoEnabled=true;
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.scaleGizmoEnabled = true;

    // Modify gizmos based on keypress
    document.onkeydown = (e)=>{
        if(e.key == 'w' || e.key == 'e'|| e.key == 'r'|| e.key == 'q'){
            // Switch gizmo type
            gizmoManager.positionGizmoEnabled = false;
            gizmoManager.rotationGizmoEnabled = false;
            gizmoManager.scaleGizmoEnabled = false;
            gizmoManager.boundingBoxGizmoEnabled = false;
            if(e.key == 'w'){
                gizmoManager.positionGizmoEnabled = true;
            }
            if(e.key == 'e'){
                gizmoManager.rotationGizmoEnabled = true;
            }
            if(e.key == 'r'){
                gizmoManager.scaleGizmoEnabled = true;
            }
            if(e.key == 'q'){
                gizmoManager.boundingBoxGizmoEnabled = true;
            }
        }
        if(e.key == 'y'){
            // hide the gizmo
            gizmoManager.attachToMesh(null);
        }
        if(e.key == 'a'){
            // Toggle local/global gizmo rotation positioning
            gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;
            gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = !gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh;
        }
        if(e.key == 's'){
            // Toggle distance snapping
            if(gizmoManager.gizmos.scaleGizmo.snapDistance == 0){
                gizmoManager.gizmos.scaleGizmo.snapDistance = 0.3;
                gizmoManager.gizmos.rotationGizmo.snapDistance = 0.3;
                gizmoManager.gizmos.positionGizmo.snapDistance = 0.3;
            }else{
                gizmoManager.gizmos.scaleGizmo.snapDistance = 0;
                gizmoManager.gizmos.rotationGizmo.snapDistance = 0;
                gizmoManager.gizmos.positionGizmo.snapDistance = 0;
            }
        }
        if(e.key == 'd'){
            // Toggle gizmo size
            if(gizmoManager.gizmos.scaleGizmo.scaleRatio == 1){
                gizmoManager.gizmos.scaleGizmo.scaleRatio = 1.5;
                gizmoManager.gizmos.rotationGizmo.scaleRatio = 1.5;
                gizmoManager.gizmos.positionGizmo.scaleRatio = 1.5;
            }else{
                gizmoManager.gizmos.scaleGizmo.scaleRatio = 1;
                gizmoManager.gizmos.rotationGizmo.scaleRatio = 1;
                gizmoManager.gizmos.positionGizmo.scaleRatio = 1;
            }
        }
    }

    // Start by only enabling position control
    document.onkeydown({key: "w"})
}

// Adds hdrTexture to QScene
QG_PLUGIN.HDRSkyBox = (scene, qscene) => {
    // Create objects
    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.dds", scene);
    
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    hdrSkybox.isPickable = false;
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
    
    qscene.textures["env_hdr"] = hdrTexture;
    //scene.clearColor = new BABYLON.Color3(0.33, 0.03, 0.02);
}

// Deprecated
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