// 全局变量存储所有数据
let allData = [];

// 分页变量
let currentPage = 1;
const itemsPerPage = 30;
let seniorCurrentPage = 1;
const seniorItemsPerPage = 10; // 老年人模式每页显示更少的内容

// 老年人模式状态
let isSeniorMode = false;

// 定义预设的标签和对应的关键词（调整了顺序，将重要标签放在前面）
// const predefinedTags = {
//     '脑梗': ['脑梗', '脑梗塞', '脑梗死', '缺血性脑卒中', '脑血栓', '脑缺血'],
//     '颈动脉': ['颈动脉', '颈部血管', '颈动脉斑块', '颈动脉狭窄', '颈动脉硬化'],
//     '脑血管': ['脑血管', '脑动脉', '脑静脉', '脑微血管', '颅内血管', '脑血管瘤', '脑血管病'],
//     '心脏': ['心脏', '心脏病', '心衰', '心肌', '冠心病', '心绞痛', '心律失常', '心肌梗死', '心跳', '心肌炎'],
//     '脑': ['脑', '脑部', '脑出血', '脑中风', '阿尔茨海默', '记忆力', '失智', '痴呆', '老年痴呆'],
//     '高血压': ['高血压', '血压', '降压'],
//     '肝': ['肝', '肝脏', '肝硬化', '肝炎', '脂肪肝'],
//     '心梗': ['心梗', '心肌梗死', '心肌梗塞', '急性心梗', '冠脉堵塞', '心肌缺血', '胸痛', '心绞痛'],
//     '糖尿病': ['糖尿病', '血糖', '胰岛素'],
//     '肺': ['肺', '肺炎', '肺气肿', '慢阻肺', '呼吸', '哮喘'],
//     '肠胃': ['肠', '胃', '消化', '胃炎', '胃溃疡', '肠胃', '肠道', '结肠', '胃酸', '胃痛', '腹泻', '便秘'],
//     '骨关节': ['骨', '关节', '骨质疏松', '骨折', '风湿', '类风湿', '腰椎', '颈椎', '关节炎', '腰痛', '膝盖'],
//     '眼睛': ['眼', '视力', '白内障', '青光眼', '近视', '老花', '结膜炎'],
//     '免疫': ['免疫', '抗病', '过敏', '自身免疫', '抵抗力'],
//     '癌症': ['癌', '肿瘤', '恶性', '白血病', '淋巴瘤', '癌症'],
//     '睡眠': ['睡眠', '失眠', '打鼾', '睡眠呼吸暂停', '睡眠质量'],
//     '皮肤': ['皮肤', '皮疹', '湿疹', '痤疮', '皮炎', '银屑病', '瘙痒'],
//     '饮食': ['饮食', '营养', '膳食', '食疗', '食物', '健康饮食'],
//     '运动': ['运动', '锻炼', '健身', '太极', '跑步', '瑜伽']
// };

