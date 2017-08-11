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

for (let i = 0; i < 5; i++) {
    Maintains.push(Mock.mock({
        strMaintainId: Mock.Random.guid(),
        strTitle: Mock.Random.cname(),
        strContent: Mock.Random.cname(),
        cStartTime: Mock.Random.date(),
        cEndTime: Mock.Random.date(),
        uStartTime: Mock.Random.date(),
        uEndTime: Mock.Random.date()
    }));
}

for (let i = 0; i < 5; i++) {
    Plans.push(Mock.mock({
        strPlanId: Mock.Random.guid(),
        strMaintainId: Mock.Random.guid(),
        isCycle: Mock.Random.cname(),
        cycleDay: Mock.Random.cname(),
        executeHour: Mock.Random.date(),
        executeMinute: Mock.Random.date(),
        description: Mock.Random.guid(),
        equipmentCategory: Mock.Random.cname(),
        equipmentId: Mock.Random.cname()
    }));
}

export { LoginUsers, Users, Categories, Maintains, Plans };
