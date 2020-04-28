<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="180px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{formatDate(scope.row.display_time)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="190">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <router-link :to="'/article/edit/'+scope.row._id">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
            </el-col>
            <el-col :span="12">
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="openDialog(scope.row._id)"
              >删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除这篇文章？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteNews()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />-->
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "ArticleList",
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      dialogVisible: false,
      newsId: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      let param = {
        page: 1
      };
      this.$api.fetchGet("/news", param).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    deleteNews() {
      let url = "/news/" + this.newsId;
      this.$api.fetchDelete(url).then(response => {     
        this.dialogVisible = false;
        this.getList();
      });
    },
    openDialog(id) {
      this.newsId = id;
      this.dialogVisible = true;
    },
    formatDate(date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm') : null
    },
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
