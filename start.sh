#!/bin/bash

cd project
echo "正在启动健康资源列表项目..."
echo "服务器将在 http://localhost:8081 上运行"
# node server.js 

nohup node server.js > ../project/yst.log 2>&1 &