/**
 *   初始化场景，载入首屏所需三维模型
 */

// container canvas画板容器
var container, controls, stats;

// three.js三要素：相机，场景，渲染器
var camera, scene, renderer;

init();
animate();


(function(products) {
  for (var i = 0; i < products.length; i++) {
    var name = products[i].name.slice(0, -1);
    loadModel(products[i].mtlPath, products[i].objPath, name);
  }
})(products);

// mtl 材质路径
// obj 模型文件路径
// name 给载入的模型对象添加的name属性值
function loadModel(mtl, obj, name) {

  var onProgress = function(xhr) {};
  var onError = function(xhr) {};

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load(mtl, function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(obj, function(object) {
      object.name = name;
      // 给载入对象写入max、min属性
      // max 保存模型y轴方向的最大本地坐标值
      // min 保存模型y轴方向的最小本地坐标值
      object.children[0].geometry.computeBoundingBox();
      object.max = parseInt(object.children[0].geometry.boundingBox.max.y);
      object.min = parseInt(object.children[0].geometry.boundingBox.min.y);

      object.position.y = -50;
      object.scale.set(0.5, 0.5, 0.5);
      scene.add(object);

    }, onProgress, onError);
  });
}

function init() {

  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 250;

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  // 场景
  scene = new THREE.Scene();
  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  var directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1).normalize();
  scene.add(directionalLight);

  // 天空盒
  var reflectionCube = new THREE.CubeTextureLoader()
    .setPath('images/Park3Med/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  reflectionCube.format = THREE.RGBFormat;
  scene.background = reflectionCube;

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);


  // stats
  stats = new Stats();
  container.appendChild( stats.dom );

  //controls = new THREE.TransformControls(camera, renderer.domElement);
  //controls.addEventListener('change', render);
  //controls.setMode("translate");

  //scene.add(controls);


  window.addEventListener('resize', onWindowResize, false);
}

// 窗口尺寸变化时
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画
function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

// 相机视点、渲染
function render() {
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}