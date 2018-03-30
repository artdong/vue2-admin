<template>
    <section class="babylonjs-container">
        <canvas id="renderCanvas"></canvas>
    </section>
</template>

<script>
    import * as BABYLON from 'babylonjs';

    export default {
        data() {
            return {
                scene: '',
                engine : '',
                canvas: ''
            }
        },

        methods: {
            // createScene function that creates and return the scene
            createScene() {
                // create a basic BJS Scene object
                this.scene = new BABYLON.Scene(this.engine);

                // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
                var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);

                // target the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());

                // attach the camera to the canvas
                camera.attachControl(this.canvas, false);

                // create a basic light, aiming 0,1,0 - meaning, to the sky
                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

                // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
                var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);

                // move the sphere upward 1/2 of its height
                sphere.position.y = 1;

                // create a built-in "ground" shape;
                var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene);

                // return the created scene
                return this.scene;
            },
            init() {
                let _this = this;
                // get the canvas DOM element
                _this.canvas = document.getElementById('renderCanvas');

                // load the 3D engine
                _this.engine = new BABYLON.Engine(this.canvas, true);

                // call the createScene function
                _this.scene = this.createScene();

                // run the render loop
                _this.engine.runRenderLoop(function () {
                    _this.scene.render();
                });

                // the canvas/window resize event handler
                window.addEventListener('resize', function () {
                    _this.engine.resize();
                });
            },
        },

        mounted: function () {
            this.init();
        }
        ,
        updated: function () {
        }
        ,
        beforeDestroy: function () {
        }
        ,
        destroyed: function () {
        }
    }
</script>

<style scoped>
    .babylonjs-container {
        width: 100%;
        float: left;
    }

    #renderCanvas {
        width: 100%;
        height: 100%;
        touch-action: none;
    }
</style>
