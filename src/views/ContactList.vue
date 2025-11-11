<template>
  <div class="contact-list">
    <div class="operation-bar">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
        添加联系人
      </el-button>
      <el-input
          v-model="searchKeyword"
          placeholder="输入姓名、电话、邮箱、公司或地址进行搜索"
          style="width: 400px; margin-left: 20px;"
          clearable
          @input="handleSearch"
          @clear="handleSearchClear"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-button-group>
        <el-button
            type="success"
            icon="el-icon-upload"
            @click="handleImport"
            :loading="importing"
            style="margin-left: 10px;"
        >
          导入联系人
        </el-button>
        <el-button
            type="info"
            icon="el-icon-download"
            @click="handleExport"
            :loading="exporting"
        >
          导出联系人
        </el-button>
      </el-button-group>

      <el-button
          style="margin-left: 10px;"
          @click="refreshContacts"
          :loading="loading"
      >
        <i class="el-icon-refresh"></i>
        刷新
      </el-button>
    </div>

    <!-- 导入文件对话框 -->
    <el-dialog
        title="导入联系人"
        :visible.sync="showImportDialog"
        width="400px"
        :close-on-click-modal="false"
    >
      <div class="import-tips">
        <p class="tip-title">导入说明：</p>
        <ul>
          <li>1. 仅支持 .xlsx 格式的Excel文件</li>
          <li>2. 文件第一行为标题行，格式为：姓名,手机号,邮箱,公司,地址</li>
          <li>3. 姓名和手机号为必填项</li>
          <li>4. 手机号必须为11位有效的中国大陆手机号</li>
          <li>5. 邮箱格式必须正确</li>
        </ul>
        <div class="file-upload-area">
          <el-upload
              class="upload-demo"
              ref="upload"
              :headers="{}"
              :action="'#'"
              :on-change="handleFileChange"
              :auto-upload="false"
              :limit="1"
              accept=".xlsx"
            >
            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">请选择 .xlsx 格式的Excel文件</div>
          </el-upload>
          <div v-if="selectedFile" class="selected-file">
            <span>{{ selectedFile.name }}</span>
            <el-button type="text" @click="clearFile" size="small">移除</el-button>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmImport" :loading="importing">
          开始导入
        </el-button>
      </span>
    </el-dialog>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 数据表格 -->
    <el-table
        v-else
        :data="contacts"
        style="width: 100%"
        :empty-text="emptyText"
        v-loading="tableLoading"
    >
      <el-table-column prop="name" label="姓名" width="120" sortable>
        <template slot-scope="scope">
          <span class="contact-name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="电话" width="150">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.phone }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="email" label="邮箱" min-width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.email" class="contact-email">
            {{ scope.row.email }}
          </span>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>

      <el-table-column prop="company" label="公司" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.company">{{ scope.row.company }}</span>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>

      <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.address">{{ scope.row.address }}</span>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
        :title="dialogTitle"
        :visible.sync="showDialog"
        width="600px"
        :close-on-click-modal="false"
        @closed="handleDialogClosed"
    >
      <el-form
          :model="contactForm"
          :rules="rules"
          ref="contactForm"
          label-width="100px"
          label-position="left"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
              v-model="contactForm.name"
              placeholder="请输入联系人姓名"
              maxlength="50"
              show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input
              v-model="contactForm.phone"
              placeholder="请输入11位手机号码"
              maxlength="11"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
              v-model="contactForm.email"
              placeholder="请输入邮箱地址"
              maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="公司" prop="company">
          <el-input
              v-model="contactForm.company"
              placeholder="请输入公司名称"
              maxlength="100"
              show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input
              v-model="contactForm.address"
              type="textarea"
              :rows="3"
              placeholder="请输入详细地址"
              maxlength="200"
              show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false" :disabled="submitting">
          取消
        </el-button>
        <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitting"
        >
          {{ submitting ? '提交中...' : '确定' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import contactService from '../services/contactService'
import { debounce } from 'lodash'

export default {
  name: 'ContactList',
  data() {
    // 邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      if (value && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          callback(new Error('请输入有效的邮箱地址'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      contacts: [],
      searchKeyword: '',
      showDialog: false,
      showImportDialog: false,
      isEditing: false,
      loading: false,
      tableLoading: false,
      submitting: false,
      importing: false,
      exporting: false,
      selectedFile: null,
      contactForm: {
        id: null,
        name: '',
        phone: '',
        email: '',
        company: '',
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 50, message: '姓名长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        company: [
          { max: 100, message: '公司名称不能超过100个字符', trigger: 'blur' }
        ],
        address: [
          { max: 200, message: '地址不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? '编辑联系人' : '添加联系人'
    },
    emptyText() {
      return this.searchKeyword ? `未找到包含"${this.searchKeyword}"的联系人` : '暂无联系人数据'
    }
  },
  mounted() {
    this.loadContacts()
    // 创建防抖搜索函数
    this.debouncedSearch = debounce(this.performSearch, 500)
  },
  methods: {
      // 处理文件选择变化
      handleFileChange(file) {
        this.selectedFile = file.raw
      },

      // 清除选择的文件
      clearFile() {
        this.selectedFile = null
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
      },

      // 打开导入对话框
      handleImport() {
        this.showImportDialog = true
        this.selectedFile = null
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
      },

      // 确认导入
      async confirmImport() {
        if (!this.selectedFile) {
          this.$message.warning('请选择要导入的文件')
          return
        }

        try {
          this.importing = true
          const response = await contactService.importContacts(this.selectedFile)
          
          if (response.data.success) {
            this.$message.success('导入成功')
            this.showImportDialog = false
            await this.loadContacts()
          } else {
            this.$message.error(response.data.message || '导入失败')
          }
        } catch (error) {
          this.$message.error(error.message || '导入失败')
          console.error('导入失败:', error)
        } finally {
          this.importing = false
        }
      },

      // 导出联系人
      async handleExport() {
        try {
          this.exporting = true
          const response = await contactService.exportContacts()
          
          // 创建下载链接
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          
          // 从响应头获取文件名，如果没有则使用默认名
          let fileName = '联系人列表.xlsx'
          const contentDisposition = response.headers['content-disposition']
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/)
            if (match && match[1]) {
              fileName = decodeURIComponent(match[1])
            }
          }
          
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          
          // 清理
          setTimeout(() => {
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
          }, 100)
          
          this.$message.success('导出成功')
        } catch (error) {
          this.$message.error('导出失败')
          console.error('导出失败:', error)
        } finally {
          this.exporting = false
        }
      },

      async loadContacts() {
      this.loading = true
      try {
        const response = await contactService.getAllContacts()
        if (response.data.success) {
          this.contacts = response.data.data || []
        } else {
          this.$message.error(response.data.message || '加载联系人失败')
        }
      } catch (error) {
        this.$message.error(error.message || '加载联系人失败')
        console.error('加载联系人失败:', error)
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      if (this.searchKeyword.trim() === '') {
        this.loadContacts()
      } else {
        this.debouncedSearch()
      }
    },

    handleSearchClear() {
      this.loadContacts()
    },

    async performSearch() {
      if (!this.searchKeyword.trim()) return

      this.tableLoading = true
      try {
        const response = await contactService.searchContacts(this.searchKeyword)
        if (response.data.success) {
          this.contacts = response.data.data || []
        } else {
          this.$message.error(response.data.message || '搜索失败')
        }
      } catch (error) {
        this.$message.error(error.message || '搜索失败')
        console.error('搜索失败:', error)
      } finally {
        this.tableLoading = false
      }
    },

    handleAdd() {
      this.isEditing = false
      this.showDialog = true
    },

    handleEdit(contact) {
      this.isEditing = true
      this.contactForm = { ...contact }
      this.showDialog = true
    },

    async handleDelete(contact) {
      try {
        await this.$confirm(
            `确定要删除联系人 "${contact.name}" 吗？此操作不可恢复。`,
            '删除确认',
            {
              confirmButtonText: '确定删除',
              cancelButtonText: '取消',
              type: 'warning',
              confirmButtonClass: 'el-button--danger'
            }
        )

        this.tableLoading = true
        await contactService.deleteContact(contact.id)

        this.$message.success('删除成功')
        this.loadContacts()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '删除失败')
          console.error('删除失败:', error)
        }
      } finally {
        this.tableLoading = false
      }
    },

    async handleSubmit() {
      try {
        const valid = await this.$refs.contactForm.validate()
        if (!valid) return

        this.submitting = true

        if (this.isEditing) {
          const response = await contactService.updateContact(this.contactForm.id, this.contactForm)
          if (response.data.success) {
            this.$message.success('更新成功')
            this.showDialog = false
            this.loadContacts()
          } else {
            this.$message.error(response.data.message || '更新失败')
          }
        } else {
          const response = await contactService.createContact(this.contactForm)
          if (response.data.success) {
            this.$message.success('添加成功')
            this.showDialog = false
            this.loadContacts()
          } else {
            this.$message.error(response.data.message || '添加失败')
          }
        }
      } catch (error) {
        this.$message.error(error.message || '操作失败')
        console.error('操作失败:', error)
      } finally {
        this.submitting = false
      }
    },

    handleDialogClosed() {
      this.resetForm()
    },

    resetForm() {
      this.contactForm = {
        id: null,
        name: '',
        phone: '',
        email: '',
        company: '',
        address: ''
      }
      this.isEditing = false
      this.submitting = false
      if (this.$refs.contactForm) {
        this.$refs.contactForm.clearValidate()
      }
    },

    async refreshContacts() {
      await this.loadContacts()
      this.$message.success('刷新成功')
    }
  }
}
</script>

<style scoped>
.operation-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.loading-container {
  padding: 20px;
}

.contact-name {
  font-weight: bold;
  color: #409EFF;
}

.contact-email {
  color: #67C23A;
}

.text-muted {
  color: #909399;
  font-style: italic;
}

.el-table {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-dialog__body {
  padding: 20px 30px;
}

/* 导入对话框样式 */
.import-tips {
  line-height: 1.8;
}

.tip-title {
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.import-tips ul {
  margin: 10px 0;
  padding-left: 20px;
  color: #606266;
}

.import-tips li {
  margin-bottom: 5px;
}

.file-upload-area {
  margin-top: 20px;
}

.selected-file {
  margin-top: 10px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #409EFF;
}

.selected-file span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 10px;
}
</style>