let predefinedTags = {
    // ============================================================
    // 核心高频类：数据源中的主力内容
    // ============================================================

    // 【心脑血管】扩充了具体病名，如心衰、脑出血
    '心脑血管': [
        // 核心器官与指标
        '心脏', '血压', '血管', '动脉', '静脉',
        // 常见急症
        '心梗', '脑梗', '中风', '卒中', '脑出血', '心衰', '猝死',
        // 病理基础与检查
        '斑块', '血栓', '早搏', '供血', '硬化', '狭窄',
        // 常见症状
        '晕', '头晕', '眩晕', '胸痛', '麻木'
    ],

    // 【中医养生】扩充了具体的调理手段和病理描述
    '中医_养生': [
        // 核心话题
        '长寿', '养生', '补', '治未病',
        // 中医病理
        '脾', '湿', '寒', '气血', '血瘀', '阴虚', '阳虚', '肾虚', '上火', '痰湿',
        // 调理手段
        '穴位', '经络', '排毒', '药膳',
        // 全身性状况
        '睡', '眠', '失眠', // 睡眠问题常归于中医调理
        '汗' // 盗汗、出汗多
    ],

    // 【肿瘤癌症】扩充了良性病变（息肉、结节）
    '肿瘤_结节': [
        '癌', '瘤', '恶性', // 癌症统称
        '结节', '肺结节',  // 结节类
        '息肉',           // 癌前病变风险
        '囊肿', '增生'
    ],

    // ============================================================
    // 细分系统类：包含具体疾病名称
    // ============================================================

    // 【眼部健康】采纳建议，增加了具体的眼病名
    '眼': [
        '眼',      // 包含眼底、眼花、护眼
        '视力',    // 视力模糊等
        '白内障'   // (新增) 源数据中确有条目
    ],

    // 【肾与泌尿】
    '肾_泌尿': [
        '肾',      // 核心词：补肾、肾衰
        '尿频',    // 症状
        '尿酸',    // 代谢相关
        '前列腺'   // 虽然极少，但属于此类
    ],

    // 【消化系统】扩充了具体的胃肠问题
    '肠胃_消化': [
        '胃', '肠',
        '消化', '便秘', '腹泻', // 常见症状
        '幽门',               // 幽门螺杆菌
        '口'                  // 口苦、口臭
    ],

    // 【呼吸系统】
    '肺_呼吸': [
        '肺',
        '咳', '喘', '痰',     // 典型症状
        '呼吸',
        '感冒', '慢阻肺'      // 具体疾病
    ],

    // 【骨科疼痛】扩充了具体骨骼问题
    '骨关节': [
        '骨', '关节',
        '腰', '膝', '腿', '颈椎', '脊柱', // 具体部位
        '痛', '疼',                     // 症状
        '骨质疏松', '骨刺'               // 具体病名
    ],

    // 【代谢内分泌】
    '三高_代谢': [
        '糖尿病', '血糖', '胰岛素',
        '血脂', '胆固醇', '甘油三酯',
        '痛风', '肥胖'
    ],

    // 【肝胆】
    '肝胆': [
        '肝', '胆',
        '解毒'
    ],

    // ============================================================
    // 生活方式与外在
    // ============================================================

    '饮食_营养': [
        '吃', '食', '菜', '膳', // 怎么吃、吃什么
        '油', '盐',            // 调料控制
        '茶', '酒'
    ],

    '皮肤': [
        '皮肤', '痒', '疹'
    ]
};
// 老年人模式中优先显示的标签（筛选最关注的健康问题）
const prioritySeniorTags = ['中医_养生', '心脑血管', '肿瘤_结节', '骨关节', '肠胃_消化', '肾_泌尿', '饮食_营养', '三高_代谢', '肺_呼吸', '眼'];
// ['脑梗', '脑', '颈动脉', '脑血管', '心梗', '睡眠', '心脏', '高血压', '糖尿病', '骨关节', '眼睛'];

// 当前选定的标签
let selectedTags = [];
let seniorSelectedTags = [];

// 初始化函数
async function init() {
    try {
        // 显示加载指示器
        document.getElementById('loading').style.display = 'block';
        document.getElementById('seniorLoading').style.display = 'block';

        // 加载所有年份的数据
        // 定义年份列表（按时间倒序）
        const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

        // 1. 优先加载最新年份（2025）的数据
        const latestYear = years[0];
        const latestData = await fetchYearData(latestYear);

        if (latestData.length > 0) {
            const yearData = latestData.map(item => ({
                ...item,
                year: latestYear,
                tags: assignTagsToItem(item)
            }));
            allData = [...allData, ...yearData];
        }

        // 初始化UI（使用第一批数据）
        createTagFilters();
        createSeniorTagFilters();

        currentPage = 1;
        seniorCurrentPage = 1;

        updateTable();
        updateSeniorView();

        // 隐藏加载指示器
        document.getElementById('loading').style.display = 'none';
        document.getElementById('seniorLoading').style.display = 'none';

        // 2. 后台加载剩余年份的数据
        loadRemainingYears(years.slice(1));



        // 添加搜索和筛选事件监听器（标准模式）
        document.getElementById('searchInput').addEventListener('input', () => {
            currentPage = 1; // 搜索时重置到第一页
            updateTable();
        });

        document.getElementById('yearFilter').addEventListener('change', () => {
            currentPage = 1; // 筛选时重置到第一页
            updateTable();
        });

        // 添加分页按钮事件监听（标准模式）
        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateTable();
                window.scrollTo(0, 0); // 回到顶部
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const filteredData = getFilteredData();
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateTable();
                window.scrollTo(0, 0); // 回到顶部
            }
        });

        // 添加老年人模式搜索事件监听
        document.getElementById('seniorSearchInput').addEventListener('input', () => {
            seniorCurrentPage = 1; // 搜索时重置到第一页
            updateSeniorView();
        });

        // 添加老年人模式分页事件监听
        document.getElementById('seniorPrevPage').addEventListener('click', () => {
            if (seniorCurrentPage > 1) {
                seniorCurrentPage--;
                updateSeniorView();
                window.scrollTo(0, 0); // 回到顶部
            }
        });

        document.getElementById('seniorNextPage').addEventListener('click', () => {
            const filteredData = getSeniorFilteredData();
            const totalPages = Math.ceil(filteredData.length / seniorItemsPerPage);
            if (seniorCurrentPage < totalPages) {
                seniorCurrentPage++;
                updateSeniorView();
                window.scrollTo(0, 0); // 回到顶部
            }
        });

        // 添加模式切换按钮事件监听
        document.getElementById('seniorModeToggle').addEventListener('click', toggleSeniorMode);

    } catch (error) {
        console.error('初始化失败:', error);
        document.getElementById('loading').textContent = '加载数据失败，请刷新页面重试。';
        document.getElementById('seniorLoading').textContent = '加载数据失败，请刷新页面重试。';
    }
}

