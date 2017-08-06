import axios from 'axios';
import * as url from './urlConfig'

export const requestLogin = params => { return axios.post(url.login, params).then(res => res.data); };

export const getUserList = params => { return axios.get(url.userList, { params: params }); };

export const getUserListPage = params => { return axios.get(url.userListpage, { params: params }); };

export const removeUser = params => { return axios.get(url.userRemove, { params: params }); };

export const batchRemoveUser = params => { return axios.get(url.userBatchremove, { params: params }); };

export const editUser = params => { return axios.get(url.userEdit, { params: params }); };

export const addUser = params => { return axios.get(url.userAdd, { params: params }); };


//category
export const getCategoryList = params => { return axios.get(url.categoryList, { params: params }); };

export const getCategoryListPage = params => { return axios.get(url.categoryListpage, { params: params }); };

export const removeCategory = params => { return axios.get(url.categoryRemove, { params: params }); };

export const batchRemoveCategory = params => { return axios.get(url.categoryBatchremove, { params: params }); };

export const editCategory = params => { return axios.get(url.categoryEdit, { params: params }); };

export const addCategory = params => { return axios.get(url.categoryAdd, { params: params }); };