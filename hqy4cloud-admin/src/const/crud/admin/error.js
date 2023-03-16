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
    label: '服务',
    type:'select',
    prop: 'serviceName',
    search: true,
    slot: true,
    width: 350,
    span: 24,
    dicUrl:"/admin/resource/services"
  }, {
    label: '类型',
    search: true,
    type: 'select',
    prop: 'type',
    slot: true,
    overHidden: true,
    span: 24,
    width: 100,
    dicData: [{
      label: 'WEB',
      value: "WEB"
    }, {
      label: 'RPC',
      value: "RPC"
    }, {
      label: 'WEBSOCKET',
      value: "WEBSOCKET"
    }],
  }, {
    label: 'url',
    prop: 'url',
    search: true,
    slot: true,
    overHidden: true,
    span: 24,
  },{
    label: 'ip',
    prop: 'ip',
    search: true,
    slot: true,
    overHidden: true,
    span: 24,
    width: 150,
  }, {
    label: '环境',
    prop: 'environment',
    search: true,
    slot: true,
    overHidden: true,
    span: 24,
    width: 100,
    type: 'select',
    dicData: [{
      label: '开发环境',
      value: "dev"
    }, {
      label: '测试环境',
      value: "test"
    }, {
      label: '生产环境',
      value: "prod"
    }]
  }, {
    label: '错误码',
    prop: 'resultCode',
    formslot: true,
    slot: true,
    overHidden: true,
    hide: true,
    span: 24
  }  , {
    label: '异常类',
    prop: 'exceptionClass',
    formslot: true,
    slot: true,
    search: true,
    overHidden: true,
    span: 24
  } , {
    label: '异常堆栈',
    prop: 'stackTrace',
    type: 'textarea',
    formslot: true,
    hide: true,
    slot: true,
    overHidden: true,
    span: 24
  } , {
    width: 210,
    label: '创建时间',
    prop: 'created',
    type: 'datetime',
    format: 'YYYY-MM-DD hh:mm:ss',
    // valueFormat: 'YYYY-MM-DD HH:mm:ss',
    // rangeSeparator: '-',
    // search: true,
    searchRange: true,
    editDisabled: true,
    span: 24
  }
  ]
}
