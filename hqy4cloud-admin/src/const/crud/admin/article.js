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
    viewBtn: false,
    column: [{
        label: '标题',
        prop: 'title',
        search: true,
        slot: true,
        width: 350,
        rules: [{
            required: true,
            message: '文章标题不能为空',
            trigger: 'blur'
        },
            {
                min: 5,
                max: 40,
                message: '长度在 5 到 40 个字符',
                trigger: 'blur'
            }]
    }, {
        search: true,
        width: 600,
        label: '描述',
        type: 'textarea',
        prop: 'description',
        formslot: true,
        slot: true,
        overHidden: true,
        span: 24,
        rules: [{
            required: true,
            message: '文章描述不能为空',
            trigger: 'blur'
        },
            {
                min: 10,
                max: 400,
                message: '长度在 10 到 400 个字符',
                trigger: 'blur'
            }]
    }, {
        label: '类型',
        prop: 'type',
        formslot: true,
        slot: true,
        overHidden: true,
        width: 200,

    }, {
        label: '封面',
        prop: 'cover',
        accept: "png/jpg",
        row: true,
        type: 'upload',
        hide: true,
        span: 24,
        limit: 10,
        propsHttp: {
            name: 'fileName',
            res: 'data',
            url: 'path'
        },
        action: '/admin/blog/upload/image',
        listType: 'picture-img'
    },  {
        label: '背景音乐名',
        prop: 'backgroundMusicName',
        hide: true,
        // span: 24,
        width: 300,
        formslot: true,
        slot: true,
        overHidden: true,
        rules: [{
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
        }]
    }, {
        label: '背景音乐',
        prop: 'backgroundMusic',
        type: 'upload',
        hide: true,
        span: 24,
        formslot: true,
        slot: true,
        overHidden: true,
        propsHttp: {
            name: 'fileName',
            res: 'data',
            url: 'path'
        },
        action: '/admin/blog/upload/music'
    }, {
        label: '内容',
        prop: 'content',
        hide: true,
        span: 24,
        formslot: true,
        slot: true,
        overHidden: true,
        rules: [{
            required: true,
            message: '文章内容不能为空',
            trigger: 'blur'
        }]
    }, {
        label: '状态',
        prop: 'status',
        type: 'radio',
        slot: true,
        border: true,
        width: 120,
        // span: 15,
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
