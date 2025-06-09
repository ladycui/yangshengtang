const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'audit.log');
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_BACKUP_FILES = 10;

/**
 * 检查并执行日志轮转
 * 当 audit.log 文件超过 MAX_LOG_SIZE 时触发
 */
function rotateLogs() {
    try {
        // 1. 检查主日志文件是否存在且大小是否超限
        if (!fs.existsSync(LOG_FILE) || fs.statSync(LOG_FILE).size < MAX_LOG_SIZE) {
            return; // 文件不存在或大小未超限，无需轮转
        }

        // 2. 轮转备份文件：从最老的备份文件开始 (audit.log.10 -> audit.log.9 -> ... -> audit.log.1)
        // 为了避免覆盖，我们从后往前重命名
        for (let i = MAX_BACKUP_FILES - 1; i >= 1; i--) {
            const currentPath = `${LOG_FILE}.${i}`;
            const newPath = `${LOG_FILE}.${i + 1}`;
            
            if (fs.existsSync(currentPath)) {
                fs.renameSync(currentPath, newPath);
            }
        }

        // 3. 将当前的主日志文件归档为 .1
        fs.renameSync(LOG_FILE, `${LOG_FILE}.1`);

    } catch (err) {
        console.error('Error during log rotation:', err);
    }
}

/**
 * 写入单条审计日志
 * @param {string} message 要记录的日志消息
 */
function writeLog(message) {
    try {
        // 每次写入前都检查是否需要轮转
        rotateLogs();
        
        // 以追加模式写入日志，并在末尾添加换行符
        fs.appendFileSync(LOG_FILE, message + '\n');

    } catch (err) {
        console.error('Failed to write to audit log:', err);
    }
}

module.exports = { writeLog };