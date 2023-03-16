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
import { isExsit } from '@/api/admin/user'

export const validateUsername = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户名'))
  }
  const flag = new RegExp(/^([a-z\d]+?)$/).test(value)
  if (!flag) {
    callback(new Error('用户名支持小写英文、数字'))
  }

  if (window.boxType === 'edit') {
    return callback()
  }

  isExsit({ username: value }).then(response => {
    const result = response.data.data
    if (result) {
      return callback(new Error('用户名已经存在'))
    } else {
      return callback()
    }
  })
}

// 设置密码校验规则
export const checkPassword = (rule, value, callback) => {
  if (window.boxType === 'edit') {
    return callback()
  }
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length <= 6) {
    callback(new Error('请输入6位以上密码'))
  } else {
    callback()
  }
}

// 设置手机号的验证规则
export const checkPhone = (rule, value, callback) => {
  if (!value) {
    // callback(new Error('请输入手机号'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (!reg.test(value)) {
      return callback(new Error('请输入正确的电话'))
    }
  }

  if (window.boxType === 'edit') {
    return callback()
  }

  isExsit({ phone: value }).then(response => {
    const result = response.data.data
    if (result) {
      return callback(new Error('手机号已经存在'))
    } else {
      return callback()
    }
  })
}

// 设置邮箱的验证规则
export const checkEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else {
    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (!reg.test(value)) {
      return callback(new Error('请输入正确的邮箱'))
    }
  }

  if (window.boxType === 'edit') {
    return callback()
  }

  isExsit({ email: value }).then(response => {
    const result = response.data.data
    if (result) {
      return callback(new Error('邮箱已经存在'))
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
  searchMenuSpan: 6,
  dialogWidth: '50%',
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  column: [{
    fixed: true,
    label: 'id',
    prop: 'id',
    span: 24,
    hide: true,
    editDisplay: false,
    addDisplay: false
  }, {
    fixed: true,
    label: '用户名',
    prop: 'username',
    editDisabled: true,
    slot: true,
    search: true,
    span: 24,
    rules: [{
      required: true,
      message: '请输入用户名'
    },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    },
    { validator: validateUsername, trigger: 'blur' }
    ]
  },
    {
    label: '密码',
    prop: 'password',
    type: 'password',
    value: '',
    hide: true,
    span: 24,
    rules: [{ validator: checkPassword, trigger: 'blur' }]
  },  {
    label: '手机号',
    prop: 'phone',
    value: '',
    editDisabled: false,
    span: 24,
    rules: [{
      required: false,
      message: '手机号不能为空',
      trigger: 'blur'
    }, {
      validator: checkPhone,
      trigger: 'blur'
    }]
  }, {
      label: '邮箱',
      prop: 'email',
      editDisabled: false,
      value: '',
      span: 24,
      rules: [{
        required: true,
        message: '邮箱不能为空',
        trigger: 'blur'
      }, {
        validator: checkEmail,
        trigger: 'blur'
      }]
    }, {
    label: '角色',
    prop: 'role',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择角色',
      trigger: 'blur'
    }]
  },
    {
    label: '状态',
    prop: 'status',
    type: 'radio',
    slot: true,
    border: true,
    span: 24,
    // dicUrl: '/admin/dict/key/user_lock_flag',
    dicData: [{
      label: '启用',
      value: "true"
    }, {
      label: '禁用',
      value: "false"
    }],
    rules: [{
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }]
  }, {
    width: 160,
    label: '创建时间',
    prop: 'created',
    type: 'datetime',
    format: 'YYYY-MM-DD hh:mm:ss',
    editDisabled: true,
    addDisplay: false,
    span: 24
  }]
}
