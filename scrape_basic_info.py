from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
import urllib.parse
import json

# --- 配置 ---
start_url = "https://www.btime.com/btv/btvws_yst"
base_site_url = "https://www.btime.com" # 用于拼接相对URL
all_videos_data = []
max_pages = 10 # 限制抓取的最大页数，设为 None 抓取所有
page_count = 0
# 等待页面元素的超时时间 (毫秒)
wait_timeout = 15000 # 15秒

# --- Playwright 操作 ---
with sync_playwright() as p:
    # 启动浏览器，推荐使用 Chromium (类似 Chrome)
    # headless=False 会打开浏览器窗口，方便调试；设为 True 则不打开窗口（后台运行）
    try:
        # 使用 try...except 包裹浏览器启动，以便在失败时能看到错误
        try:
            browser = p.chromium.launch(headless=False) 
        except Exception as launch_error:
            print(f"启动浏览器失败: {launch_error}")
            print("请确保已运行 'playwright install' 来安装浏览器。")
            exit() # 无法启动浏览器则退出

        page = browser.new_page()
        
        # 设置 User-Agent
        page.set_extra_http_headers({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"})

        print(f"导航到起始页: {start_url}")
        # 使用 try...except 包裹页面导航
        try:
             page.goto(start_url, timeout=60000) # 增加页面加载超时时间
        except Exception as goto_error:
             print(f"导航到页面失败: {goto_error}")
             browser.close()
             exit()


        while max_pages is None or page_count < max_pages:
            page_count += 1
            print(f"--- 开始处理第 {page_count} 页 ---")
            current_page_url_for_log = page.url # 记录当前页URL用于日志
            print(f"当前页面URL: {current_page_url_for_log}")

            try:
                # 1. 等待视频列表元素加载完成
                print("等待视频列表加载...")
                # 增加等待条件，确保至少有一个li.hot_li可见
                page.wait_for_selector('#infoflow ul li.hot_li', state='visible', timeout=wait_timeout)
                print("视频列表已加载。")
                
                # 短暂等待，给页面一点反应时间（有时有帮助）
                time.sleep(1) 

                # 2. 获取渲染后的HTML内容
                html_content = page.content()

                # 3. 使用BeautifulSoup解析HTML并提取数据
                soup = BeautifulSoup(html_content, 'html.parser') # 或 'lxml'
                video_items = soup.select('#infoflow ul li.hot_li')
                
                if not video_items:
                     print("在本页未找到视频列表项 (解析HTML后)。")
                     if page_count == 1:
                         print("请使用浏览器开发者工具检查选择器 '#infoflow ul li.hot_li' 是否准确，或页面结构是否有变。")
                     else:
                         print("可能已到达最后一页或加载内容为空。")
                     break 

                print(f"在本页找到 {len(video_items)} 个视频项。")

                for item in video_items:
                    video_data = {}
                    a_tag = item.find('a')
                    if not a_tag: continue

                    title_tag = item.select_one('.infos .title')
                    video_data['title'] = title_tag.text.strip() if title_tag else 'N/A'
                    sub_title_tag = item.select_one('.infos .sub_title')
                    video_data['subtitle'] = sub_title_tag.text.strip() if sub_title_tag else ''
                    relative_link = a_tag.get('href')
                    video_data['link'] = urllib.parse.urljoin(base_site_url, relative_link) if relative_link else 'N/A'
                    img_tag = item.select_one('.pic_box img.lazy')
                    # 修正图片URL提取逻辑
                    img_url = None
                    if img_tag:
                       img_url = img_tag.get('data-original') or img_tag.get('src')
                    video_data['image_url'] = urllib.parse.urljoin(base_site_url, img_url) if img_url else 'N/A'
                    marker_tag = item.select_one('.pic_box span.marker')
                    video_data['issue'] = marker_tag.text.strip() if marker_tag else video_data['subtitle']
                    duration_tag = item.select_one('.pic_box span.badge-nobg')
                    video_data['duration'] = duration_tag.text.strip().replace(' ', '').replace('\n','') if duration_tag else ''

                    all_videos_data.append(video_data)

                # 4. 查找并点击“下一页”按钮
                next_button_selector = '#pagination a.layui-laypage-next:not(.layui-disabled)'
                next_button = page.locator(next_button_selector)

                # 使用 locator.count() 检查元素是否存在且可用 (同步API，不需要await)
                if next_button.count() > 0:
                    print("找到'下一页'按钮，准备点击...")
                    try:
                        # --- 确保按钮可见并可点击 ---
                        # next_button.scroll_into_view_if_needed() # 如果需要滚动
                        next_button.click(timeout=10000) # 点击下一页，增加点击超时
                        print("已点击'下一页'。")

                        # --- 等待新页面内容加载 ---
                        print("等待3秒让新内容加载...")
                        time.sleep(3) # 可以尝试调整这个时间
                        # 或者更可靠的等待方式：
                        # print("等待网络空闲...")
                        # page.wait_for_load_state('networkidle', timeout=wait_timeout)

                    except Exception as click_error:
                        print(f"点击'下一页'按钮或等待加载时出错: {click_error}")
                        break 
                else:
                    print("未找到可点击的'下一页'按钮（可能已是最后一页或选择器失效）。")
                    break 

            except Exception as page_processing_error:
                print(f"处理第 {page_count} 页时发生错误: {page_processing_error}")
                break 

    except Exception as e:
        print(f"Playwright 操作过程中出错: {e}")
    finally:
        # 确保浏览器被关闭
        if 'browser' in locals() and browser.is_connected():
             try:
                  browser.close()
             except Exception as close_error:
                  print(f"关闭浏览器时出错: {close_error}")


# --- 处理结果 ---
print("\n--- Playwright 抓取完成 ---")
print(f"总共抓取了 {len(all_videos_data)} 条视频数据。")

# 打印部分结果
print("\n--- 部分抓取结果示例 ---")
for i, video in enumerate(all_videos_data[:5]):
    print(f"条目 {i+1}:")
    print(json.dumps(video, indent=2, ensure_ascii=False))

# 保存到文件 (取消注释以启用)
# output_filename = 'yangshengtang_videos_playwright.json'
# try:
#     with open(output_filename, 'w', encoding='utf-8') as f:
#         json.dump(all_videos_data, f, ensure_ascii=False, indent=4)
#     print(f"\n数据已保存到文件: {output_filename}")
# except IOError as e:
#     print(f"保存文件时出错: {e}")