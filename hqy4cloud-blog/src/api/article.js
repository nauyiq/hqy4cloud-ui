import axios from '../utils/request.js'

// 新增一篇文章
export const add = data => axios.post('/api/article/addArticle', data)

// 获取文章列表
export const list = data => {
    let url
    if (data.type) {
        url = '/blog/articles?pageSize=' + data.pageSize + '&pageNumber=' + data.pageNum + '&type=' + data.type
    } else {
        url =  '/blog/articles?pageSize=' + data.pageSize + '&pageNumber=' + data.pageNum
    }
    return  axios.get(url)
}

// 获取文章详情
export const detail = (id) => axios.get('/blog/article/' + id)

// 喜欢这篇文章
export const setLike = (articleId) => axios.post('/blog/article/like/' + articleId)

// 文章阅读数 + 1
export const readArticle = (articleId) => axios.post('/blog/article/read/' + articleId)

// 获取文章类型
export const articleTypes = () => axios.get('/blog/article/types')