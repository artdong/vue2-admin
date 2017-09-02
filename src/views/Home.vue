<template>
    <el-row class="container">
        <el-col :span="24" class="main">
            <aside id="menu" :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                         @close="handleclose" @select="handleselect"
                         unique-opened router v-if="!collapsed">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                            <el-menu-item class="menu-list" v-for="child in item.children" :index="child.path"
                                          :key="child.path" v-if="!child.hidden">{{child.name}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item class="menu-list" v-if="item.leaf&&item.children.length>0"
                                      :index="item.children[0].path"><i
                                :class="item.iconCls"></i>{{item.children[0].name}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul id="el-menu" class="el-menu el-menu-vertical-demo collapsed" v-if="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                                 @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                                    class="el-menu-item" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                    <li class="el-submenu">
                        <div class="el-submenu__title el-menu-item"
                             style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                             :class="$route.path==item.children[0].path?'is-active':''"
                             @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                    </li>
</template>
</li>
</ul>
</aside>
<section class="content-container">
    <el-col :span="24" class="header">
        <el-col :xs="2" :sm="2" :md="2" :lg="2">
            <div class="tools" @click.prevent="collapse" style="margin-bottom: 64px;">
                <i class="fa fa-align-justify" style="vertical-align:middle; color: #353f4f;"></i>
            </div>
        </el-col>
        <el-col :xs="15" :sm="15" :md="15" :lg="17" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
        </el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2">
            <i class="fa fa-bell fa-lg" style="color: #353f4f" @click="dialogVisible = true"></i>
            <el-badge :value="total" :max="10">
            </el-badge>
        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1">
            <screenfull class="screenfull"></screenfull>
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="2" class="userinfo">
            <el-dropdown trigger="hover">
                <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar"/> {{sysUserName}}</span>
                <el-dropdown-menu slot="dropdown">
                    <router-link class='inlineBlock' to="/" style="text-decoration:none; color: black;">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                    <a target='_blank' href="https://alex-0407.github.io/vue2-admin-grace/"
                       style="text-decoration:none; color: black;">
                        <el-dropdown-item>
                            演示地址
                        </el-dropdown-item>
                    </a>
                    <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-col>
    <div class="grid-content bg-purple-light">
        <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </el-col>
    </div>
    <el-dialog
            title="我的任务"
            size="small"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false">
        <!--列表-->
        <el-table :data="reminds" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="RemindMsg" label="提示消息">
            </el-table-column>
            <el-table-column prop="PlanExeTime" label="过期时间">
            </el-table-column>
            <el-table-column prop="Description" label="计划描述">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleConfirm(scope.$index, scope.row)">确认</el-button>
                    <el-dropdown style="margin-left: 5px;" v-show="false">
									 <span class="el-dropdown-link">
										 延迟<i class="el-icon-caret-bottom el-icon--right"></i>
									 </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>5分钟</el-dropdown-item>
                            <el-dropdown-item>10分钟</el-dropdown-item>
                            <el-dropdown-item>15分钟</el-dropdown-item>
                            <el-dropdown-item>20分钟</el-dropdown-item>
                            <el-dropdown-item divided>30分钟</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!--<el-button type="danger" size="small" @click="handleDelay(scope.$index, scope.row)">延迟</el-button>-->
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchConfirm" :disabled="this.sels.length===0" class="fl">批量确认</el-button>
            <el-pagination :total="total" layout="total" class="fr">
            </el-pagination>
        </el-col>
    </el-dialog>
</section>
</el-col>
</el-row>
</template>

<script>
    import Screenfull from '../components/Screenfull';
    import {
        getMaintainListPage,
        removeMaintain,
        batchRemoveMaintain,
        getRemindInfoListPage,
        confirmRemind,
        removeRemind
    } from '../api/api';

    export default {
        components: {
            Screenfull
        },
        data() {
            return {
                sysName: 'CRIANE蓄电池远程监控系统',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                dialogVisible: false,
                hasRemindInfo: false,
                reminds: [],
                total: 0,
                listLoading: false,
                sels: [],//列表选中列
                form: {
                    PlanId: '',
                    RemindId: '',
                    PlanExeTime: '',
                    Description: '',
                    RemindMsg: '',
                    DiffDays: '',
                    MaintainTitle: '',
                    MaintainContent: ''
                },
                listQuery: {
                    curPage: 1,
                    limit: 20,
                    pageSize: 10,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: '+id'
                }
            }
        },
        methods: {
            handleopen: function () {
                //
            },
            handleselect: function () {
                //
            },
            handleclose: function () {
                //
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('user');
                    _this.$router.push('/login');
                }).catch(() => {

                });


            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status){
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            },
            //获取计划执行的提示信息
//            getRemindInfo() {
//                let para = {
//                };
//                //NProgress.start();
//                this.reminds = [];
//                this.total = 0;
//                this.hasRemindInfo = false;
//                getRemindInfoListPage(para).then((res) => {
//                    let data = res.data.d;
//                    let index1 = data.indexOf("]");
//                    let reminds = JSON.parse(data.substr(0, index1 + 1));
//
//                    if (reminds.length > 0) {
//                        this.total = reminds.length;
//                        this.hasRemindInfo = true;
//                        this.reminds = [];
//                        for (let remind of reminds) {
//                            let item = {
//                                PlanId: '',
//                                RemindId: '',
//                                PlanExeTime: '',
//                                Description: '',
//                                RemindMsg: '',
//                                DiffDays: '',
//                                MaintainTitle: '',
//                                MaintainContent: ''
//                            };
//                            item.PlanId = remind.PlanId;
//                            item.RemindId = remind.RemindId;
//                            item.RemindMsg = remind.RemindMsg;
//                            item.PlanExeTime = remind.PlanExeTime;
//                            item.Description = remind.Description;
//                            item.DiffDays = remind.DiffDays;
//                            item.MaintainTitle = remind.MaintainTitle;
//                            item.MaintainContent = remind.MaintainContent;
//                            this.reminds.push(item);
//                        }
//                    }
//                    //NProgress.done();
//                });
//            },
            getRemindInfo() {
                jQuery.ajax({
                    async: false,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    timeout: 2000,
                    url: "http://10.169.42.142:8080/service/MaintainService.svc/GetRemindInfo",
                    success: function (res) {
                        let reminds = JSON.parse(res);

                        if (reminds.length > 0) {
                            this.total = reminds.length;
                            this.hasRemindInfo = true;
                            this.reminds = [];
                            for (let remind of reminds) {
                                let item = {
                                    PlanId: '',
                                    RemindId: '',
                                    PlanExeTime: '',
                                    Description: '',
                                    RemindMsg: '',
                                    DiffDays: '',
                                    MaintainTitle: '',
                                    MaintainContent: ''
                                };
                                item.PlanId = remind.PlanId;
                                item.RemindId = remind.RemindId;
                                item.RemindMsg = remind.RemindMsg;
                                item.PlanExeTime = remind.PlanExeTime;
                                item.Description = remind.Description;
                                item.DiffDays = remind.DiffDays;
                                item.MaintainTitle = remind.MaintainTitle;
                                item.MaintainContent = remind.MaintainContent;
                                this.reminds.push(item);
                            }
                        }
                    }
                });
            },
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getMaintains();
            },
            //延迟
            handleDelay: function (index, row) {
                //
            },
            //确认
            handleConfirm: function (index, row) {
                let para = {
                    strRemindId: row.RemindId,
                    strConfirmType: 1,
                    strConfirmUser: 'alex'
                };
                confirmRemind(para).then((res) => {
                    this.listLoading = true;
                    //NProgress.done();
                    let data = {};
                    //NProgress.done();
                    if (data) {
                        data = JSON.parse(res.data.d);
                    }
                    if (data.result === true) {
                        this.$message({
                            message: '确认成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: '确认失败',
                            type: 'success'
                        });
                    }
                    this.listLoading = false;
                    this.getRemindInfo();
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //操作分页
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getRemindInfo();
            },
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getRemindInfo();
            },
            //批量确认
            batchConfirm: function () {
                var ids = this.sels.map(item => item.RemindId).toString();
                this.$confirm('确定要确认选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {
                        strRemindId: ids,
                        strConfirmType: 1,
                        strConfirmUser: 'alex'
                    };
                    confirmRemind(para).then((res) => {
                        this.listLoading = true;
                        //NProgress.done();
                        let data = {};
                        //NProgress.done();
                        if (data) {
                            data = JSON.parse(res.data.d);
                        }
                        if (data.result === true) {
                            this.$message({
                                message: '确认成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '确认失败',
                                type: 'success'
                            });
                        }
                        this.listLoading = false;
                        this.getRemindInfo();
                    });
                }).catch(() => {
                });
            }
        },
        mounted() {
            var loginUser =
                {
                    avatar: 'https://avatars1.githubusercontent.com/u/16631463?v=4&s=460',
                    name: 'Alex'
                };
            sessionStorage.setItem('user', JSON.stringify(loginUser));
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.name || '';
                this.sysUserAvatar = user.avatar || '';
            }
        },
        beforeMount() {
            //设置定时器，每3秒刷新一次
            var self = this;

            window.setInterval(function () {
                self.getRemindInfo();

                setTimeout(() => {
                    if(this.hasRemindInfo) {
                        this.dialogVisible = true;
                    }else{
                        this.dialogVisible = false;
                    }
                }, 8000);
            }, 6000);

//            window.setInterval(function () {
//                self.getRemindInfo();

//                jQuery.ajax({
//                    async: false,
//                    type: 'GET',
//                    dataType: 'jsonp',
//                    jsonp: 'jsoncallback',
//                    timeout: 5000,
//                    url: "http://10.169.42.142:8080/service/MaintainService.svc/GetRemindInfo",
//                    success: function (res) {
//                        let reminds = JSON.parse(res);
//
//                        if (reminds.length > 0) {
//                            self.total = reminds.length;
//                            self.hasRemindInfo = true;
//                            self.reminds = [];
//                            for (let remind of reminds) {
//                                let item = {
//                                    PlanId: '',
//                                    RemindId: '',
//                                    PlanExeTime: '',
//                                    Description: '',
//                                    RemindMsg: '',
//                                    DiffDays: '',
//                                    MaintainTitle: '',
//                                    MaintainContent: ''
//                                };
//                                item.PlanId = remind.PlanId;
//                                item.RemindId = remind.RemindId;
//                                item.RemindMsg = remind.RemindMsg;
//                                item.PlanExeTime = remind.PlanExeTime;
//                                item.Description = remind.Description;
//                                item.DiffDays = remind.DiffDays;
//                                item.MaintainTitle = remind.MaintainTitle;
//                                item.MaintainContent = remind.MaintainContent;
//                                self.reminds.push(item);
//                            }
//                        }
//                    }
//                });
//                setTimeout(() => {
//                    if(self.hasRemindInfo) {
//                        self.dialogVisible = true;
//                    }else{
//                        self.dialogVisible = false;
//                    }
//                }, 1000);
//            }, 3000);
        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        height: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: #eef1f6;
            color: #fff;
            border-left: 1px solid white;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: black;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 0px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 350px;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
            .screenfull {
                vertical-align: middle;
                height: 60px;
                color: red;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 0px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }
                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
            }
            .el-menu-item {
                min-width: 60px;
                &.is-active {
                    background-color: #353f4f !important;
                    border-right: 4px solid $color-primary;
                    color: $color-primary;
                }
            }
            .menu-list {
                height: 45px;
                line-height: 45px;
                &.is-active {
                    background-color: #353f4f !important;
                    border-right: 4px solid $color-primary;
                    color: $color-primary;
                }
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                //padding: 20px;
                .breadcrumb-container {
                    //margin-bottom: 15px;
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }
                    .breadcrumb-inner {
                        float: right;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                    margin-top: 10px;
                }
            }
        }
    }

    .hand {
        cursor: pointer;
    }

    @media screen and (max-width: 1200px) {
        //
    }
</style>