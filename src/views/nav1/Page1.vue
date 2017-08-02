<template>
	<section>
		<!--工具条-->
		<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:10px;width:60%;min-width:600px;">
			<el-row>
				<el-col :span="12">
					<el-form-item label="设备编号">
						<el-select v-model="form.region" placeholder="全部">
							<el-option label="全部" value="all"></el-option>
							<el-option label="蓄电池一" value="1"></el-option>
							<el-option label="蓄电池二" value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label-width="80px" label="开始时间">
						<el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="重复设置">
				<el-checkbox-group v-model="form.type">
					<el-checkbox label="一次" name="type"></el-checkbox>
					<el-checkbox label="每天" name="type"></el-checkbox>
					<el-checkbox label="每周" name="type"></el-checkbox>
					<el-checkbox label="每季" name="type"></el-checkbox>
					<el-checkbox label="每年" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item label="类型选择">
						<el-checkbox-group v-model="form.type">
							<el-checkbox label="充电" name="type"></el-checkbox>
							<el-checkbox label="放电" name="type"></el-checkbox>
							<el-checkbox label="内阻" name="type"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="启用状态">
						<el-checkbox-group v-model="form.type">
							<el-checkbox label="已启用" name="type"></el-checkbox>
							<el-checkbox label="未启用" name="type"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form :model="filters">
				<el-col :span="6">
				<el-form-item style="margin-left: 10px;">
					<el-input v-model="filters.deviceName" placeholder="设备名称"></el-input>
				</el-form-item>
				</el-col>
				<el-col :span="4">
				<el-form-item style="margin-left: 30px;">
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				</el-col>
				<el-col :span="2">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				</el-col>
			</el-form>
		</el-form>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="siteName" label="站点名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="deviceNo" label="设备号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="startTime" label="开始时间" width="120" sortable>
			</el-table-column>
			<el-table-column prop="repeat" label="重复设置" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="state" label="启用状态" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="type" label="类型" min-width="100" sortable>
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="站点名称" prop="siteName">
					<el-input v-model="editForm.siteName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备号">
					<el-input-number v-model="editForm.deviceNo" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"></el-date-picker>
				</el-form-item>
                <el-form-item label="重复设置">
                    <el-input type="textarea" v-model="editForm.repeat"></el-input>
                </el-form-item>
				<el-form-item label="启用状态">
					<el-input type="textarea" v-model="editForm.state"></el-input>
				</el-form-item>
                <el-form-item label="类型">
                    <el-input type="textarea" v-model="editForm.type"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<!-- <el-form-item label="站点名称" prop="siteName">
					<el-input v-model="addFornm.siteName" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="设备号">
					<el-input-number v-model="addForm.deviceNo" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="启用状态">
					<el-input type="textarea" v-model="addForm.state"></el-input>
				</el-form-item>
                <el-form-item label="类型">
                    <el-input type="textarea" v-model="addForm.type"></el-input>
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
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

    const calendarTypeOptions = [
        { key: 'CN', display_name: '中国' },
        { key: 'US', display_name: '美国' },
        { key: 'JP', display_name: '日本' },
        { key: 'EU', display_name: '欧元区' }
    ];

    // arr to obj
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.display_name;
        return acc
    }, {});

    export default {
        data() {
            return {
                filters: {
                    deviceName: ''
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                form: {
                    siteName: '',
                    deviceNo: -1,
                    startTime: '',
                    repeat: '',
                    state: '',
                    type: [],
                    desc: ''
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
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    siteName: '',
                    deviceNo: -1,
                    startTime: '',
                    repeat: '',
                    state: '',
                    type: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    siteName: '',
                    deviceNo: -1,
                    startTime: '',
                    repeat: '',
                    state: '',
                    type: ''
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {
                    page: this.page,
                    siteName: this.filters.siteName
                };
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.users;
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
                    let para = { id: row.id };
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
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
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
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
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
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
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
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
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>