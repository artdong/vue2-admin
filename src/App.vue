<template>
    <div id="app">
        <transition name="fade"
                    mode="out-in">
            <router-view></router-view>
        </transition>
        <a href="https://github.com/alex-0407/vue2-admin-grace">
            <img class="fork-me-github"
                 src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67"
                 alt="Fork me on GitHub"
                 data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
            >
        </a>
        <!--<div id="alipay-adv" class="alipay-adv" v-if="visible">-->
            <!--<img src="../static/img/alipay1.jpg">-->
            <!--<a class="close-adv" href="javascript:;" v-on:click="close()">关闭</a>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {},
        data() {
            return {
                visible: true
            }
        },
        methods: {
            close() {
                // document.getElementById("alipay-adv").style.display = "none";
                this.visible = false;
            }
        }
    }
</script>

<style lang="scss">
    body {
        margin: 0px;
        padding: 0px;
        /*background: url(assets/bg1.jpg) center !important;
            background-size: cover;*/
        // background: #1F2D3D;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
    }

    #app {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .toolbar {
        background: #f2f2f2;
        padding: 10px;
        //border:1px solid #dfe6ec;
        margin: 10px 0px;
        .el-form-item {
            margin-bottom: 10px;
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .2s ease;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .fork-me-github {
        position: absolute;
        top: 0;
        right: 0;
        border: 0;
    }

    .alipay-adv {
        position: fixed;
        right: 20px;
        bottom: 0;
        width: 300px;
        height: auto;
    }

    .alipay-adv img {
        width: 100%;
    }

    .close-adv {
        position: absolute;
        right: 8px;
        top: -15px;
        background: #fff;
        padding: 0 5px;
        font-size: 12px;
        cursor: pointer;
    }
</style>