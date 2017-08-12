<template>
	<section>
		<!--工具条-->
		<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:10px;width:60%;min-width:600px;">
			<el-form :model="filters">
				<el-col :span="6">
					<el-form-item style="margin-left: 10px;">
						<el-input v-model="filters.strTitle" placeholder="维护项"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<el-form-item style="margin-left: 30px;">
						<el-button type="primary" v-on:click="getMaintains">查询</el-button>
					</el-form-item>
				</el-col>
				<el-col :span="2" style="margin-left: 20px;">
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-form>

		<!--列表-->
		<el-table :data="maintains" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="strTitle" label="维护项" width="120" style="text-align: center" sortable>
			</el-table-column>
			<el-table-column prop="strContent" label="维护内容" width="120" style="text-align: center" sortable>
			</el-table-column>
			<el-table-column prop="cStartTime" label="创建开始时间">
			</el-table-column>
			<el-table-column prop="cEndTime" label="创建截止时间">
			</el-table-column>
			<el-table-column prop="uStartTime" label="更新开始时间">
			</el-table-column>
			<el-table-column prop="uEndTime" label="更新截止时间">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑维护项" v-model="editFormVisible" :close-on-click-modal="false">
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
		<el-dialog title="新增维护项" v-model="addFormVisible" :close-on-click-modal="false">
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
    import { getMaintainListPage, removeMaintain, batchRemoveMaintain, editMaintain, addMaintain } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    strTitle: ''
                },
                maintains: [],
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
                    page: 1,
                    limit: 20,
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
                    strMaintainId: 0,
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
            formatState: function (row, column) {
                return row.state == 0 ? '未启用' : row.state == 1 ? '已启用' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getMaintains();
            },
            //获取维护项列表
            getMaintains() {
                let para = {
                    page: this.page,
                    strTitle: this.filters.strTitle
                };
                this.listLoading = true;
                //NProgress.start();
                getMaintainListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.maintains = res.data.maintains;
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
                    let para = { strMaintainId: row.strMaintainId };
                    removeMaintain(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMaintains();
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
                            editMaintain(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getMaintains();
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
                            addMaintain(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getMaintains();
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
                    let para = { ids: ids };
                    batchRemoveMaintain(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMaintains();
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

</style>