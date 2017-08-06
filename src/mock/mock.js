import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {LoginUsers, Users, Categories} from './data/user';
let _Users = Users;
let _Categories = Categories;

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
            let total = siteName.length;
            siteName = users.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
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
            let categories = _Categories.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false;
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
            let total = name.length;
            name = categories.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
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

    }
};