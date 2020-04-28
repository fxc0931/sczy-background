<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布</el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">保存草稿</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 20px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.author" placeholder="请输入作者名字" />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.display_time"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择时间和日期"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="摘要:">
          <el-input
            v-model="postForm.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入摘要"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/SingleImage3";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import { fetchArticle } from "@/api/article";
import { searchUser } from "@/api/remote-search";
// import Warning from './Warning'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  content: "", // 文章内容
  content_short: "", // 文章摘要
  image_uri: "", // 文章图片
  display_time: "" // 前台展示时间
};

export default {
  name: "ArticleDetail",
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必填项",
          type: "error"
        });
        callback(new Error(rule.field + "为必填项"));
      } else {
        callback();
      }
    };
    return {
      newsId: 0,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {}
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length;
    }
  },
  created() {
    if (this.isEdit) {
      this.newsId = this.$route.params && this.$route.params.id;
      this.fetchData(this.newsId);
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(id) {
      let url = "/news/" + id;
      this.$api.fetchGet(url).then(response => {
        this.postForm.title = response.data.title;
        this.postForm.content_short = response.data.content_short;
        this.postForm.content = response.data.content;
        this.postForm.image_uri = response.data.image_uri;
        this.postForm.display_time = response.data.display_time;
        this.postForm.author = response.data.author;
      });
    },
    setTagsViewTitle() {
      const title = "Edit Article";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Article";
      document.title = `${title} - ${this.postForm.id}`;
    },
    submitForm() {
      //   console.log(this.postForm);
      //     const AllDataFields = {
      //     author: 'fx',
      //     content: '"<p>dsfsf</p><p><audio style="display: none;" controls="controls"></audio></p>"',
      //     content_short: 'fxcfxc',
      //     image_uri: 'string is too large to edit',
      //     title: 'FXC',
      //     status: 'published',
      //     display_time: '2012'
      // }
      //   this.$api.fetchPost('/news/add', AllDataFields).then((response) => {

      //   })
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postForm.status = "已发布";
          if (!this.isEdit) {
            this.$api.fetchPost("/news/add", this.postForm).then(response => {
              this.$notify({
                title: "成功",
                message: "发布文章成功",
                type: "success",
                duration: 2000
              });
              this.loading = false;
            });
          } else {
            let url = "/news/edit/" + this.newsId;
            this.$api.fetchPut(url, this.postForm).then(response => {
              this.$notify({
                title: "成功",
                message: "发布文章成功",
                type: "success",
                duration: 2000
              });
              this.loading = false;
              // Object.assign(this.postForm , defaultForm)
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning"
        });
        return;
      }
      this.postForm.status = "草稿";
      if (!this.isEdit) {
        this.$api.fetchPost("/news/add", this.postForm).then(response => {
          this.$message({
            message: "保存成功",
            type: "success",
            showClose: true,
            duration: 1000
          });
        });
      } else {
        let url = "/news/edit/" + this.newsId;
        this.$api.fetchPut(url, this.postForm).then(response => {
          this.$message({
            message: "保存成功",
            type: "success",
            showClose: true,
            duration: 1000
          });
          // Object.assign(this.postForm , defaultForm)
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 0px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
