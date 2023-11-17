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
    label: '资源名称',
    prop: 'name',
    search: true,
    slot: true,
    span: 24,
    rules: [{
      required: true,
      message: '资源名称不能为空',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 40,
      message: '长度在 3 到 40 个字符',
      trigger: 'blur'
    }]
  }, {
    width: 400,
    label: '路径',
    prop: 'path',
    span: 24,
    rules: [{
      required: true,
      message: '资源路径不能为空',
      trigger: 'blur'
    },
      {
        min: 3,
        max: 50,
        message: '长度在 3 到 50 个字符',
        trigger: 'blur'
      }
    ]
  } ,{
    width: 100,
    label: '方法',
    type: 'select',
    prop: 'method',
    span: 24,
    rules: [{
      required: false,
      message: '',
      trigger: 'blur'
    }],
    dicData: [{
      label: 'GET',
      value: "GET"
    }, {
      label: 'POST',
      value: "POST"
    },{
      label: 'PUT',
      value: "PUT"
    }, {
      label: 'DELETE',
      value: "DELETE"
    }],
  } ,  {
    width: 200,
    label: '权限',
    prop: 'permission',
    rules: [{
      required: false,
      message: '',
      trigger: 'blur'
    }
    ]
  }, {
    label: '状态',
    prop: 'status',
    type: 'radio',
    formslot: true,
    slot: true,
    border: true,
    span: 24,
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
  }
  ]
}
