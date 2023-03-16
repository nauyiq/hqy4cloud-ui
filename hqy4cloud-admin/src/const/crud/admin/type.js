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
        label: '类型名',
        prop: 'name',
        search: true,
        row: true,
        slot: true,
        span: 36,
        rules: [{
            required: true,
            message: '文章类型名不能为空',
            trigger: 'blur'
        },
            {
                min: 2,
                max: 20,
                message: '长度在 2 到 20 个字符',
                trigger: 'blur'
            }]
    }, {
        label: '状态',
        prop: 'status',
        type: 'radio',
        row: true,
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
    }, {
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
