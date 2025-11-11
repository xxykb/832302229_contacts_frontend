module.exports = {
    devServer: {
        port: 3000, // 设置前端运行端口为3000，与后端CORS配置保持一致
        proxy: {
            '/api': {
                target: 'http://localhost:8081', // Spring Boot 后端地址
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': '/api' // 保持路径不变
                }
            }
        }
    }
}