// 后台加载剩余年份数据
async function loadRemainingYears(years) {
    for (const year of years) {
        try {
            const data = await fetchYearData(year);
            if (data.length > 0) {
                const yearData = data.map(item => ({
                    ...item,
                    year: year,
                    tags: assignTagsToItem(item)
                }));
                allData = [...allData, ...yearData];

                // 每次加载完一年，更新一次UI以反映新数据（更新总数和搜索范围）
                // 保持当前页码不变，避免用户阅读时跳变，但在搜索结果中能看到新数据
                updateTable();
                updateSeniorView();
            }
        } catch (err) {
            console.warn(`后台加载 ${year} 年数据失败:`, err);
        }
    }
}

// 切换老年人模式
function toggleSeniorMode() {
    isSeniorMode = !isSeniorMode;

    // 切换显示视图
    document.getElementById('standardView').style.display = isSeniorMode ? 'none' : 'block';
    document.getElementById('seniorView').style.display = isSeniorMode ? 'block' : 'none';

    // 更新按钮文本
    const modeBtn = document.getElementById('seniorModeToggle');
    if (isSeniorMode) {
        modeBtn.innerHTML = '<span class="senior-mode-icon">A</span><span class="senior-mode-text">标准模式</span>';
        modeBtn.style.backgroundColor = '#e74c3c';
        updateSeniorView(); // 更新老年人视图
    } else {
        modeBtn.innerHTML = '<span class="senior-mode-icon">A</span><span class="senior-mode-text">老年人模式</span>';
        modeBtn.style.backgroundColor = '#3498db';
        updateTable(); // 更新标准视图
    }
}

