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

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    siteName: Mock.Random.cname(),
    deviceNo: Mock.Random.integer(0, 50),
    startTime: Mock.Random.date(),
    repeat: Mock.Random.integer(0, 1),
    state: Mock.Random.integer(0, 1),
    type: Mock.Random.integer(0, 1)
  }));
}

export { LoginUsers, Users };
