import axios from 'axios';
import * as url from './urlConfig'

export const requestLogin = params => { return axios.post(url.login, params).then(res => res.data); };

export const getUserList = params => { return axios.get(url.userList, { params: params }); };

export const getUserListPage = params => { return axios.get(url.userListpage, { params: params }); };

export const removeUser = params => { return axios.get(url.userRemove, { params: params }); };

export const batchRemoveUser = params => { return axios.get(url.userBatchremove, { params: params }); };

export const editUser = params => { return axios.get(url.userEdit, { params: params }); };

export const addUser = params => { return axios.get(url.userAdd, { params: params }); };