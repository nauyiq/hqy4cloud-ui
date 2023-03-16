<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model:page="page"
        v-model="form"
        :option="tableOption"
        :before-open="handleOpenBefore"
        :data="list"
        :table-loading="listLoading"
        @on-load="getList"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-change="handleFilter"
        @refresh-change="handleRefreshChange"
        @row-update="update"
        @row-save="create">

        <template #menu-left="{}">
          <el-button
            v-if="permissions.sys_blog_type_add"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="$refs.crud.rowAdd()">添加
          </el-button>
        </template>

        <template #name="scope">
            <el-tag>{{ scope.row.name}} </el-tag>
        </template>

        <template #status="scope">
          <dict-tag :options="scope.dic" :value="scope.row.status" />
        </template>

        <template #menu="{row,index,size}">
          <el-button
            v-if="permissions.sys_blog_type_edit"
            text
            type="primary"
            icon="el-icon-edit"
            :size="size"
            @click="handleUpdate(row,index)">编辑
          </el-button>
          <el-button
            v-if="permissions.sys_blog_type_del"
            text
            type="primary"
            icon="el-icon-delete"
            :size="size"
            @click="handleDelete(row,index)">删除
          </el-button>
        </template>

      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/type'
import { typeList } from '@/api/admin/type'
import { tableOption } from '@/const/crud/admin/type'
import { mapGetters } from 'vuex'

export default {
  name: 'TableType',
  data() {
    return {
      searchForm: {},
      tableOption: tableOption,
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      list: [],
      listLoading: true,
      form: {},
      resourceId: undefined,
      roleCode: undefined,
      dialogPermissionVisible: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    type() {
      this.form.typeName = this.type
    }
  },
  methods: {
    getList(page, params) {
      this.listLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.list = response.data.data.resultList
        this.page.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    handleFilter(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    cancal() {
      this.dialogPermissionVisible = false
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    handleOpenBefore(show, type) {
      window.boxType = type
      typeList().then(response => {
        this.typesOptions = response.data.data
      })
      // 若是编辑、查看回显角色名称
      if (['edit', 'views'].includes(type)) {
        this.type = this.form.typeName
      } else if (type === 'add') {
        // 若是添加角色列表设置为空
        this.type = ''
        this.form.status = 'true'
      }
      show()
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除类型名为"' + row.name + '"' + '"的类型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(() => {
        this.getList(this.page)
        this.$notify.success('删除成功')
      })
    },
    create(row, done, loading) {
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      addObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('创建成功')
      }).catch(() => {
        loading()
      })
    },
    update(row, index, done, loading) {
      putObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('修改成功')
      }).catch(() => {
        loading()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;

    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }

  .el-form-item__content {
    margin-left: 20% !important;
  }
}
</style>
