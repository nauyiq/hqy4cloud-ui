/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import { checkLevel, checkRoleName } from '@/api/admin/role'

export const validateLevel = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入权限等级'))
  }

  checkLevel({ level: value }).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.result
    if (!result) {
      return callback(new Error('当前权限等级超过用户可设置级别'))
    } else {
      return callback()
    }
  })
}

export const validateRoleName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入角色名'))
  }
  checkRoleName( value ).then(response => {
    if (window.boxType === 'edit') callback()
    debugger
    const result = response.data.result
    if (!result) {
      return callback(new Error('该角色名已经存在'))
    } else {
      return callback()
    }
  })
}

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  indexWidth: 60,
  stripe: true,
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  searchMenuSpan: 6,
  menuWidth: 300,
  dialogWidth: '50%',
  align: 'center',
  addBtn: false,
  viewBtn: true,
  column: [{
    label: '角色名称',
    prop: 'name',
    span: 24,
    editDisabled: true,
    rules: [{
      required: true,
      message: '角色名称不能为空',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    }/*{ validator: validateRoleName, trigger: 'blur' }*/]
  }, {
    width: 500,
    label: '备注',
    prop: 'note',
    span: 24,
    rules: [{
      required: false,
      message: '角色标识不能为空',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    }
    ]
  },  {
    width: 120,
    label: '角色级别',
    prop: 'level',
    type: 'number',
    rules: [{
      required: true,
      message: '角色级别不能为空',
      trigger: 'blur'
    }
      /*{ validator: validateLevel, trigger: 'blur' }*/
    ]
  }, {
    label: '创建时间',
    prop: 'created',
    type: 'datetime',
    format: 'YYYY-MM-DD HH:mm',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    editDisplay: false,
    addDisplay: false,
    span: 24
  }]
}
