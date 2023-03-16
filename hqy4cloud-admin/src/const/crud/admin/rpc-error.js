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
    label: '服务名',
    prop: 'application',
    type: 'select',
    search: true,
    dicUrl:"/admin/resource/services",
    slot: true,
    span: 24
  }, {
    label: '接口名',
    search: true,
    prop: 'serviceClassName',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
  }, {
    label: 'RPC方法',
    prop: 'method',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
  }, {
    label: '类型',
    prop: 'type',
    type: 'select',
    formslot: true,
    slot: true,
    overHidden: true,
    search: true,
    span: 24,
    dicData: [ {
      label: '慢RPC',
      value: "slow"
    }, {
      label: '错RPC',
      value: "error"
    }]
  }, {
    label: '信息',
    prop: 'message',
    formslot: true,
    type: 'textarea',
    slot: true,
    overHidden: true,
    span: 24,
  } , {
    label: '请求耗时',
    prop: 'elapsed',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
  },{
    label: '请求时间',
    prop: 'requestTime',
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
