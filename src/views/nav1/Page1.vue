<template>
    <section>
        <!--工具条-->
        <el-form ref="form" :model="form" @submit.prevent="onSubmit" style="margin:10px;">
            <el-form :inline="true" :model="filters" class="demo-form-inline">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" style="margin-left: 12px;">
                        <el-form-item label="维护项名称">
                            <el-input v-model="filters.strTitle" placeholder="维护项名称" style="width: 160px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10">
                        <el-form-item label="维护内容">
                            <el-input v-model="filters.strContent" placeholder="维护内容" style="width: 180px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
                        <el-form-item label-width="80px" label="创建时间" class="postInfo-container-item">
                            <el-date-picker
                                    v-model="filters.cTime"
                                    type="datetimerange"
                                    :picker-options="pickerOptions2"
                                    placeholder="选择时间范围"
                                    align="right">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
                        <el-form-item label-width="80px" label="更新时间" class="postInfo-container-item">
                            <el-date-picker
                                    v-model="filters.uTime"
                                    type="datetimerange"
                                    :picker-options="pickerOptions2"
                                    placeholder="选择时间范围"
                                    align="right">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" style="margin-left: 12px;">
                        <el-form-item>
                            <el-button type="primary" v-on:click="getMaintains" icon="search">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-form>

        <div class="panel">
            <div class="panel-title">
                <span v-text="panelTitle"></span>
                <div class="fr">
                    <el-button @click.stop="on_refresh" size="small">
                        <i class="fa fa-refresh"></i>
                    </el-button>
                    <el-button type="primary" @click="handleAdd" icon="plus" size="small">新增</el-button>
                </div>
            </div>
            <div class="panel-body">
                <!--列表-->
                <el-table :data="maintains" highlight-current-row v-loading="listLoading"
                          @selection-change="selsChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="strMaintainId" label="维护项ID">
                    </el-table-column>
                    <el-table-column prop="strTitle" label="维护项名称">
                    </el-table-column>
                    <el-table-column prop="strContent" label="维护内容">
                    </el-table-column>
                    <el-table-column prop="cTime" label="创建时间">
                    </el-table-column>
                    <el-table-column prop="uTime" label="更新时间">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" class="fl">批量删除
                    </el-button>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.curPage" :page-sizes="[10,20,30, 50]"
                                   :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="total" class="fr">
                    </el-pagination>
                </el-col>
            </div>
        </div>

        <!--编辑界面-->
        <el-dialog title="编辑维护项" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="维护项名称" prop="strTitle" style="width: 450px;">
                    <el-input v-model="editForm.strTitle" placeholder="请输入名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="维护内容" prop="strContent" style="width: 450px;">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="editForm.strContent">
                    </el-input>
                </el-form-item>
                <el-form-item label="图标" prop="strPath" style="width: 450px;">
                    <el-select v-model="editForm.strPath" placeholder="请选择">
                        <el-option
                                v-for="item in icons"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <img style="float: right; width: 20px; height: 20px;" :src="item.value"></img>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增维护项" v-model="addFormVisible" :close-on-click-modal="false" size="small">
            <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addFormRules">
                <!--<el-row :gutter="2">-->
                <!--<el-col :xs="8" :sm="6" :md="5" :lg="5">-->
                <el-form-item label="维护项名称" prop="strTitle" style="width: 450px;">
                    <el-input v-model="addForm.strTitle" placeholder="请输入名称" auto-complete="off"></el-input>
                </el-form-item>
                <!--</el-col>-->
                <!--</el-row>-->
                <el-form-item label="维护内容" prop="strContent" style="width: 450px;">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="addForm.strContent">
                    </el-input>
                </el-form-item>
                <el-form-item label="图标" prop="strPath" style="width: 450px;">
                    <el-select v-model="addForm.strPath" placeholder="请选择">
                        <el-option
                                v-for="item in icons"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <img style="float: right; width: 20px; height: 20px;" :src="item.value"></img>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import * as base from '../../api/urlConfig'
    //import NProgress from 'nprogress'
    import {getMaintainListPage, removeMaintain, batchRemoveMaintain, editMaintain, addMaintain} from '../../api/api';

    export default {
        data() {
            return {
                myBackToTopStyle: {
                    right: '50px',
                    bottom: '50px',
                    width: '40px',
                    height: '40px',
                    'border-radius': '4px',
                    'line-height': '45px', // 请保持与高度一致以垂直居中
                    background: '#e7eaf1'// 按钮的背景颜色
                },
                filters: {
                    strTitle: '',
                    strContent: '',
                    cTime: '',
                    uTime: '',
                },
                panelTitle: '维护项列表',
                pickerOptions1: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                icons: [{
                    value: 'http://ico.58pic.com/iconset01/devices-icons/gif/117838.gif',
                    label: '电池'
                }, {
                    value: 'http://ico.58pic.com/iconset01/Windows7-icons/gif/123603.gif',
                    label: '电源'
                }, {
                    value: 'http://ico.58pic.com/iconset01/Container-icon/gif/83681.gif',
                    label: 'ups'
                }],
                maintains: [],
                plans: [],
                total_plan: 0,
                total: 0,
                listLoading: false,
                sels: [],//列表选中列

                form: {
                    strTitle: '',
                    strContent: '',
                    cTime: '',
                    uTime: ''
                },

                listQuery: {
                    curPage: 1,
                    limit: 20,
                    pageSize: 10,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: '+id'
                },

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    strTitle: [
                        {required: true, message: '请输入维护项名称', trigger: 'blur'}
                    ],
                    strContent: [
                        {required: true, message: '请输入维护内容', trigger: 'blur'}
                    ],
                    strPath: [
                        {required: true, message: '请选择图标', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    strMaintainId: 0,
                    strTitle: '',
                    strContent: '',
                    strPath: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    strTitle: [
                        {required: true, message: '请输入维护项名称', trigger: 'blur'}
                    ],
                    strContent: [
                        {required: true, message: '请输入维护内容', trigger: 'blur'}
                    ],
                    strPath: [
                        {required: true, message: '请选择图标', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    strTitle: '',
                    strContent: '',
                    strPath: ''
                }

            }
        },
        methods: {
            //状态显示转换
            formatState: function (row, column) {
                return row.state == 0 ? '未启用' : row.state == 1 ? '已启用' : '未知';
            },
            //操作分页
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getMaintains();
            },
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getMaintains();
            },
            //刷新
            on_refresh(){
                this.getMaintains();
            },
            //获取维护项列表
            getMaintains() {
                let _this = this;
                _this.maintains = [];

                let para = {
                    pageNo: _this.listQuery.curPage,
                    pageSize: _this.listQuery.pageSize,
                    strOrder: 'CreateTime DESC',
                    strTitle: _this.filters.strTitle,
                    strContent: _this.filters.strContent,
                    cTime: _this.filters.cTime[0] && _this.filters.cTime[1] ? util.formatDate.formatDate(_this.filters.cTime[0]) +  ',' + util.formatDate.formatDate(_this.filters.cTime[1]) : '',
                    uTime: _this.filters.uTime[0] && _this.filters.uTime[1] ? util.formatDate.formatDate(_this.filters.uTime[0]) + ',' + util.formatDate.formatDate(_this.filters.uTime[1]) : ''
                };
                _this.listLoading = true;

                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: base.baseUrl + "/MaintainService.svc/GetMaintainItems",
                    success: function (res) {
                        let index1 = res.indexOf("]");
                        let maintains = JSON.parse(res.substr(0, index1 + 1));
                        let totalStr = res.substr(index1 + 2, res.length - 1);
                        let index2 = totalStr.indexOf(":");
                        totalStr = totalStr.substr(index2 + 2, totalStr.length - index2 - 3)
                        _this.total = parseInt(totalStr);

                        if (maintains.length > 0) {
                            for (let maintain of maintains) {
                                let item = {
                                    strMaintainId: '',
                                    strTitle: '',
                                    strContent: '',
                                    cTime: '',
                                    uTime: ''
                                };
                                item.strMaintainId = maintain.MaintainId;
                                item.strTitle = maintain.MaintainTitle;
                                item.strContent = maintain.MaintainContent;
                                item.cTime = maintain.CreateTime;
                                item.uTime = maintain.UpdateTime;
                                item.strPath = maintain.ImagePath;
                                _this.maintains.push(item);
                            }
                        }
                    }
                });
                setTimeout(() => {
                    _this.listLoading = false;
                }, 1000);
            },
            deleteSuccess: function (res, status) {
                let data = JSON.parse(res);

                if (data.result === true) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '删除失败',
                        type: 'success'
                    });
                }
                this.listLoading = false;
                this.getMaintains();
            },
            //获取维护计划列表
            getPlans(maintainId) {
                let _this = this;
                _this.plans = [];

                let para = {
                    maintainId: maintainId,
                };

                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: base.baseUrl + "/MaintainService.svc/GetMaintainPlan",
                    success: function (res) {
                        let index1 = res.indexOf("]");
                        let plans = JSON.parse(res.substr(0, index1 + 1));

                        let totalStr = res.substr(index1 + 2, res.length - 1);
                        let index2 = totalStr.indexOf(":");
                        totalStr = totalStr.substr(index2 + 2, totalStr.length - index2 - 3)
                        _this.total_plan = parseInt(totalStr);
                        console.log("plans _this.total: " + JSON.stringify(_this.total));
                        if(_this.total_plan > 0){
                            _this.$confirm('该维护项正在被使用，不能删除！', '提示', {
                                type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                        }else {
                            _this.$confirm('确认删除该记录吗?', '提示', {
                                type: 'warning'
                            }).then(() => {
                                _this.listLoading = true;
                                //NProgress.start();
                                let para = {strMaintainId: maintainId};
                                $.ajax({
                                    async: true,
                                    type: 'GET',
                                    jsonp: 'jsoncallback',
                                    data: para,
                                    url: base.baseUrl + "/MaintainService.svc/DelMaintainItem",
                                    success: _this.deleteSuccess,
                                    dataType: 'jsonp'
                                });
                            }).catch(() => {

                            });
                        }
                    }
                });
            },
            //删除
            handleDel: function (index, row) {
                this.getPlans(row.strMaintainId);
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    strTitle: '',
                    strContent: ''
                };
            },
            editSuccess: function (res, status) {
                let data = JSON.parse(res);

                if (data.result === true) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '修改失败',
                        type: 'success'
                    });
                }
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.editLoading = false;
                this.getMaintains();
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            $.ajax({
                                async: true,
                                type: 'GET',
                                jsonp: 'jsoncallback',
                                data: para,
                                url: base.baseUrl + "/MaintainService.svc/UpdMaintainItem",
                                success: this.editSuccess,
                                dataType: 'jsonp'
                            });
                        });
                    }
                });
            },
            addSuccess: function (res, status) {
                let data = JSON.parse(res);

                if (data.result === true) {
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '新增失败',
                        type: 'success'
                    });
                }
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.addLoading = false;
                this.getMaintains();
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            $.ajax({
                                async: true,
                                type: 'GET',
                                jsonp: 'jsoncallback',
                                data: para,
                                url: base.baseUrl + "/MaintainService.svc/AddMaintainItem",
                                success: this.addSuccess,
                                dataType: 'jsonp'
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.strMaintainId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {strMaintainId: ids};
                    $.ajax({
                        async: true,
                        type: 'GET',
                        jsonp: 'jsoncallback',
                        data: para,
                        url: base.baseUrl + "/MaintainService.svc/DelMaintainItem",
                        success: this.deleteSuccess,
                        dataType: 'jsonp'
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getMaintains();
        }
    }

</script>

<style scoped>

    .toolbar {
        background-color: #f8f8f8 !important;
    }

</style>