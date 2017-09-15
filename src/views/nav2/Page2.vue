<template>
    <section>
        <!--工具条-->
        <el-collapse v-model="activeNames">
            <el-collapse-item title="查询条件" name="1">
                <el-form ref="form" :model="form" @submit.prevent="onSubmit" style="margin:10px;">
                    <el-form :model="filters">
                        <el-row>
                            <el-col :xs="5" :sm="5" :md="5" :lg="5" style="margin-left: 12px;">
                                <el-form-item>
                                    <el-input v-model="filters.planId" placeholder="计划ID"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="5" :sm="5" :md="5" :lg="6">
                                <el-form-item>
                                    <el-input v-model="filters.maintainId" placeholder="维护项ID"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="5" :sm="5" :md="5" :lg="6">
                                <el-form-item>
                                    <el-input v-model="filters.description" placeholder="计划描述"
                                              style="width: 160px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="7" :sm="7" :md="7" :lg="4" style="margin-left: 20px;">
                                <el-form-item label="是否周期性:">
                                    <el-radio-group v-model="filters.isCycle">
                                        <el-radio class="radio" :label="true">是</el-radio>
                                        <el-radio class="radio" :label="false">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="12" :sm="12" :md="12" :lg="12">
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
                            <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                <el-form-item label-width="80px" label="执行时间" class="postInfo-container-item">
                                    <el-date-picker
                                            v-model="filters.eTime"
                                            type="datetimerange"
                                            :picker-options="pickerOptions3"
                                            placeholder="选择时间范围"
                                            align="right">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>

                            <!--<el-col :xs="12" :sm="12" :md="12" :lg="8" v-if="filters.isCycle"-->
                            <!--style="margin-left: 12px;">-->
                            <!--<el-form-item label="执行周期(天)">-->
                            <!--<el-select v-model="filters.cycleDay" multiple placeholder="请选择">-->
                            <!--<el-option-->
                            <!--v-for="item in cycleDays"-->
                            <!--:key="item.value"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                            <!--</el-option>-->
                            <!--</el-select>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                            <el-col :xs="24" :sm="24" :md="24" :lg="24">
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
                    <el-table-column prop="maintainTitle" label="维护名称" width="120">
                    </el-table-column>
                    <el-table-column prop="maintainContent" label="维护内容" width="260">
                    </el-table-column>
                    <el-table-column prop="description" label="描述">
                    </el-table-column>
                    <el-table-column prop="equipmentName" label="相关设备" width="260">
                    </el-table-column>
                    <el-table-column prop="cycleDay" label="剩余天数" width="180">
                    </el-table-column>
                    <el-table-column prop="isCycle" label="是否周期性" width="180" :formatter="formatCycle">
                    </el-table-column>
                    <el-table-column prop="executeTime" label="执行时间" width="120">
                    </el-table-column>
                    <el-table-column label="操作" width="190">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="info" size="small" icon="information" @click="handleDetail(scope.$index, scope.row)">
                            </el-button>
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
        <el-dialog title="编辑维护计划" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="维护项" prop="maintainId">
                            <el-select v-model="editForm.maintainId" placeholder="请选择维护项">
                                <el-option v-for="item in maintainOptions" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="执行时间" prop="executeTime">
                            <el-date-picker
                                    v-model="editForm.executeTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    :picker-options="pickerOptions0"
                                    align="right"
                                    >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="是否周期性" prop="isCycle">
                            <el-radio-group v-model="editForm.isCycle">
                                <el-radio class="radio" :label="true">是</el-radio>
                                <el-radio class="radio" :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" style="margin-left: 22px;">
                        <el-form-item label="执行周期(天)" prop="cycleDay" v-if="addForm.isCycle">
                            <el-input-number v-model="editForm.cycleDay" @change="handleChange" :min="1"
                                             :max="90"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-form-item label="提醒时间">
                            <el-tag :closable="true" v-model="editForm.remindDay" v-for="item in customDayOptions"
                                    :key="item.value" :type="isActive(item.value)?'primary':''"
                                    @close='closeViewTabs(item,$event)' style="margin-left: 2px;">{{item.label}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" style="margin-left: 12px;">
                        <el-form-item label="自定义(天)" prop="customDay">
                            <el-input-number v-model="editForm.customDay" @change="handleCustomDayChange" :min="1"
                                             :max="365">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10">
                        <el-form-item>
                            <el-button type="primary" v-if="!showAddCustomDayButton" disabled="disabled">添加</el-button>
                            <el-button type="primary" @click="onAddCustomDay(editForm.customDay)"
                                       v-if="showAddCustomDayButton">添加
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="计划描述" prop="description" style="width: 450px;">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="editForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="equipmentCategory">
                    <el-transfer v-model="editForm.equipmentCategory" :data="categorySource" :titles="categoryTitles"
                                 @change="getEquipments(editForm.equipmentCategory)"></el-transfer>
                </el-form-item>
                <el-form-item label="设备" prop="equipmentId">
                    <el-transfer v-model="editForm.equipmentId" :data="equipmentSource"
                                 :titles="equipmentTitles"></el-transfer>
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
                <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="维护项" prop="maintainId">
                            <el-select v-model="addForm.maintainId" placeholder="请选择维护项">
                                <el-option v-for="item in maintainOptions" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="执行时间" prop="executeTime">
                            <el-date-picker
                                    v-model="addForm.executeTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    :picker-options="pickerOptions0"
                                    align="right"
                                    >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="是否周期性" prop="isCycle">
                            <el-radio-group v-model="addForm.isCycle">
                                <el-radio class="radio" :label="true">是</el-radio>
                                <el-radio class="radio" :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" style="margin-left: 22px;">
                        <el-form-item label="执行周期(天)" prop="cycleDay" v-if="addForm.isCycle">
                            <el-input-number v-model="addForm.cycleDay" @change="handleChange" :min="1"
                                             :max="90"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-form-item label="提醒时间">
                            <el-tag :closable="true" v-model="addForm.remindDay" v-for="item in customDayOptions"
                                    :key="item.value" :type="isActive(item.value)?'primary':''"
                                    @close='closeViewTabs(item,$event)' style="margin-left: 2px;">{{item.label}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" style="margin-left: 12px;">
                        <el-form-item label="自定义(天)" prop="customDay">
                            <el-input-number v-model="addForm.customDay" @change="handleCustomDayChange" :min="1"
                                             :max="365">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10">
                        <el-form-item>
                            <el-button type="primary" v-if="!showAddCustomDayButton" disabled="disabled">添加</el-button>
                            <el-button type="primary" @click="onAddCustomDay(addForm.customDay)"
                                       v-if="showAddCustomDayButton">添加
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="计划描述" prop="description" style="width: 450px;">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="addForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="equipmentCategory">
                    <el-transfer v-model="addForm.equipmentCategory" :data="categorySource" :titles="categoryTitles"
                                 @change="getEquipments(addForm.equipmentCategory.toString())"></el-transfer>
                </el-form-item>
                <el-form-item label="设备" prop="equipmentId">
                    <el-transfer v-model="addForm.equipmentId" :data="equipmentSource"
                                 :titles="equipmentTitles"></el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--设备详情界面-->
        <el-dialog
                title="设备详情"
                size="small"
                :visible.sync="detailFormVisible"
                :close-on-click-modal="false">
            <!--列表-->
            <el-table :data="equipmentNameList" highlight-current-row>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="equipmentName" label="设备名称">
                </el-table-column>
            </el-table>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import * as base from '../../api/urlConfig'
    //import NProgress from 'nprogress'
    import {
        getPlanListPage,
        removePlan,
        batchRemovePlan,
        editPlan,
        addPlan,
        getMaintainListPage,
        getEquipmentCategoryList,
        getEquipmentList,
        getMaintainEquipmentList,
        getMaintainRemindInfoList,
        addRemind
    } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    planId: '',
                    maintainId: '',
                    equipmentCategory: '',
                    equipmentId: '',
                    cTime: '',
                    eTime: '',
                    isCycle: '',
                    description: '',
                    cycleDay: []
                },
                panelTitle: '维护计划列表',
                activeNames: ['1'],
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
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
                pickerOptions3: {
                    shortcuts: [{
                        text: '未来一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '未来一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '未来三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
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
                maintainOptions: [],
                customDayOptions: [{
                    value: '1',
                    label: '1天'
                }, {
                    value: '3',
                    label: '3天'
                }, {
                    value: '7',
                    label: '7天'
                }],
                operate: '',
                currentCustomDay: '',
                showAddCustomDayButton: false,
                categorySource: [],
                equipmentSource: [],
                categoryTitles: ['设备类型', '已选设备类型'],
                equipmentTitles: ['设备', '已选设备'],
                plans: [{
                    planId: '',
                    maintainId: '',
                    maintainTitle: '',
                    maintainContent: '',
                    equipmentName: '',
                    equipmentNameList: [],
                    createTime: '',
                    executeTime: '',
                    isCycle: '',
                    cycleDay: '',
                    description: ''
                }],
                equipmentCategories: [],
                equipments: [],
                total: 0,
                listLoading: false,
                sels: [],//列表选中列

                form: {
                    planId: '',
                    maintainId: '',
                    maintainTitle: '',
                    maintainContent: '',
                    equipmentName: '',
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
//                    equipmentCategory: [
//                        {required: true, message: '请输入设备类型ID', trigger: 'blur'}
//                    ]
                },
                //编辑界面数据
                editForm: {
                    planId: '',
                    maintainId: '',
                    createTime: '',
                    executeTime: '',
                    isCycle: false,
                    cycleDay: '',
                    remindDay: [],
                    customDay: '',
                    description: '',
                    equipmentCategory: [],
                    equipmentId: []
                },

                detailFormVisible: false,//设备详情界面是否显示
                equipmentNameList: [],

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    maintainId: [
                        {required: true, message: '请输选择护项', trigger: 'blur'}
                    ],
//                    executeTime: [
//                        {required: true, validator: this.checkExecuteTime, trigger: 'blur'}
//                    ],
//                    equipmentCategory: [
//                        {required: true, message: '请选择设备类型', trigger: 'blur'}
//                    ]
                },
                //新增界面数据
                addForm: {
                    maintainId: '',
                    createTime: '',
                    executeTime: '',
                    isCycle: false,
                    cycleDay: '',
                    remindDay: [1, 3, 7],
                    customDay: '',
                    description: '',
                    equipmentCategory: [],
                    equipmentId: []
                }
            }
        },
        methods: {
            checkExecuteTime: (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('执行时间不能为空'));
                }
                setTimeout(() => {
                    const now = new Date();
                    console.log("Math.abs(value - now) < 0 : " + Math.abs(value - now) < 60);
                    if (Math.abs(value - now) < 0) {
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
            // 检测是否已经存在，若存在添加按钮不可点击
            checkCustomDay: function (value) {
                let index = this.customDayOptions.findIndex(x => x.value == value);
                console.log('index: ' + index);
                console.log('value: ' + value);
                if (index != -1) {
                    this.showAddCustomDayButton = false;
                } else {
                    this.showAddCustomDayButton = true;
                }
            },
            handleCustomDayChange: function (value) {
                // 检测是否已经存在，若存在添加按钮不可点击
                this.checkCustomDay(value);
            },
            onAddCustomDay: function (value) {
                this.currentCustomDay = value;

                this.customDayOptions.push({
                    value: this.currentCustomDay,
                    label: this.currentCustomDay + '天'
                });

                if (this.operate == 'add') {
                    this.addForm.remindDay.push(this.currentCustomDay);
                } else {
                    this.editForm.remindDay.push(this.currentCustomDay);

                }

                // 检测是否已经存在，若存在添加按钮不可点击
                this.checkCustomDay(this.currentCustomDay);
            },
            isActive(value) {
                return value === this.currentCustomDay;
            },
            closeViewTabs(item, $event) {
                let index = this.customDayOptions.findIndex(x => x.value == item.value);
                this.customDayOptions.splice(index, 1);

                if (this.operate == 'add') {
                    this.currentCustomDay = this.addForm.customDay;
                } else {
                    this.currentCustomDay = this.editForm.customDay;
                }
                this.checkCustomDay(this.currentCustomDay);
                $event.preventDefault()
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
                let _this = this;
                _this.plans = [];

                let para = {
                    pageNo: _this.listQuery.curPage,
                    pageSize: _this.listQuery.pageSize,
                    planId: _this.filters.planId,
                    maintainId: _this.filters.maintainId,
                    cTime: _this.filters.cTime[0] && _this.filters.cTime[1] ? util.formatDate.formatDate(_this.filters.cTime[0]) + ',' + util.formatDate.formatDate(_this.filters.cTime[1]) : '',
                    eTime: _this.filters.eTime[0] && _this.filters.eTime[1] ? util.formatDate.formatDate(_this.filters.eTime[0]) + ',' + util.formatDate.formatDate(_this.filters.eTime[1]) : '',
                    isCycle: _this.filters.isCycle,
                    description: _this.filters.description,
                    strOrder: 'CreateTime DESC'
                };

                _this.listLoading = true;

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
                        _this.total = parseInt(totalStr);

                        if (plans.length > 0) {
                            _this.plans = [];
                            for (let plan of plans) {
                                let item = {
                                    planId: '',
                                    maintainId: '',
                                    maintainTitle: '',
                                    maintainContent: '',
                                    equipmentName: '',
                                    equipmentNameList: [],
                                    createTime: '',
                                    executeTime: '',
                                    isCycle: '',
                                    cycleDay: '',
                                    description: ''
                                };
                                item.planId = plan.PlanId;
                                item.maintainId = plan.MaintainId.toString();
                                item.maintainTitle = plan.MaintainTitle;
                                item.maintainContent = plan.MaintainContent;
                                let equipmentName = plan.EquipmentName.split(',');
                                item.equipmentNameList = [];
                                for (let equipment of equipmentName) {
                                    item.equipmentNameList.push({"planId" : item.planId,"equipmentName" : equipment});
                                }
                                if(equipmentName[0]) {
                                    item.equipmentName = equipmentName[0] + "...";
                                }else {
                                    item.equipmentName = "无数据";
                                }
                                item.createTime = plan.CreateTime;
                                item.executeTime = plan.ExecuteTime;
                                item.isCycle = plan.IsCycle;
                                item.cycleDay = plan.CycleDay;
                                item.description = plan.Description;
                                _this.plans.push(item);
                            }
                        }
                    }
                });
                setTimeout(() => {
                    _this.listLoading = false;
                }, 1000);
            },
            //获取维护项列表
            getMaintains() {
                let _this = this;
                _this.maintainOptions = [];

                let para = {
                };

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

                        if (maintains.length > 0) {
                            for (let maintain of maintains) {
                                let item = {
                                    value: '',
                                    label: ''
                                };
                                item.value = maintain.MaintainId.toString();
                                item.label = maintain.MaintainTitle;
                                _this.maintainOptions.push(item);
                            }
                        }
                    }
                });
            },
            //获取设备类型
            getEquipmentCategories() {
                let _this = this;
                _this.categorySource = [];

                let para = {};

                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: base.baseUrl + "/MaintainService.svc/GetEquipmentCategory",
                    success: function (res) {
                        let equipmentCategory = {};
                        if (res) {
                            equipmentCategory = JSON.parse(res);
                        }

                        if (equipmentCategory.length > 0) {
                            for (let equipmentCategory of equipmentCategory) {
                                let item = {
                                    EquipmentCategoryId: '',
                                    EquipmentCategoryName: ''
                                };
                                item.EquipmentCategoryId = equipmentCategory.EquipmentCategoryId;
                                item.EquipmentCategoryName = equipmentCategory.EquipmentCategoryName;
                                _this.categorySource.push({
                                    label: item.EquipmentCategoryName,
                                    key: parseInt(item.EquipmentCategoryId)
                                });
                            }
                        }
                    }
                });
            },
            //获取设备类型
            getEquipments(CategoryId) {
                let _this = this;
                _this.equipmentSource = [];

                let para = {
                    strEquipmentCategoryId: CategoryId
                };

                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: base.baseUrl + "/MaintainService.svc/GetEquipment",
                    success: function (res) {
                        let equipments = {};
                        if (res) {
                            equipments = JSON.parse(res);
                        }
                        if (equipments.length > 0) {
                            for (let equipment of equipments) {
                                let item = {
                                    EquipmentId: '',
                                    EquipmentName: ''
                                };
                                item.EquipmentId = equipment.EquipmentId;
                                item.EquipmentName = equipment.EquipmentName;
                                _this.equipmentSource.push({
                                    label: item.EquipmentName,
                                    key: item.EquipmentId
                                });
                            }
                        }
                    }
                });
            },
            //获取维护计划相关设备
            getMaintainEquipments(strPlanId) {
                let para = {
                    strPlanId: strPlanId
                };
                let _this = this;
                let maintainEquipments = {};
                _this.editForm.equipmentId = [];
                _this.editForm.equipmentCategory = [];

                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: base.baseUrl + "/MaintainService.svc/GetMaintainEquipment",
                    success: function (res) {
                        if (res) {
                            let index1 = res.indexOf("]");
                            maintainEquipments = JSON.parse(res.substr(0, index1 + 1));
                        }

                        if (maintainEquipments.length > 0) {
                            for (let maintainEquipment of maintainEquipments) {
                                let equipmentCategoryItem = {
                                    EquipmentCategoryId: '',
                                    EquipmentCategoryName: ''
                                };
                                equipmentCategoryItem.EquipmentCategoryId = maintainEquipment.EquipmentCategoryId;
                                equipmentCategoryItem.EquipmentCategoryName = maintainEquipment.EquipmentCategoryName;
                                _this.editForm.equipmentCategory.push(equipmentCategoryItem.EquipmentCategoryId);

                                let equipmentItem = {
                                    EquipmentId: '',
                                    EquipmentName: ''
                                };
                                equipmentItem.EquipmentId = maintainEquipment.EquipmentId;
                                equipmentItem.EquipmentName = maintainEquipment.EquipmentName;
                                _this.editForm.equipmentId.push(equipmentItem.EquipmentId);
                            }
                        }
                    }
                });
            },
            getMaintainRemindInfo(strPlanId) {
                let _this = this;
                let para = {
                    strPlanId: strPlanId
                };
                _this.customDayOptions = [];
                _this.editForm.remindDay = [];

                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: base.baseUrl + "/MaintainService.svc/GetMaintainRemind",
                    success: function (res) {
                        let maintainReminds = {};
                        if (res) {
                            let index1 = res.indexOf("]");
                            maintainReminds = JSON.parse(res.substr(0, index1 + 1));
                        }

                        if (maintainReminds.length > 0) {
                            for (let maintainRemind of maintainReminds) {
                                if(maintainRemind.RemindDay !== 0) {
                                    _this.editForm.remindDay.push(maintainRemind.RemindDay);
                                    _this.customDayOptions.push({
                                        value: maintainRemind.RemindDay,
                                        label: maintainRemind.RemindDay + '天'
                                    });
                                }
                            }
                        }
                        _this.checkCustomDay(_this.editForm.customDay);
                    }
                });
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
                this.getPlans();
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {strPlanId: row.planId};

                    $.ajax({
                        async: true,
                        type: 'GET',
                        jsonp: 'jsoncallback',
                        data: para,
                        url: base.baseUrl + "/MaintainService.svc/DelMaintainPlan",
                        success: this.deleteSuccess,
                        dataType: 'jsonp'
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.operate = 'edit';
                this.editForm = {
                    planId: row.planId,
                    maintainId: row.maintainId,
                    createTime: row.createTime,
                    executeTime: row.executeTime,
                    isCycle: row.isCycle,
                    cycleDay: row.cycleDay,
                    remindDay: [1, 3, 7],
                    customDay: row.customDay,
                    description: row.description,
                    equipmentCategory: row.equipmentCategory,
                    equipmentId: row.equipmentId
                },
//                this.editForm = Object.assign({}, row);
//                this.getPlans();
                this.getEquipmentCategories();
                this.getEquipments(row.equipmentCategory);
                this.getMaintainEquipments(row.planId);
                this.getMaintainRemindInfo(row.planId);
            },
            //显示设备详情界面
            handleDetail: function (index, row) {
                let _this = this;
                _this.detailFormVisible = true;
                _this.operate = 'detail';
                _this.equipmentNameList = [];
                if (_this.plans.length > 0) {
                    for (let plan of _this.plans) {
                        if(plan.equipmentNameList.length > 0) {
                            for (let equipment of plan.equipmentNameList) {
                                if (row.planId === equipment.planId) {
                                    if("" != equipment.equipmentName){
                                        _this.equipmentNameList.push({equipmentName: equipment.equipmentName});
                                    }
                                }
                            }
                        }
                    }
                }
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.operate = 'add';
                this.customDayOptions = [{
                    value: '1',
                    label: '1天'
                }, {
                    value: '3',
                    label: '3天'
                }, {
                    value: '7',
                    label: '7天'
                }],
                    this.addForm = {
                        maintainId: '',
                        executeTime: '',
                        isCycle: false,
                        cycleDay: '',
                        remindDay: [1, 3, 7],
                        customDay: '',
                        description: '',
                        equipmentCategory: [],
                        equipmentId: []
                    };
                this.getMaintains();
                this.getEquipmentCategories();
                this.getEquipments(this.addForm.equipmentCategory.toString());
            }
            ,
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
                this.getPlans();
            }
            ,
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.equipmentCategory = para.equipmentCategory.toString();
                            para.equipmentId = para.equipmentId.toString();
                            para.remindDay = para.remindDay.toString();
                            if (this.editForm.equipmentCategory.length === this.categorySource.length) {
                                para.equipmentCategory = -1;
                            } else {
                                para.equipmentCategory = this.editForm.equipmentCategory.toString();
                            }
                            if (this.editForm.equipmentId.length === this.equipmentSource.length) {
                                para.equipmentId = -1;
                            } else {
                                para.equipmentId = this.editForm.equipmentId.toString();
                            }
                            $.ajax({
                                async: true,
                                type: 'GET',
                                jsonp: 'jsoncallback',
                                data: para,
                                url: base.baseUrl + "/MaintainService.svc/UpdMaintainPlan",
                                success: this.editSuccess,
                                dataType: 'jsonp'
                            });

                            let para2 = {};
                            para2.strPlanId = this.editForm.planId;
                            para2.strRemindDay = this.editForm.remindDay.toString();
                            $.ajax({
                                async: true,
                                type: 'GET',
                                jsonp: 'jsoncallback',
                                data: para2,
                                url: base.baseUrl + "/MaintainService.svc/AddMaintainRemind",
                                success: this.editSuccess,
                                dataType: 'jsonp'
                            });
                        });
                    }
                });
            }
            ,
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
                this.getPlans();
            }
            ,
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            //let para = Object.assign({}, this.addForm);
                            let para1 = {};
                            para1.maintainId = this.addForm.maintainId;
                            para1.executeTime = this.addForm.executeTime ? util.formatDate.formatDate(this.addForm.executeTime) : '';
                            para1.isCycle = this.addForm.isCycle;
                            para1.cycleDay = this.addForm.cycleDay;
                            para1.description = this.addForm.description;
                            para1.remindDay = this.addForm.remindDay.toString();
                            if (this.addForm.equipmentCategory.length === this.categorySource.length) {
                                para1.equipmentCategory = -1;
                            } else {
                                para1.equipmentCategory = this.addForm.equipmentCategory.toString();
                            }
                            if (this.addForm.equipmentId.length === this.equipmentSource.length) {
                                para1.equipmentId = -1;
                            } else {
                                para1.equipmentId = this.addForm.equipmentId.toString();
                            }

                            $.ajax({
                                async: true,
                                type: 'GET',
                                jsonp: 'jsoncallback',
                                data: para1,
                                url: base.baseUrl + "/MaintainService.svc/AddMaintainPlan",
                                success: this.addSuccess,
                                dataType: 'jsonp'
                            });
                        });
                    }
                });
            }
            ,
            selsChange: function (sels) {
                this.sels = sels;
            }
            ,
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.planId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {strPlanId: ids};
                    $.ajax({
                        async: true,
                        type: 'GET',
                        jsonp: 'jsoncallback',
                        data: para,
                        url: base.baseUrl + "/MaintainService.svc/DelMaintainPlan",
                        success: this.deleteSuccess,
                        dataType: 'jsonp'
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
    .toolbar {
        background-color: #f8f8f8 !important;
    }
</style>