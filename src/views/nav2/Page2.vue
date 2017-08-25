<template>
    <section>
        <!--工具条-->
        <el-collapse v-model="activeNames">
            <el-collapse-item title="查询条件" name="1">
                <el-form ref="form" :model="form" @submit.prevent="onSubmit" style="margin:10px;">
                    <el-form :model="filters">
                        <el-row>
                            <el-col :xs="12" :sm="12" :md="12" :lg="5" style="margin-left: 12px;">
                                <el-form-item>
                                    <el-input v-model="filters.planId" placeholder="计划ID"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="10" :sm="10" :md="10" :lg="5">
                                <el-form-item>
                                    <el-input v-model="filters.maintainId" placeholder="设备类型ID"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12" :md="12" :lg="5" style="margin-left: 12px;">
                                <el-form-item>
                                    <el-input v-model="filters.equipmentCategory" placeholder="设备ID"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="10" :sm="10" :md="10" :lg="5">
                                <el-form-item>
                                    <el-input v-model="filters.equipmentId" placeholder="维护项ID"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12" :md="12" :lg="14">
                                <el-form-item label-width="80px" label="执行时间" class="postInfo-container-item">
                                    <el-date-picker
                                            v-model="filters.executeTime"
                                            type="datetimerange"
                                            :picker-options="pickerOptions2"
                                            placeholder="选择时间范围"
                                            align="right">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="10" :sm="10" :md="10" :lg="6" style="margin-left: 20px;">
                                <el-form-item label="是否周期性:">
                                    <el-radio-group v-model="filters.isCycle">
                                        <el-radio class="radio" :label="true">是</el-radio>
                                        <el-radio class="radio" :label="false">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12" :md="12" :lg="8" v-if="filters.isCycle" style="margin-left: 12px;">
                                <el-form-item label="执行周期(天)">
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
                            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                                <el-form-item style="margin-left: 10px;">
                                    <el-button type="primary" v-on:click="getPlans" icon="search">查询</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-form>
            </el-collapse-item>
        </el-collapse>

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
                    <el-table-column prop="planId" label="计划ID" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="maintainId" label="维护项ID" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="executeTime" label="执行时间" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="isCycle" label="是否周期性" width="120" :formatter="formatCycle">
                    </el-table-column>
                    <el-table-column prop="cycleDay" label="天" width="100">
                    </el-table-column>
                    <el-table-column prop="description" label="描述">
                    </el-table-column>
                    <!--<el-table-column prop="equipmentCategory" label="设备类型ID" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="equipmentId" label="设备ID" sortable>-->
                    <!--</el-table-column>-->
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" class="fl">批量删除</el-button>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.curPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="fr">
                    </el-pagination>
                </el-col>
            </div>
        </div>

        <!--编辑界面-->
        <el-dialog title="编辑维护计划" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="计划ID" prop="planId" style="width: 292px;">
                    <el-input v-model="editForm.planId" placeholder="请输入计划ID" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="维护项ID" prop="maintainId" style="width: 292px;">
                    <el-input v-model="editForm.maintainId" placeholder="请输入维护项ID" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行时间" prop="executeTime">
                    <el-date-picker
                            v-model="editForm.executeTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否周期性" prop="isCycle">
                    <el-radio-group v-model="editForm.isCycle">
                        <el-radio class="radio" :label="true">是</el-radio>
                        <el-radio class="radio" :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="执行周期(天)" prop="cycleDay"  v-if="editForm.isCycle">
                    <el-input-number v-model="editForm.cycleDay" @change="handleChange" :min="1"
                                     :max="30"></el-input-number>
                </el-form-item>
                <el-form-item label="计划描述" prop="description" style="width: 450px;">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="editForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="equipmentCategory">
                    <el-transfer v-model="editForm.equipmentCategory" :data="categorySource" :titles="categoryTitles"></el-transfer>
                </el-form-item>
                <el-form-item label="设备" prop="equipmentId">
                    <el-transfer v-model="editForm.equipmentId" :data="equipmentSource" :titles="equipmentTitles"></el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增维护计划" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addFormRules">
                <!--<el-form-item label="维护项ID" prop="maintainId" style="width: 292px;">-->
                    <!--<el-input v-model="addForm.maintainId" placeholder="请输入维护项ID" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="维护项" prop="maintainId">
                    <el-select v-model="addForm.maintainId" placeholder="请选择维护项">
                        <el-option v-for="item in maintains" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="执行时间" prop="executeTime">
                    <el-date-picker
                            v-model="addForm.executeTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否周期性" prop="isCycle">
                    <el-radio-group v-model="addForm.isCycle">
                        <el-radio class="radio" :label="true">是</el-radio>
                        <el-radio class="radio" :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="执行周期(天)" prop="cycleDay" v-if="addForm.isCycle">
                    <el-input-number v-model="addForm.cycleDay" @change="handleChange" :min="1"
                                     :max="90"></el-input-number>
                </el-form-item>
                <el-form-item label="计划描述" prop="description" style="width: 450px;">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="addForm.description">
                    </el-input>
                </el-form-item>
                <!--<el-form-item label="设备类型ID" prop="equipmentCategory" style="width: 292px;">-->
                    <!--<el-input v-model="addForm.equipmentCategory" placeholder="请输入设备类型ID" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="设备类型" prop="equipmentCategory">
                    <el-transfer v-model="addForm.equipmentCategory" :data="categorySource" :titles="categoryTitles" @change="getEquipments(addForm.equipmentCategory)"></el-transfer>
                </el-form-item>
                <el-form-item label="设备" prop="equipmentId">
                    <el-transfer v-model="addForm.equipmentId" :data="equipmentSource" :titles="equipmentTitles"></el-transfer>
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
    import {getPlanListPage, removePlan, batchRemovePlan, editPlan, addPlan, getMaintainListPage, getEquipmentCategoryList, getEquipmentList, getMaintainEquipmentList} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    planId: '',
                    maintainId: '',
                    equipmentCategory: '',
                    equipmentId: '',
                    executeTime: '',
                    isCycle: false,
                    cycleDay: []
                },
                panelTitle: '维护计划列表',
                activeNames: ['1'],
                pickerOptions1: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '明天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周后',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
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
                cycleDays: [{
                    value: '1',
                    label: '1天'
                }, {
                    value: '2',
                    label: '2天'
                }],
                maintains: [],
                categorySource: [],
                equipmentSource: [],
                categoryTitles: ['设备类型','已选设备类型'],
                equipmentTitles: ['设备','已选设备'],
                plans: [],
                equipmentCategories: [],
                equipments: [],
                total: 0,
                listLoading: false,
                sels: [],//列表选中列

                form: {
                    planId: '',
                    maintainId: '',
                    createTime: '',
                    executeTime: '',
                    isCycle: '',
                    cycleDay: '',
                    description: '',
                    equipmentCategory: '',
                    equipmentId: ''
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
                    maintainId: [
                        {required: true, message: '请输入维护项ID', trigger: 'blur'}
                    ],
//                    executeTime: [
//                        {required: true, validator: this.checkExecuteTime, trigger: 'blur'}
//                    ],
                    equipmentCategory: [
                        {required: true, message: '请输入设备类型ID', trigger: 'blur'}
                    ],
                    equipmentId: [
                        {required: true, message: '请输入设备ID', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    planId: '',
                    maintainId: '',
                    createTime: '',
                    executeTime: '',
                    isCycle: false,
                    cycleDay: '',
                    description: '',
                    equipmentCategory: '',
                    equipmentId: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    maintainId: [
                        {required: true, message: '请输入维护项ID', trigger: 'blur'}
                    ],
//                    executeTime: [
//                        {required: true, validator: this.checkExecuteTime, trigger: 'blur'}
//                    ],
                    equipmentCategory: [
                        {required: true, message: '请选择设备类型', trigger: 'blur'}
                    ],
                    equipmentId: [
                        {required: true, message: '请输入设备ID', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    maintainId: '',
                    maintain: {},
                    createTime: '',
                    executeTime: '',
                    isCycle: false,
                    cycleDay: '',
                    description: '',
                    equipmentCategory: '',
                    equipmentId: ''
                }

            }
        },
        methods: {
            dateFormat (time, format) {
                var t = new Date(time);
                var tf = function (i) {
                    return (i < 10 ? '0' : '') + i
                };
                return this.dateFormat.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return tf(t.getFullYear());
                            break;
                        case 'MM':
                            return tf(t.getMonth() + 1);
                            break;
                        case 'mm':
                            return tf(t.getMinutes());
                            break;
                        case 'dd':
                            return tf(t.getDate());
                            break;
                        case 'HH':
                            return tf(t.getHours());
                            break;
                        case 'ss':
                            return tf(t.getSeconds());
                            break;
                    }
                })
            },
            checkExecuteTime: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('执行时间不能为空'));
                }
                setTimeout(() => {
                    const now = new Date();
                    if (this.dateFormat(value, 'yyyy-MM-dd HH:mm:ss') < this.dateFormat(now, 'yyyy-MM-dd HH:mm:ss')) {
                        callback(new Error('执行时间必须大于当前时间'));
                    } else {
                        callback();
                    }
                }, 500);
            },
            //状态显示转换
            formatCycle: function (row, column) {
                return row.isCycle === false ? '否' : row.isCycle === true ? '是' : '未知';
            },
            handleChange: function (value) {
                console.log(value);
            },
            //操作分页
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getPlans();
            },
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getPlans();
            },
            //刷新
            on_refresh(){
                this.getPlans();
            },
            //获取维护计划列表
            getPlans() {
                let para = {
//                    pageNo: this.listQuery.curPage,
//                    pageSize: this.listQuery.pageSize,
//                    executeTime: this.filters.executeTime,
//                    isCycle: this.filters.isCycle
                };
                this.listLoading = true;
                //NProgress.start();
                getPlanListPage(para).then((res) => {
                    let data = res.data.d;
                    let index1 = data.indexOf("]");
                    let plans = JSON.parse(data.substr(0, index1 + 1));

                    let totalStr = data.substr(index1 + 2, data.length - 1);
                    let index2 = totalStr.indexOf(":");
                    totalStr = totalStr.substr(index2 + 2, totalStr.length - index2 - 3)
                    this.total = parseInt(totalStr);

                    if (plans.length > 0) {
                        this.plans = [];
                        for (let plan of plans) {
                            let item = {
                                planId: '',
                                maintainId: '',
                                createTime: '',
                                executeTime: '',
                                isCycle: '',
                                cycleDay: '',
                                description: ''
                            };
                            item.planId = plan.PlanId;
                            item.maintainId = plan.MaintainId.toString();
                            item.createTime = plan.CreateTime;
                            item.executeTime = plan.ExecuteTime;
                            item.isCycle = plan.IsCycle;
                            item.cycleDay = plan.CycleDay;
                            item.description = plan.Description;
                            this.plans.push(item);
                        }
                    }
                    //NProgress.done();
                });
                setTimeout(() => {
                    this.listLoading = false;
                }, 2000);
            },
            //获取维护项列表
            getMaintains() {
                let para = {
                };
                this.listLoading = true;
                //NProgress.start();
                getMaintainListPage(para).then((res) => {
                    let data = res.data.d;
                    let index1 = data.indexOf("]");
                    let maintains = JSON.parse(data.substr(0, index1 + 1));

                    if (maintains.length > 0) {
                        this.maintains = [];
                        for (let maintain of maintains) {
                            let item = {
                                value: '',
                                label: ''
                            };
                            item.value = maintain.MaintainId;
                            item.label = maintain.MaintainTitle;
                            this.maintains.push(item);
                        }
                    }
                    console.log('this.maintains: ' + JSON.stringify(this.maintains));
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //获取设备类型
            getEquipmentCategories() {
                let para = {
                };
                this.listLoading = true;
                //NProgress.start();
                getEquipmentCategoryList(para).then((res) => {
                    let data = res.data.d;
                    let index1 = data.indexOf("]");
                    let equipmentCategory = JSON.parse(data.substr(0, index1 + 1));

                    if (equipmentCategory.length > 0) {
                        this.equipmentCategories = [];
                        for (let equipmentCate of equipmentCategory) {
                            let item = {
                                EquipmentCategoryId: '',
                                EquipmentCategoryName: ''
                            };
                            item.EquipmentCategoryId = equipmentCate.EquipmentCategoryId;
                            item.EquipmentCategoryName = equipmentCate.EquipmentCategoryName;
                            this.equipmentCategories.push(item);
                            this.categorySource.push({
                                label: item.EquipmentCategoryName,
                                key: item.EquipmentCategoryId
                            });
                        }
                    }
                    this.listLoading = false;
                    //NProgress.done();
                });
//                setTimeout(() => {
//                    this.listLoading = false;
//                }, 2000);
            },
            //获取设备类型
            getEquipments(strEquipmentCategoryId) {
                let para = {
                    strEquipmentCategoryId: strEquipmentCategoryId
                };
                this.listLoading = true;
                //NProgress.start();
                getEquipmentList(para).then((res) => {
                    let data = res.data.d;
                    let index1 = data.indexOf("]");
                    let equipments = JSON.parse(data.substr(0, index1 + 1));

                    if (equipments.length > 0) {
                        this.equipments = [];
                        for (let equipment of equipments) {
                            let item = {
                                EquipmentId: '',
                                EquipmentName: ''
                            };
                            item.EquipmentId = equipment.EquipmentId;
                            item.EquipmentName = equipment.EquipmentName;
                            this.equipments.push(item);
                            this.equipmentSource.push({
                                label: item.EquipmentName,
                                key: item.EquipmentId
                            });
                        }
                    }
                    this.listLoading = false;
                    //NProgress.done();
                });
//                setTimeout(() => {
//                    this.listLoading = false;
//                }, 2000);
            },
            //获取设备类型
            getMaintainEquipments(strPlanId) {
                let para = {
                    strPlanId: strPlanId
                };
                this.listLoading = true;
                //NProgress.start();
                getMaintainEquipmentList(para).then((res) => {
                    let data = res.data.d;
                    let index1 = data.indexOf("]");
                    let maintainEquipments = JSON.parse(data.substr(0, index1 + 1));

                    if (maintainEquipments.length > 0) {
                        this.equipments = [];
                        for (let maintainEquipment of maintainEquipments) {
                            let item = {
                                EquipmentCategoryId: '',
                                EquipmentCategoryName: ''
                            };
                            item.EquipmentId = maintainEquipment.EquipmentCategoryId;
                            item.EquipmentName = maintainEquipment.EquipmentCategoryName;
                            this.equipments.push(item);
                            this.equipmentSource.push({
                                label: item.EquipmentName,
                                key: item.EquipmentId
                            });
                        }
                    }
                    this.listLoading = false;
                    //NProgress.done();
                });
//                setTimeout(() => {
//                    this.listLoading = false;
//                }, 2000);
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {planId: row.planId};
                    removePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        let data = res.data.d;
                        let index = data.indexOf(":");
                        let result = data.substr(index + 2, data.length - index - 3);
                        if (result === 'true') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else {
                            this.$message({
                                message: '删除失败',
                                type: 'success'
                            });
                        }
                        this.getPlans();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.getEquipmentCategories();
                this.getEquipments();
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    maintainId: '',
                    maintain: {},
                    executeTime: '',
                    isCycle: false,
                    cycleDay: '',
                    description: '',
                    equipmentCategory: '',
                    equipmentId: ''
                };
                this.getMaintains();
                this.getEquipmentCategories();
                this.getEquipments(this.addForm.equipmentCategory);
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
                                let data = res.data.d;
                                let index = data.indexOf(":");
                                let result = data.substr(index + 2, data.length - index - 3);
                                if (result === 'true') {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                }else {
                                    this.$message({
                                        message: '提交失败',
                                        type: 'success'
                                    });
                                }
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
                                let data = res.data.d;
                                let index = data.indexOf(":");
                                let result = data.substr(index + 2, data.length - index - 3);
                                if (result === 'true') {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                }else {
                                    this.$message({
                                        message: '提交失败',
                                        type: 'success'
                                    });
                                }
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
                var ids = this.sels.map(item => item.planId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemovePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        let data = res.data.d;
                        let index = data.indexOf(":");
                        let result = data.substr(index + 2, data.length - index - 3);
                        if (result === 'true') {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                        }else {
                            this.$message({
                                message: '提交失败',
                                type: 'success'
                            });
                        }
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