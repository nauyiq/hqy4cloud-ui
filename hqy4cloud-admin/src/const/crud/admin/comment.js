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
    label: '文章id',
    prop: 'articleId',
    search: true,
    slot: true,
    width: 350
  }, {
    search: true,
    width: 500,
    label: '内容',
    type: 'textarea',
    prop: 'content',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24
  }, {
    label: '评论人',
    prop: 'commentName',
    formslot: true,
    slot: true,
    overHidden: true,
    // span: 24,
    width: 161
  }, {
    label: '回复人',
    prop: 'replyName',
    formslot: true,
    slot: true,
    overHidden: true,
    // span: 24,
    width: 161
  }, {
    label: '评论层级',
    prop: 'level',
    formslot: true,
    slot: true,
    overHidden: true,
    // span: 24,
    width: 100
  } , {
    width: 210,
    label: '创建时间',
    prop: 'created',
    type: 'datetime',
    format: 'YYYY-MM-DD hh:mm:ss',
    editDisabled: true,
    addDisplay: false,
    span: 24
  }
  ]
}
