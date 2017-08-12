import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users, Categories, Maintains, Plans } from './data/db';
let _Users = Users;
let _Categories = Categories;
let _Maintains = Maintains;
let _Plans = Plans;

export default {
    /**
     * mock bootstrap
     */
    bootstrap() {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.username === username && u.password === password) {
                            user = JSON.parse(JSON.stringify(u));
                            user.password = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, {code: 200, msg: '请求成功', user}]);
                    } else {
                        resolve([200, {code: 500, msg: '账号或密码错误'}]);
                    }
                }, 1000);
            });
        });

        //获取用户列表
        mock.onGet('/user/list').reply(config => {
            let {siteName} = config.params;
            let users = _Users.filter(user => {
                if (siteName && user.siteName.indexOf(siteName) == -1) return false;
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        users: users
                    }]);
                }, 1000);
            });
        });

        //获取用户列表（分页）
        mock.onGet('/user/listpage').reply(config => {
            let {page, siteName} = config.params;
            let users = _Users.filter(user => {
                if (siteName && user.siteName.indexOf(siteName) == -1) return false;
                return true;
            });
            let total = users.length;
            users = users.filter((u, index) => index < 10 * page && index >= 10 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: users
                    }]);
                }, 1000);
            });
        });

        //删除用户
        mock.onGet('/user/remove').reply(config => {
            let {id} = config.params;
            _Users = _Users.filter(u => u.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除用户
        mock.onGet('/user/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            _Users = _Users.filter(u => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //编辑用户
        mock.onGet('/user/edit').reply(config => {
            let {id, siteName, deviceNo, startTime, repeat, state, type} = config.params;
            _Users.some(u => {
                if (u.id === id) {
                    u.siteName = siteName;
                    u.deviceNo = deviceNo;
                    u.startTime = startTime;
                    u.repeat = repeat;
                    u.state = state;
                    u.type = type;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });

        //新增用户
        mock.onGet('/user/add').reply(config => {
            let {siteName, deviceNo, startTime, repeat, state, type} = config.params;
            _Users.push({
                siteName: siteName,
                deviceNo: deviceNo,
                startTime: startTime,
                repeat: repeat,
                state: state,
                type: type
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });

        //================= 类别 ===================

        //获取类别列表
        mock.onGet('/category/list').reply(config => {
            let {name} = config.params;
            let categories = _Categories.filter(category => {
                if (name && category.name.indexOf(name) == -1) return false;
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        categories: categories
                    }]);
                }, 1000);
            });
        });

        //获取类别列表（分页）
        mock.onGet('/category/listpage').reply(config => {
            let {page, name} = config.params;
            let categories = _Categories.filter(category => {
                if (name && category.name.indexOf(name) == -1) return false;
                return true;
            });
            let total = categories.length;
            categories = categories.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        categories: categories
                    }]);
                }, 1000);
            });
        });

        //删除类别
        mock.onGet('/category/remove').reply(config => {
            let {id} = config.params;
            _Categories = _Categories.filter(ca => ca.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除类别
        mock.onGet('/category/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            _Categories = _Categories.filter(ca => !ids.includes(ca.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //编辑类别
        mock.onGet('/category/edit').reply(config => {
            let {id, name, option} = config.params;
            _Categories.some(ca => {
                if (ca.id === id) {
                    ca.name = name;
                    ca.option = option;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });

        //新增类别
        mock.onGet('/category/add').reply(config => {
            let {name, option} = config.params;
            _Categories.push({
                name: name,
                option: option
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });

        //================= 维护项 ===================

        //获取维护项列表
        mock.onGet('/maintain/list').reply(config => {
            let {strTitle, strContent} = config.params;
            let maintains = _Maintains.filter(maintain => {
                if (strTitle && maintain.strTitle.indexOf(strTitle) == -1 && strContent && maintain.strContent.indexOf(strContent) == -1) return false;
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        maintains: maintains
                    }]);
                }, 1000);
            });
        });

        //获取维护项列表（分页）
        mock.onGet('/maintain/listpage').reply(config => {
            let {page, strTitle, strContent} = config.params;
            let maintains = _Maintains.filter(maintain => {
                if ((strTitle && maintain.strTitle.indexOf(strTitle) == -1) || (strContent && maintain.strContent.indexOf(strContent) == -1)) return false;
                return true;
            });
            let total = maintains.length;
            maintains = maintains.filter((ma, index) => index < 10 * page && index >= 10 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        maintains: maintains
                    }]);
                }, 1000);
            });
        });

        //删除维护项
        mock.onGet('/maintain/remove').reply(config => {
            let { strMaintainId } = config.params;
            _Maintains = _Maintains.filter(maintain => maintain.strMaintainId !== strMaintainId);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除维护项
        mock.onGet('/maintain/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            _Maintains = _Maintains.filter(maintain => !ids.includes(maintain.strMaintainId));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //编辑维护项
        mock.onGet('/maintain/edit').reply(config => {
            let { strMaintainId, strTitle, strContent, cStartTime, cEndTime, uStartTime, uEndTime } = config.params;
            _Maintains.some(maintain => {
                if (maintain.strMaintainId === strMaintainId) {
                    maintain.strTitle = strTitle;
                    maintain.strContent = strContent;
                    maintain.cStartTime = cStartTime;
                    maintain.cEndTime = cEndTime;
                    maintain.uStartTime = uStartTime;
                    maintain.uEndTime = uEndTime;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });

        //新增维护项
        mock.onGet('/maintain/add').reply(config => {
            let {strTitle, strContent, cStartTime, cEndTime, uStartTime, uEndTime} = config.params;
            _Maintains.push({
                strTitle: strTitle,
                strContent: strContent,
                cStartTime: cStartTime,
                cEndTime: cEndTime,
                uStartTime: uStartTime,
                uEndTime: uEndTime
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });

        //================= 维护计划 ===================

        //获取维护计划列表
        mock.onGet('/plan/list').reply(config => {
            let {maintainId} = config.params;
            let plans = _Plans.filter(plan => {
                if (name && plan.maintainId.indexOf(maintainId) == -1) return false;
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        plans: plans
                    }]);
                }, 1000);
            });
        });

        //获取维护计划列表（分页）
        mock.onGet('/plan/listpage').reply(config => {
            let {page, maintainId} = config.params;
            let plans = _Plans.filter(plan => {
                if (maintainId && plan.maintainId.indexOf(maintainId) == -1) return false;
                return true;
            });
            let total = plans.length;
            plans = plans.filter((ma, index) => index < 10 * page && index >= 10 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        plans: plans
                    }]);
                }, 1000);
            });
        });

        //删除维护计划
        mock.onGet('/plan/remove').reply(config => {
            let { strPlanId } = config.params;
            _Plans = _Plans.filter(plan => plan.strPlanId !== strPlanId);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除维护计划
        mock.onGet('/plan/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            _Plans = _Plans.filter(plan => !ids.includes(plan.strPlanId));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //编辑维护计划
        mock.onGet('/plan/edit').reply(config => {
            let { strPlanId, strMaintainId, executeTime, isCycle, cycleDay, executeHour, executeMinute, description, equipmentCategory, equipmentId, cStartTime, cEndTime, uStartTime, uEndTime } = config.params;
            _Plans.some(plan => {
                if (plan.strPlanId === strPlanId) {
                    plan.strMaintainId = strMaintainId;
                    plan.executeTime = executeTime;
                    plan.isCycle = isCycle;
                    plan.cycleDay = cycleDay;
                    plan.executeHour = executeHour;
                    plan.executeMinute = executeMinute;
                    plan.description = description;
                    plan.equipmentCategory = equipmentCategory;
                    plan.equipmentId = equipmentId;
                    plan.strTitle = strTitle;
                    plan.strContent = strContent;
                    plan.cStartTime = cStartTime;
                    plan.cEndTime = cEndTime;
                    plan.uStartTime = uStartTime;
                    plan.uEndTime = uEndTime;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                }, 500);
            });
        });

        //新增维护计划
        mock.onGet('/plan/add').reply(config => {
            let { strPlanId, strMaintainId, executeTime, isCycle, cycleDay, executeHour, executeMinute, description, equipmentCategory, equipmentId, cStartTime, cEndTime, uStartTime, uEndTime } = config.params;
            _Plans.push({
                strMaintainId: strMaintainId,
                executeTime: executeTime,
                isCycle: isCycle,
                cycleDay: cycleDay,
                executeHour: executeHour,
                executeMinute: executeMinute,
                description: description,
                equipmentCategory: equipmentCategory,
                equipmentId: equipmentId,
                strTitle: strTitle,
                strContent: strContent,
                cStartTime: cStartTime,
                cEndTime: cEndTime,
                uStartTime: uStartTime,
                uEndTime: uEndTime
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });
        });

    }
};