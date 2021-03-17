<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 受捐人信息管理
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
                <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="id" label="ID" width="85" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="85"></el-table-column>
                <el-table-column prop="age" label="年龄" width="55"></el-table-column>
                <el-table-column label="性别" width="55">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex==='1'">男</span>
                        <span v-else-if="scope.row.sex==='2'">女</span>
                        <span v-else>未选择</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="info" label="简介"></el-table-column>
                <!-- <el-table-column label="内容">
                    <template slot-scope="scope">
                        {{scope.row.content}}
                    </template>
                </el-table-column> -->
                <el-table-column prop="address" label="受捐人地址"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="轮播图">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.banner_image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="轮播状态" width="75">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==='2'">展示</span>
                        <span v-else>不展示</span>
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
                            @click="handleDelete(scope.row.id)"
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="800px">
            <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex">
                        <el-option value="0" label="未选择"></el-option>
                        <el-option value="1" label="男"></el-option>
                        <el-option value="2" label="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="form.age"></el-input>
                </el-form-item>
                <el-form-item label="受捐人地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                        class="avatar-uploader"
                        action="https://nu50abw.hn3.mofasuidao.cn/donation/index.php/admin/index/img"
                        name="image"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                    >
                        <img v-if="form.image" :src="form.image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item label="轮播状态">
                    <el-select v-model="form.status">
                        <el-option value="2" label="展示"></el-option>
                        <el-option value="0" label="不展示"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-upload
                        class="avatar-uploader"
                        action="https://nu50abw.hn3.mofasuidao.cn/donation/index.php/admin/index/img"
                        name="image"
                        :show-file-list="false"
                        :on-success="handleBannerSuccess"
                    >
                        <img v-if="form.banner_image" :src="form.banner_image" class="avatar">
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
import { get,save,del } from '../../../api/recipient';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
    name: 'basetable',
    components: {
        quillEditor
    },
    data() {
        return {
            query: {
                id: '',
                name: '',
                page: 1,
                pageSize: 10
            },
            content: '',
            editorOption: {
                placeholder: 'Hello World'
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            initial_form: {
                id: '',
                name: '',
                title: '',
                content: '',
                age: '',
                sex: '',
                address: '',
                status: '',
                image: '',
                banner_image: ''
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
        handleBannerSuccess(res) {
            this.form.banner_image = this.$imgPath+res.data;
        },
        handleSuccess(res) {
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
