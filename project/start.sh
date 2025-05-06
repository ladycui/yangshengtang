#!/bin/bash

# 配置区
APP_NAME="yangshengtang-list"  # 自定义进程名
LOG_FILE="yst.log"
ERROR_LOG_FILE="yst.error.log"

# 核心技巧：通过启动子Shell伪装进程名
(nohup bash -c "exec -a '$APP_NAME' node server.js" >> "$LOG_FILE" 2>> "$ERROR_LOG_FILE" &)