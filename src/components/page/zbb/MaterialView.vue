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
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="m_name" label="物资名称"></el-table-column>
                <el-table-column prop="info" label="描述"></el-table-column>
                <el-table-column prop="current_address" label="详细地址"></el-table-column>
                <el-table-column prop="r_address" label="地址"></el-table-column>
                <el-table-column prop="u_name" label="描述"></el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">
                        <span v-if="scope.row.examine_status==='0'">未审核</span>
                        <span v-else-if="scope.row.examine_status==='1'">审核通过</span>
                        <span v-else-if="scope.row.examine_status==='2'">审核失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">
                        <span v-if="scope.row.send_status==='0'">未捐赠</span>
                        <span v-else-if="scope.row.send_status==='1'">捐赠中</span>
                        <span v-else-if="scope.row.send_status==='2'">已捐赠</span>
                    </template>
                </el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.image"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="物资名称">
                    <el-input v-model="form.m_name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.info"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.current_address"></el-input>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="form.r_address"></el-input>
                </el-form-item>
                <el-form-item label="捐赠状态">
                    <el-select v-model="form.send_status">
                        <el-option value="0" label="未捐赠"></el-option>
                        <el-option value="1" label="捐赠中"></el-option>
                        <el-option value="2" label="已捐赠"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="form.examine_status">
                        <el-option value="0" label="未审核"></el-option>
                        <el-option value="1" label="审核成功"></el-option>
                        <el-option value="2" label="审核失败"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                        class="avatar-uploader"
                        action="https://nu50abw.hn3.mofasuidao.cn/donation/index.php/admin/index/img"
                        name="image"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                    >
                        <img v-if="form.image" :src="form.image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
import { get,save,del } from '../../../api/material';
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
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        handleAvatarSuccess(res) {
            this.form.image = this.$imgPath+res.data;
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
            this.goDel(this.multipleSelection.map(row=>row.id));
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
                if (res.status == 1) {
                    this.$message.success(`修改成功`);
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
</style>
