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
    label: '消费者',
    prop: 'caller',
    type: 'select',
    search: true,
    dicUrl:"/admin/resource/services",
    slot: true,
    span: 24
  }, {
    label: '生产者',
    search: true,
    prop: 'provider',
    type: 'select',
    formslot: true,
    slot: true,
    overHidden: true,
    dicUrl:"/admin/resource/services",
    span: 24,
  }, {
    label: '调用总数',
    prop: 'total',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
  }, {
    label: '成功次数',
    prop: 'success',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
  }, {
    label: '失败次数',
    prop: 'failure',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
  } , {
    label: '采集间隔时间(ms)',
    prop: 'interval',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 30,
  } , {
    label: 'rpc方法调用计数',
    prop: 'methodDetail',
    formslot: true,
    slot: true,
    hide: true,
    overHidden: true,
    span: 24,
  }, {
      label: 'rpc接口调用计数',
      prop: 'serviceDetail',
      formslot: true,
      slot: true,
      hide: true,
      overHidden: true,
      span: 24,
    },{
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
