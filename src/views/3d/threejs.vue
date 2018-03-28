<template>
    <section class="threejs-container">
        <div id="demo"></div>
    </section>
</template>

<script>
    import THREE from '../../assets/libs/three.js'

    export default {
        data() {
            return {
                scene: '',
                camera: '',
                renderer: '',
                geometry: '',
                material: '',
                mesh: ''
            }
        },

        methods: {
            init() {

                this.scene = new THREE.Scene();

                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
                this.camera.position.z = 1000;

                this.geometry = new THREE.BoxGeometry(200, 200, 200);
                this.material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.scene.add(this.mesh);

                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setSize(window.innerWidth, window.innerHeight);

                document.getElementById("demo").appendChild(this.renderer.domElement);
            },

            animate() {

                requestAnimationFrame(this.animate);

                this.mesh.rotation.x += 0.01;
                this.mesh.rotation.y += 0.02;

                this.renderer.render(this.scene, this.camera);

            }
        },

        mounted: function () {
            this.init();
            this.animate();
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
