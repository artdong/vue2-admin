<template>
	<section>
		<!--工具条-->
		<el-form ref="form" :model="form" @submit.prevent="onSubmit" style="margin:10px;">
			<el-form :model="filters">
				<el-row>
					<el-col :xs="6" :sm="6" :md="6" :lg="6" style="margin-left: 12px;">
						<el-form-item label="维护项名称">
							<el-input v-model="filters.strTitle" placeholder="维护项名称" style="width: 160px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="6" :sm="6" :md="6" :lg="6">
						<el-form-item label="维护内容">
							<el-input v-model="filters.strContent" placeholder="维护内容" style="width: 180px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="6" :sm="6" :md="6" :lg="6">
						<el-form-item label="计划描述">
							<el-input v-model="filters.description" placeholder="计划描述" style="width: 180px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="4" :sm="4" :md="4" :lg="4" style="margin-left: 12px;">
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
									:picker-options="pickerOptions2"
									placeholder="选择时间范围"
									align="right">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<!--<el-col :span="7">-->
						<!--<el-form-item label="天数">-->
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
					<el-col :xs="22" :sm="22" :md="22" :lg="22">
						<el-form-item style="margin-left: 10px;">
							<el-button type="primary" v-on:click="getHistoryPlans" icon="search">查询</el-button>
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
				</div>
			</div>
			<div class="panel-body">
				<!--列表-->
				<el-table :data="historyPlans" highlight-current-row v-loading="listLoading">
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="planId" label="计划ID" width="100">
                    </el-table-column>
                    <el-table-column prop="maintainId" label="维护项ID" width="120">
                    </el-table-column>
					<el-table-column prop="maintainTitle" label="维护项名称" width="120">
					</el-table-column>
					<el-table-column prop="maintainContent" label="维护项内容">
					</el-table-column>
					<el-table-column prop="cTime" label="创建时间" width="180">
					</el-table-column>
					<el-table-column prop="eTime" label="执行时间" width="180">
					</el-table-column>
					<el-table-column prop="isCycle" label="是否周期性" :formatter="formatCycle" width="120">
					</el-table-column>
					<el-table-column prop="description" label="描述">
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.curPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="fl">
					</el-pagination>
				</el-col>
			</div>
		</div>
	</section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getHistoryPlanList } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    cTime: '',
                    eTime: '',
                    strTitle: '',
                    strContent: '',
                    isCycle: '',
                    description: ''
                },
                panelTitle: '维护历史列表',
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
                },],
                historyPlans: [],
                total: 0,
                hello: true,
                page: 1,
                listLoading: false,

                form: {
                    planId: '',
                    maintainId: '',
                    maintainTitle: '',
                    maintainContent: '',
                    cTime: '',
                    eTime: '',
                    isCycle: '',
                    cycleDay: '',
                    description: ''
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
            //状态显示转换
            formatCycle: function (row, column) {
                return row.isCycle == 0 ? '否' : row.isCycle == 1 ? '是' : '未知';
            },
            //操作分页
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getHistoryPlans();
            },
            handleCurrentChange(val) {
                this.listQuery.curPage = val;
                this.getHistoryPlans();
            },
            //刷新
            on_refresh(){
                this.getHistoryPlans();
            },
            //获取维护计划列表
            getHistoryPlans() {
                let _this = this;
                let para = {
                    pageNo: _this.listQuery.curPage,
                    pageSize: _this.listQuery.pageSize,
                    strTitle: _this.filters.strTitle,
                    strContent: _this.filters.strContent,
                    isCycle: _this.filters.isCycle,
                    description: _this.filters.description,
                    cTime: _this.filters.cTime[0] && _this.filters.cTime[1] ? util.formatDate.formatDate(_this.filters.cTime[0]) +  ',' + util.formatDate.formatDate(_this.filters.cTime[1]) : '',
                    eTime: _this.filters.eTime[0] && _this.filters.eTime[1] ? util.formatDate.formatDate(_this.filters.eTime[0]) + ',' + util.formatDate.formatDate(_this.filters.eTime[1]) : ''
                };
                _this.historyPlans = [];
                _this.listLoading = true;
                //NProgress.start();
//                getHistoryPlanList(params).then((res) => {
//                    let data = res.data.d;
//                    let index1 = data.indexOf("]");
//                    let historyPlans = JSON.parse(data.substr(0, index1 + 1));
//
//                    let totalStr = data.substr(index1 + 2, data.length - 1);
//                    let index2 = totalStr.indexOf(":");
//                    totalStr = totalStr.substr(index2 + 2, totalStr.length - index2 - 3)
//                    _this.total = parseInt(totalStr);
//
//                    if (historyPlans.length > 0) {
//                        _this.historyPlans = [];
//                        for (let historyPlan of historyPlans) {
//                            let item = {
//                                planId: '',
//                                maintainId: '',
//                                maintainTitle: '',
//                                maintainContent: '',
//                                createTime: '',
//                                executeTime: '',
//                                isCycle: '',
//                                cycleDay: '',
//                                description: ''
//                            };
//                            item.planId = historyPlan.PlanId;
//                            item.maintainId = historyPlan.MaintainId.toString();
//                            item.maintainTitle = historyPlan.MaintainTitle;
//                            item.maintainContent = historyPlan.MaintainContent;
//                            item.cTime = historyPlan.CreatePlanTime;
//                            item.eTime = historyPlan.ExecuteTime;
//                            item.isCycle = historyPlan.IsCycle;
//                            item.cycleDay = historyPlan.CycleDay;
//                            item.description = historyPlan.Description;
//                            _this.historyPlans.push(item);
//                        }
//                    }
//                    _this.listLoading = false;
//                    //NProgress.done();
//                });
                jQuery.ajax({
                    async: true,
                    type: 'GET',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: para,
                    timeout: 5000,
                    url: "http://10.169.42.142:8080/service/MaintainService.svc/GetHistoryMaintainPlan",
                    success: function (res) {
                        let index1 = res.indexOf("]");
                        let historyPlans = JSON.parse(res.substr(0, index1 + 1));

                        let totalStr = res.substr(index1 + 2, res.length - 1);
                        let index2 = totalStr.indexOf(":");
                        totalStr = totalStr.substr(index2 + 2, totalStr.length - index2 - 3)
                        _this.total = parseInt(totalStr);

                        if (historyPlans.length > 0) {
                            _this.historyPlans = [];
                            for (let historyPlan of historyPlans) {
                                let item = {
                                    planId: '',
                                    maintainId: '',
                                    maintainTitle: '',
                                    maintainContent: '',
                                    createTime: '',
                                    executeTime: '',
                                    isCycle: '',
                                    cycleDay: '',
                                    description: ''
                                };
                                item.planId = historyPlan.PlanId;
                                item.maintainId = historyPlan.MaintainId.toString();
                                item.maintainTitle = historyPlan.MaintainTitle;
                                item.maintainContent = historyPlan.MaintainContent;
                                item.cTime = historyPlan.CreatePlanTime;
                                item.eTime = historyPlan.ExecuteTime;
                                item.isCycle = historyPlan.IsCycle;
                                item.cycleDay = historyPlan.CycleDay;
                                item.description = historyPlan.Description;
                                _this.historyPlans.push(item);
                            }
                        }
                    }
                });
                setTimeout(() => {
                    _this.listLoading = false;
                }, 1000);
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {strPlanId: row.strPlanId};
                    removePlan(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getHistoryPlans();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getHistoryPlans();
        }
    }

</script>

<style scoped>

</style>