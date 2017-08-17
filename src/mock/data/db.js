import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://avatars1.githubusercontent.com/u/16631463?v=4&s=460',
    name: 'Alex'
  }
];

const Users = [];
const Categories = [];
const Maintains = [];
const Plans = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    siteName: Mock.Random.cname(),
    deviceNo: Mock.Random.integer(0, 50),
    startTime: Mock.Random.date(),
    repeat: ['一次', '每天', '每周', '每季', '每年'],
    type: ['充电', '放电', '内阻'],
    state: Mock.Random.integer(0, 1)
  }));
}

for (let i = 0; i < 5; i++) {
    Categories.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        option: [],
    }));
}

for (let i = 0; i < 20; i++) {
    Maintains.push(Mock.mock({
        strMaintainId: Mock.Random.guid(),
        strTitle: Mock.Random.cname(),
        strContent: Mock.Random.cname(),
        createTime: Mock.Random.date(),
        updateTime: Mock.Random.date(),
        cStartTime: Mock.Random.date(),
        cEndTime: Mock.Random.date(),
        uStartTime: Mock.Random.date(),
        uEndTime: Mock.Random.date()
    }));
}

for (let i = 0; i < 21; i++) {
    Plans.push(Mock.mock({
        strPlanId: Mock.Random.guid(),
        strMaintainId: Mock.Random.guid(),
        executeTime: Mock.Random.datetime(),
        isCycle: Mock.Random.integer(0, 1),
        'cycleDay|1': ['1', '2', '3', '4', '5'],
        'executeHour|1': ['2', '4', '6', '8', '10'],
        'executeMinute|1': ['5', '10', '15', '20', '30'],
        description: Mock.Random.cname(),
        equipmentCategory: Mock.Random.guid(),
        equipmentId: Mock.Random.guid()
        // strTitle: Mock.Random.cname(),
        // strContent: Mock.Random.cname(),
        // cStartTime: Mock.Random.date(),
        // cEndTime: Mock.Random.date(),
        // uStartTime: Mock.Random.date(),
        // uEndTime: Mock.Random.date()
    }));
}

export { LoginUsers, Users, Categories, Maintains, Plans };
