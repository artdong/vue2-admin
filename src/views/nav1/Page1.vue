<template>
    <section>
        <!--工具条-->
        <el-form ref="form" :model="form" @submit.prevent="onSubmit" style="margin:10px;">
            <el-form :model="filters">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label-width="80px" label="执行时间" class="postInfo-container-item">
                            <el-date-picker
                                    v-model="filters.executeTime"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions1">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="天数">
                            <el-select v-model="filters.cycleDay" multiple placeholder="请选择">
                                <el-option
                                        v-for="item in cycleDays"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="margin-left: 20px;">
                        <el-form-item label="是否周期性:">
                            <el-radio-group v-model="filters.isCycle">
                                <el-radio class="radio" :label="1">是</el-radio>
                                <el-radio class="radio" :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item style="margin-left: 10px;">
                            <el-button type="primary" v-on:click="getPlans" icon="search">查询</el-button>
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
                <el-table :data="plans" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column type="index" label="维护项ID" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="executeTime" label="执行时间" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="isCycle" label="是否周期性" width="130" align: center :formatter="formatCycle">
                    </el-table-column>
                    <el-table-column prop="cycleDay" label="天">
                    </el-table-column>
                    <el-table-column prop="executeHour" label="时">
                    </el-table-column>
                    <el-table-column prop="executeMinute" label="分">
                    </el-table-column>
                    <el-table-column prop="description" label="描述">
                    </el-table-column>
                    <!-- <el-table-column type="index" label="设备类型ID" style="text-align: center" sortable>
                    </el-table-column>
                    <el-table-column type="index" label="设备ID" style="text-align: center" sortable>
                    </el-table-column> -->
                    <el-table-column prop="strTitle" label="维护项" width="120">
                    </el-table-column>
                    <el-table-column prop="strContent" label="维护内容" width="120">
                    </el-table-column>
                    <el-table-column prop="cStartTime" label="创建时间" width="120">
                    </el-table-column>
                    <!-- <el-table-column prop="cEndTime" label="创建截止时间" sortable>
                    </el-table-column> -->
                    <el-table-column prop="uStartTime" label="更新时间" width="120">
                    </el-table-column>
                    <!-- <el-table-column prop="uEndTime" label="更新截止时间" sortable>
                    </el-table-column> -->
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" class="fl">批量删除</el-button>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="fr">
                    </el-pagination>
                </el-col>
            </div>
        </div>

        <!--编辑界面-->
        <el-dialog title="编辑维护计划" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="strTitle">
                    <el-input v-model="editForm.strTitle" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="维护内容" prop="strContent">
                    <el-input v-model="editForm.strContent" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增维护计划" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" label-width="80px" :rules="addFormRules">
                <el-form-item label="名称" prop="strTitle">
                    <el-input v-model="addForm.strTitle" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="维护内容" prop="strContent">
                    <el-input v-model="addForm.strContent" auto-complete="off"></el-input>
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
    //import NProgress from 'nprogress'
    import { getPlanListPage, removePlan, batchRemovePlan, editPlan, addPlan } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    executeTime: '',
                    isCycle: 1,
                    cycleDay: []
                },
                panelTitle: '维护计划列表',
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
                cycleDays: [{
                    value: '1',
                    label: '1天'
                }, {
                    value: '2',
                    label: '2天'
                },],
                plans: [],
                total: 0,
                hello: true,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                form: {
                    strTitle: '',
                    strContent: '',
                    cStartTime: '',
                    cEndTime: '',
                    uStartTime: '',
                    uEndTime: ''
                },

                listQuery: {
                    currPage: 1,
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
                        { required: true, message: '请输入维护项名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    strPlanId: 0,
                    strTitle: '',
                    strContent: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    strTitle: [
                        { required: true, message: '请输入维护项名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    strTitle: '',
                    strContent: ''
                }

            }
        },
        methods: {
            //状态显示转换
            formatCycle: function (row, column) {
                return row.isCycle == 0 ? '否' : row.isCycle == 1 ? '是' : '未知';
            },
            //操作分页
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getPlans();
            },
            handleCurrentChange(val) {
                this.listQuery.currPage = val;
                this.getPlans();
            },
            //刷新
            on_refresh(){
                this.getPlans();
            },
            //获取维护计划列表
            getPlans() {
                let params = {
                    currPage: this.listQuery.currPage,
                    pageSize: this.listQuery.pageSize,
                    executeTime: this.filters.executeTime,
                    isCycle: this.filters.isCycle
                };
                this.listLoading = true;
                //NProgress.start();
                getPlanListPage(params).then((res) => {
                    this.total = res.data.total;
                    this.plans = res.data.plans;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { strPlanId: row.strPlanId };
                    removePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPlans();
                    });
                }).catch(() => {

                });
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
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editPlan(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getPlans();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addPlan(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getPlans();
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
                var ids = this.sels.map(item => item.strPlanId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemovePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPlans();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getPlans();
        }
    }

</script>

<style scoped>

</style>