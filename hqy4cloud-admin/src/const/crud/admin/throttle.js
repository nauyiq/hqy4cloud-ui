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
    label: '节流方式',
    prop: 'throttleBy',
    type: 'select',
    search: true,
    slot: true,
    span: 24,
    dicData: [{
      label: '请求参数攻击',
      value: "HACK_ACCESS_PARAM"
    }, {
      label: 'URI参数攻击',
      value: "HackAccessURI"
    }, {
      label: '限流控制',
      value: "RedisLimitFlowControl"
    }]
  }, {
    search: true,
    label: 'ip',
    prop: 'ip',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
    width: 125
  }, {
    label: 'url',
    prop: 'url',
    formslot: true,
    search: true,
    slot: true,
    overHidden: true,
    span: 24,
    width: 700
  }, {
    label: '请求体',
    prop: 'accessJson',
    type: 'textarea',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
    hide: true,
    width: 400
  } , {
    label: '封禁时间(s)',
    prop: 'blockedSeconds',
    formslot: true,
    slot: true,

    overHidden: true,
    span: 24
  } , {
    label: '环境',
    prop: 'env',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
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
