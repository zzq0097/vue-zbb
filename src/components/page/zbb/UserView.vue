<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户信息管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
                <el-button type="primary" style="float: right" @click="clearAndAdd">添加</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="uid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column label="性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex==='1'">男</span>
                        <span v-else-if="scope.row.sex==='2'">女</span>
                        <span v-else>未选择</span>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column prop="salt" label="盐"></el-table-column>
                <el-table-column prop="info" label="个人简介"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==='1'">用户</span>
                        <span v-else>管理员</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.lock==='0'">正常</span>
                        <span v-else>锁定</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.photo"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="详细地址"></el-table-column>
                <el-table-column label="注册时间">
                    <template slot-scope="scope">
                        {{$timestampToTime(scope.row.add_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row.uid)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="470px">
            <el-form ref="myform" :model="form" label-width="70px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别"  prop="sex">
                    <el-select v-model="form.sex">
                        <el-option value="0" label="未选择"></el-option>
                        <el-option value="1" label="男"></el-option>
                        <el-option value="2" label="女"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="form.uid==''">
                    <el-form-item label="用户名"  prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="盐" prop="salt">
                        <el-input v-model="form.salt"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type">
                        <el-option value="1" label="用户"></el-option>
                        <el-option value="2" label="管理员"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="lock">
                    <el-select v-model="form.lock">
                        <el-option value="0" label="正常"></el-option>
                        <el-option value="1" label="锁定"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="个人介绍" prop="info">
                    <el-input v-model="form.info"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="photo">
                    <el-upload
                        class="avatar-uploader"
                        action="https://nu50abw.hn3.mofasuidao.cn/donation/index.php/admin/index/img"
                        name="image"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                    >
                        <img v-if="form.photo" :src="form.photo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get,save,del } from '../../../api/user';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                uid: '',
                name: '',
                page: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            initial_form: {
                uid: '',
                name: '',
                sex: '',
                username: '',
                password: '',
                salt: '',
                info: '',
                photo: '',
                lock: '',
                type: '',
                address: ''
            },
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        clearAndAdd() {
            this.form = this.initial_form;
            this.editVisible = true;
        },
        handleAvatarSuccess(res) {
            this.form.photo = this.$imgPath+res.data;
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            get(this.query).then(res => {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            });
        },
        // 删除操作
        handleDelete(id) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.goDel([].concat(id));
            }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            this.goDel(this.multipleSelection.map(row=>row.uid));
        },
        goDel(ids) {
            del({ids: ids}).then(res=>{
                if (res.status === 200) {
                    this.$message.success('删除成功');
                    this.getData();
                } else {
                    this.$message.error('删除失败');
                }
            })
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            save(this.form).then(res=>{
                if (res.status == 200) {
                    this.$message.success(`修改成功`);
                    this.form = this.initial_form;
                } else {
                    this.$message.error(`修改失败`);
                }
                this.getData();
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.query.page = val;
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
