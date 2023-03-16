import axios from '../utils/request.js'

// 新增评论
export const add = data => axios.post('/api/articleWord/addComment', data)

// 获取评论列表
export const list = data => axios.get('/blog/comments/' + data.articleId + "?pageSize=" + data.pageSize + "&pageNumber=" + data.pageNum)

// 评论文章
export const articleComment = (data) => axios.post('/blog/article/comment', data)

// 删除文章
export const deleteComment = (commentId) => axios.delete("/blog/comment/" + commentId)