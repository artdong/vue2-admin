/**
 * Created by dongxingbin on 17/7/28.
 */

// const base = ''
const base = process.env.API_ROOT

export const login = base + '/login';

export const userList = base + '/user/list';

export const userListpage = base + '/user/listpage';

export const userRemove = base + '/user/remove';

export const userBatchremove = base + '/user/batchremove';

export const userEdit = base + '/user/edit';

export const userAdd = base + '/user/add';

//category
export const categoryList = base + '/category/list';

export const categoryListpage = base + '/category/listpage';

export const categoryRemove = base + '/category/remove';

export const categoryBatchremove = base + '/category/batchremove';

export const categoryEdit = base + '/category/edit';

export const categoryAdd = base + '/category/add';

//maintain
export const maintainList = base + '/MaintainService.svc/GetMaintainItems';

// export const maintainListpage = base + '/maintain/listpage';
export const maintainListpage = base + '/MaintainService.svc/GetMaintainItems';

export const maintainRemove = base + '/MaintainService.svc/DelMaintainItem';

export const maintainBatchremove = base + '/MaintainService.svc/DelMaintainItem';

export const maintainEdit = base + '/MaintainService.svc/UpdMaintainItem';

export const maintainAdd = base + '/MaintainService.svc/AddMaintainItem';

//plan
export const planList = base + '/MaintainService.svc/GetMaintainPlan';

export const planListpage = base + '/MaintainService.svc/GetMaintainPlan';

export const planRemove = base + '/MaintainService.svc/DelMaintainPlan';

export const planBatchremove = base + '/MaintainService.svc/DelMaintainPlan';

export const planEdit = base + '/MaintainService.svc/UpdMaintainPlan';

export const planAdd = base + '/MaintainService.svc/AddMaintainPlan';

//historyPlan
export const historyPlanListpage = base + '/MaintainService.svc/GetHistoryMaintainPlan';

//equipmentCategory
export const equipmentCategoryList = base + '/MaintainService.svc/GetEquipmentCategory';

//equipment
export const equipmentList = base + '/MaintainService.svc/GetEquipment';

//maintainEquipment
export const maintainEquipmentList = base + '/MaintainService.svc/GetMaintainEquipment';

//maintainRemind
export const remindAdd = base + '/MaintainService.svc/AddMaintainRemind';

export const remindRemove = base + '/MaintainService.svc/DelMaintainRemind';

export const remindConfirm = base + '/MaintainService.svc/ConfirmRemind';

export const maintainRemindInfoList = base + '/MaintainService.svc/GetMaintainRemind';

export const remindInfoList = base + '/MaintainService.svc/GetRemindInfo';



