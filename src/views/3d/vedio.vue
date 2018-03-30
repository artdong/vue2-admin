<template>
    <section class="threejs-container">
        <div id="Stats-output"></div>
        <video id="video" style="display: none; position: absolute; left: 15px; top: 75px;"
               src="../../assets/movies/Big_Buck_Bunny_small.ogv" controls="true" autoplay="true"></video>

        <!-- Div which will hold the Output -->
        <div id="WebGL-output">
        </div>
    </section>
</template>

<script>
    import THREE from '../../assets/libs/three.js'
    // import Stats from '../../assets/libs/stats.js'
    import Dat from '../../assets/libs/dat.gui.js'

    export default {
        data() {
            return {
                texture: '',
                stats: '',
                scene: '',
                camera: '',
                renderer: '',
                geometry: '',
                material: '',
                mesh: '',
                cube: '',
                webGLRenderer: '',
                controls: '',
                dat: new Dat()
            }
        },

        methods: {
            createMesh(geom) {

                var materialArray = [];
                materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
                materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
                materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
                materialArray.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
                materialArray.push(new THREE.MeshBasicMaterial({map: this.texture}));
                materialArray.push(new THREE.MeshBasicMaterial({color: 0xff51ba}));
                var faceMaterial = new THREE.MeshFaceMaterial(materialArray);


                // create a multimaterial
                var mesh = new THREE.Mesh(geom, faceMaterial);

                return mesh;
            },

            render() {
                // this.stats.update();

                if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                    if (this.texture) this.texture.needsUpdate = true;
                }

                if (this.controls.rotate) {
                    this.cube.rotation.x += -0.01;
                    this.cube.rotation.y += -0.01;
                    this.cube.rotation.z += -0.01;
                }


                // render using requestAnimationFrame
                requestAnimationFrame(render);
                this.webGLRenderer.render(this.scene, this.camera);
            },

            initStats() {

                this.stats = new Stats();
                this.stats.setMode(0); // 0: fps, 1: ms

                // Align top-left
                this.stats.domElement.style.position = 'absolute';
                this.stats.domElement.style.left = '0px';
                this.stats.domElement.style.top = '0px';

                document.getElementById("Stats-output").appendChild(this.stats.domElement);

                return this.stats;
            },

            init() {

                // this.stats = this.initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                this.scene = new THREE.Scene();

                // create a camera, which defines where we're looking at.
                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                this.webGLRenderer = new THREE.WebGLRenderer();
                this.webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
                this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                this.webGLRenderer.shadowMapEnabled = true;

                this.video = document.getElementById('video');
                this.texture = new THREE.Texture(video);
                this.texture.minFilter = THREE.LinearFilter;
                this.texture.magFilter = THREE.LinearFilter;
                this.texture.format = THREE.RGBFormat;
                this.texture.generateMipmaps = false;

                this.cube = this.createMesh(new THREE.BoxGeometry(22, 16, 0.2), "floor-wood.jpg");
                this.cube.position.y = 2;
                this.scene.add(this.cube);


                // position and point the camera to the center of the scene
                this.camera.position.x = 0;
                this.camera.position.y = 1;
                this.camera.position.z = 28;
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));

                var ambiLight = new THREE.AmbientLight(0x141414);
                this.scene.add(ambiLight);

                var light = new THREE.DirectionalLight();
                light.position.set(0, 30, 20);
                this.scene.add(light);

                // add the output of the renderer to the html element
                document.getElementById("WebGL-output").appendChild(this.webGLRenderer.domElement);

                // call the render function
                var step = 0;

//        var polyhedron = createMesh(new THREE.PolyhedronGeometry(vertices, faces, controls.radius, controls.detail));

                // setup the control gui
                this.controls = new function () {

                    this.showVideo = false;
                    this.rotate = false;

                    this.showCanvas = function () {
                        if (controls.showVideo) {
                            $('#video').show();
                        } else {
                            $('#video').hide();
                        }
                    }

                };


                // var gui = new this.dat.GUI();
                // gui.add(controls, "rotate");
                // gui.add(controls, "showVideo").onChange(this.controls.showCanvas);


                this.render();
            },
        },

        mounted: function () {
            this.init();
        },
        updated: function () {
        },
        beforeDestroy: function () {
        },
        destroyed: function () {
        }
    }
</script>

<style scoped>
    .threejs-container {
        width: 100%;
        float: left;
    }

    #demo {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
