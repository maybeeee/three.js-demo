// part: head-灯罩，body-灯杆，foot-灯座
var part = ['head', 'body', 'foot'];

// panel 控制面板
// objs 模型切换按钮
// mtls 纹理切换按钮
var panel = document.getElementById('panel');
var objs = document.getElementsByClassName('obj');
var mtls = document.getElementsByClassName('mtl');
var textures = document.getElementsByClassName('texture');

// 给obj与mtl添加索引
for(var j=0; j<objs.length; j++){
    objs[j].index = j;
    mtls[j].index = j;
}
for(var k=0; k<textures.length; k++){
    textures[k].index = k;
}

// 利用事件冒泡把事件委托给panel
addEvent(panel, 'click', function(e){
    var e = e || window.event;
    var target = e.target || e.srcElement;
    // 接收点击对象的类型
    var type = judge(target);
    if(type == 'obj'){
        // 如果点击目标属于obj类，执行changeObj
        changeObj(target);
    } else if(type == 'mtl'){
        // 如果点击目标属于mtl类，执行changeMtl
        changeMtl(target);
    } else if(type == 'texture'){
        addTexture(target);
    } else{
        return null;
    }
});

// 判断点击元素是否是可点选对象
// 点击active状态对象返回undefined
// 点击panel中的其他位置是，返回'forbidden'
// 点击非active状态的obj类元素时，返回'obj'
// 点击非active状态的mtl类元素时，返回'mtl'
function judge(element){
    var type;
    if(!element.classList.contains('active')){
        if(element.classList.contains('obj')){
            type = 'obj';
        } else if(element.classList.contains('mtl')){
            type = 'mtl';
        } else if(element.classList.contains('texture')){
            type = 'texture';
        } else {
            type = 'forbidden';
        }
    }
    return type;
}

// 点击obj缩略图时的逻辑
function changeObj(element){
    // 切换active状态
    var another = element.index%2 == 0
        ? element.index+1
        : element.index-1;
    objs[another].classList.remove('active');
    element.classList.add('active');
    if(element.index%2 == 0){
        mtls[element.index].classList.add('active');
        mtls[another].classList.remove('active');
    } else {
        mtls[another].classList.add('active');
        mtls[element.index].classList.remove('active');
    }
    // 切换纹理缩略图
    // 索引的奇偶性
    // 偶数时num为0
    // 奇数时num为1
    var num = element.index%2;
    // css sprite
    if(num){
        mtls[element.index].style.backgroundPosition
            = '-50px -50px';
        mtls[another].style.backgroundPosition
            = '0 -50px';
    } else {
        mtls[element.index].style.backgroundPosition
            = '0 0';
        mtls[another].style.backgroundPosition
            = '-50px 0';
    }
    // 切换模型
    // 通过name查找部件
    // scene.remove() three.js库提供的方法，移除模型
    var name = getName(element.index);
    scene.remove(scene.getObjectByName(name));
    var index;
    if(num){
        index = 3;
    } else {
        index = 1;
    }
    // 异步加载模型
    loadModelAsync(name + index);
    reposition();
}

// 点击mtl缩略图时的逻辑
function changeMtl(element){
    // 切换active状态
    var another = element.index%2 == 0
        ? element.index+1
        : element.index-1;
    mtls[another].classList.remove('active');
    element.classList.add('active');

    var name = getName(element.index);
    scene.remove(scene.getObjectByName(name));
    var num = element.index%2;
    var index;
    if(objs[element.index].classList.contains('active')){
        if(num){
            index = 4;
        } else {
            index = 1;
        }
    } else {
        if(num){
            index = 2;
        } else {
            index = 3;
        }
    }
    loadModelAsync(name + index);
    reposition();
}

function addTexture(element){
    var object = scene.getObjectByName('head');
    var material = new THREE.MeshLambertMaterial({color:0xFFFFFF});
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('texture/texture'+ (element.index + 1) +'.jpg');
    object.traverse( function(child){
        if(child instanceof THREE.Mesh){
            child.material = material;
            child.material.map = null;
            child.material.map = texture;
            child.material.needsUpdate = true;
        }
    });
}


// 重新定位模型位置。
// 使用loadModel载入模型时，在各个模型对象中写入了属性max与min。
// 上部模型的min减去下部模型的max除以2即为重定位的位移量。
function reposition() {
    // 因为loadModel是异步的，所以在完成模型载入前获取这个对象会报错。
    // 设置定时器的目的是将事件推入事件栈底部，等到模型载入完成后再获取，避免报错。
    setTimeout(function () {
        var head, body, foot;
        var num1, num2;

        head = scene.getObjectByName('head');
        body = scene.getObjectByName('body');
        foot = scene.getObjectByName('foot');
        
        num1 = body.min - foot.max ;
        num2 = head.min - body.max ;

        body.position.y = -50 - parseInt(num1/2);
        head.position.y = -50 - parseInt(num2/2) - parseInt(num1/2);
    }, 100);
}

// 根据索引值返回name
function getName(index) {
    // 层数与name对应：第一层对应head，第二层对应body，第三层对应foot
    var floor = Math.floor(index/2);
    return part[floor];
}

// 封装事件绑定
function addEvent(element, type, handler){
    if(element.addEventListener){
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent){
        element.attachEvent('on'+type, function(){
            handler.call(element);
        });
    } else {
        element['on'+type] = handler;
    }
}

// 异步获取数据并加载
function loadModelAsync(part){
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200 ){
            var json = JSON.parse(xhr.responseText);
            var name = json.name.slice(0, -1);
            loadModel(json.mtlPath, json.objPath, name);
        }
    };
    xhr.open('GET', '/product?part=' + part, true);
    xhr.send(null);
}