// 获取指定年份的数据
async function fetchYearData(year) {
    try {
        const response = await fetch(`../yst_data/yst_${year}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`加载 ${year} 年数据失败:`, error);
        return [];
    }
}

// 为条目分配标签
function assignTagsToItem(item) {
    if (!item.title) return [];

    const title = item.title.toLowerCase();
    const itemTags = [];

    // 遍历预定义标签，检查标题是否包含关键词
    for (const [tag, keywords] of Object.entries(predefinedTags)) {
        // 如果标题包含任何该标签的关键词，则添加该标签
        if (keywords.some(keyword => title.includes(keyword.toLowerCase()))) {
            itemTags.push(tag);
        }
    }

    return itemTags;
}

// 创建标签过滤器（标准模式）
function createTagFilters() {
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = '';

    // 创建"全部"标签
    const allTagElement = document.createElement('span');
    allTagElement.textContent = '全部';
    allTagElement.className = 'tag active';
    allTagElement.dataset.tag = 'all';
    allTagElement.addEventListener('click', handleTagClick);
    tagsContainer.appendChild(allTagElement);

    // 创建其他标签
    Object.keys(predefinedTags).forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.textContent = tag;
        tagElement.className = 'tag';
        tagElement.dataset.tag = tag;
        tagElement.addEventListener('click', handleTagClick);
        tagsContainer.appendChild(tagElement);
    });
}

// 创建老年人模式标签过滤器
function createSeniorTagFilters() {
    const seniorTagsContainer = document.getElementById('seniorTagsContainer');
    seniorTagsContainer.innerHTML = '';

    // 创建"全部"标签
    const allTagElement = document.createElement('span');
    allTagElement.textContent = '全部';
    allTagElement.className = 'senior-tag active';
    allTagElement.dataset.tag = 'all';
    allTagElement.addEventListener('click', handleSeniorTagClick);
    seniorTagsContainer.appendChild(allTagElement);

    // 创建优先标签（老年人关注的主要健康问题）
    prioritySeniorTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.textContent = tag;
        tagElement.className = 'senior-tag';
        tagElement.dataset.tag = tag;
        tagElement.addEventListener('click', handleSeniorTagClick);
        seniorTagsContainer.appendChild(tagElement);
    });
}

// 处理标签点击（标准模式）
function handleTagClick(event) {
    const tag = event.target.dataset.tag;
    const allTags = document.querySelectorAll('.tag');

    // 如果点击的是"全部"标签
    if (tag === 'all') {
        selectedTags = [];
        allTags.forEach(t => {
            if (t.dataset.tag === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
    } else {
        // 取消"全部"标签的激活状态
        document.querySelector('.tag[data-tag="all"]').classList.remove('active');

        // 切换当前标签的激活状态
        event.target.classList.toggle('active');

        // 更新选定的标签数组
        if (event.target.classList.contains('active')) {
            if (!selectedTags.includes(tag)) {
                selectedTags.push(tag);
            }
        } else {
            selectedTags = selectedTags.filter(t => t !== tag);
        }

        // 如果没有选中任何标签，激活"全部"标签
        if (selectedTags.length === 0) {
            document.querySelector('.tag[data-tag="all"]').classList.add('active');
        }
    }

    // 重置到第一页并更新表格
    currentPage = 1;
    updateTable();
}

// 处理老年人模式标签点击
function handleSeniorTagClick(event) {
    const tag = event.target.dataset.tag;
    const allTags = document.querySelectorAll('.senior-tag');

    // 如果点击的是"全部"标签
    if (tag === 'all') {
        seniorSelectedTags = [];
        allTags.forEach(t => {
            if (t.dataset.tag === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
    } else {
        // 取消"全部"标签的激活状态
        document.querySelector('.senior-tag[data-tag="all"]').classList.remove('active');

        // 切换当前标签的激活状态
        event.target.classList.toggle('active');

        // 更新选定的标签数组
        if (event.target.classList.contains('active')) {
            if (!seniorSelectedTags.includes(tag)) {
                seniorSelectedTags.push(tag);
            }
        } else {
            seniorSelectedTags = seniorSelectedTags.filter(t => t !== tag);
        }

        // 如果没有选中任何标签，激活"全部"标签
        if (seniorSelectedTags.length === 0) {
            document.querySelector('.senior-tag[data-tag="all"]').classList.add('active');
        }
    }

    // 重置到第一页并更新视图
    seniorCurrentPage = 1;
    updateSeniorView();
}

// 获取过滤后的数据（标准模式）
function getFilteredData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;

    // 应用筛选条件
    let filteredData = allData;

    // 按年份筛选
    if (yearFilter !== 'all') {
        filteredData = filteredData.filter(item => item.year === yearFilter);
    }

    // 按搜索词筛选
    if (searchTerm) {
        filteredData = filteredData.filter(item =>
            item.title && item.title.toLowerCase().includes(searchTerm)
        );
    }

    // 按标签筛选
    if (selectedTags.length > 0) {
        filteredData = filteredData.filter(item =>
            item.tags && item.tags.some(tag => selectedTags.includes(tag))
        );
    }

    // 按年份降序排列
    filteredData.sort((a, b) => {
        // 首先按年份降序
        if (a.year !== b.year) {
            return b.year - a.year;
        }
        // 如果年份相同，可以按其他字段排序，比如期数
        if (a.issue && b.issue) {
            // 提取期数中的数字部分进行比较
            const aMatch = a.issue.match(/\d+/);
            const bMatch = b.issue.match(/\d+/);
            if (aMatch && bMatch) {
                return parseInt(bMatch[0]) - parseInt(aMatch[0]);
            }
        }
        return 0;
    });

    return filteredData;
}

// 获取过滤后的数据（老年人模式）
function getSeniorFilteredData() {
    const searchTerm = document.getElementById('seniorSearchInput').value.toLowerCase();

    // 应用筛选条件
    let filteredData = allData;

    // 按搜索词筛选
    if (searchTerm) {
        filteredData = filteredData.filter(item =>
            item.title && item.title.toLowerCase().includes(searchTerm)
        );
    }

    // 按标签筛选
    if (seniorSelectedTags.length > 0) {
        filteredData = filteredData.filter(item =>
            item.tags && item.tags.some(tag => seniorSelectedTags.includes(tag))
        );
    }

    // 按年份降序排列，最新的内容优先
    filteredData.sort((a, b) => {
        return b.year - a.year;
    });

    return filteredData;
}

// 更新表格显示（标准模式）
function updateTable() {
    // 获取过滤后的数据
    const filteredData = getFilteredData();

    // 计算分页信息
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 确保当前页在有效范围内
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    // 计算当前页的数据范围
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    // 获取当前页的数据
    const currentPageData = filteredData.slice(startIndex, endIndex);

    // 获取表格主体
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // 检查是否有匹配的结果
    if (filteredData.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('resourceTable').style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
    } else {
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('resourceTable').style.display = 'table';
        document.getElementById('pagination').style.display = 'flex';

        // 填充表格数据
        currentPageData.forEach(item => {
            const row = document.createElement('tr');

            // 标题列
            const titleCell = document.createElement('td');
            titleCell.textContent = item.title || '无标题';
            row.appendChild(titleCell);

            // 标签列
            const tagsCell = document.createElement('td');
            if (item.tags && item.tags.length > 0) {
                item.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.textContent = tag;
                    tagSpan.className = 'item-tag';
                    tagsCell.appendChild(tagSpan);
                });
            } else {
                tagsCell.textContent = '-';
            }
            row.appendChild(tagsCell);

            // 年份列
            const yearCell = document.createElement('td');
            yearCell.textContent = item.year;
            row.appendChild(yearCell);

            // 期数列
            const issueCell = document.createElement('td');
            issueCell.textContent = item.issue || '未知';
            row.appendChild(issueCell);

            // 链接列
            const linkCell = document.createElement('td');
            if (item.link) {
                const linkBtn = document.createElement('a');
                linkBtn.href = item.link;
                linkBtn.textContent = '查看';
                linkBtn.className = 'link-btn';
                linkBtn.target = '_blank'; // 在新标签页打开链接
                linkCell.appendChild(linkBtn);
            } else {
                linkCell.textContent = '无链接';
            }
            row.appendChild(linkCell);

            tableBody.appendChild(row);
        });

        // 更新分页信息
        document.getElementById('pageInfo').textContent = `第 ${currentPage} 页，共 ${totalPages} 页，总条目: ${totalItems}`;

        // 更新按钮状态
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === totalPages;
    }
}

// 更新老年人视图
function updateSeniorView() {
    // 获取过滤后的数据
    const filteredData = getSeniorFilteredData();

    // 计算分页信息
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / seniorItemsPerPage);

    // 确保当前页在有效范围内
    if (seniorCurrentPage < 1) seniorCurrentPage = 1;
    if (seniorCurrentPage > totalPages) seniorCurrentPage = totalPages;

    // 计算当前页的数据范围
    const startIndex = (seniorCurrentPage - 1) * seniorItemsPerPage;
    const endIndex = Math.min(startIndex + seniorItemsPerPage, totalItems);

    // 获取当前页的数据
    const currentPageData = filteredData.slice(startIndex, endIndex);

    // 获取资源容器
    const resourcesContainer = document.getElementById('seniorResources');
    resourcesContainer.innerHTML = '';

    // 检查是否有匹配的结果
    if (filteredData.length === 0) {
        document.getElementById('seniorNoResults').style.display = 'block';
        document.getElementById('seniorPagination').style.display = 'none';
    } else {
        document.getElementById('seniorNoResults').style.display = 'none';
        document.getElementById('seniorPagination').style.display = 'flex';

        // 填充资源卡片
        currentPageData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'senior-card';

            // 标题
            const title = document.createElement('h2');
            title.className = 'senior-card-title';
            title.textContent = item.title || '无标题';
            card.appendChild(title);

            // 标签
            if (item.tags && item.tags.length > 0) {
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'senior-card-tags';

                item.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.textContent = tag;
                    tagSpan.className = 'senior-card-tag';
                    tagsContainer.appendChild(tagSpan);
                });

                card.appendChild(tagsContainer);
            }

            // 链接
            if (item.link) {
                const link = document.createElement('a');
                link.href = item.link;
                link.textContent = '查看详情';
                link.className = 'senior-card-link';
                link.target = '_blank'; // 在新标签页打开链接
                card.appendChild(link);
            }

            resourcesContainer.appendChild(card);
        });

        // 更新分页信息
        document.getElementById('seniorPageInfo').textContent = `第 ${seniorCurrentPage} 页，共 ${totalPages} 页`;

        // 更新按钮状态
        document.getElementById('seniorPrevPage').disabled = seniorCurrentPage === 1;
        document.getElementById('seniorNextPage').disabled = seniorCurrentPage === totalPages;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 