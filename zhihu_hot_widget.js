// 参数配置
const params = {
  maxItems: 8,        // 显示的最大热榜条目数量
  fontSize: 14,       // 文本字体大小
  spacing: 4,         // 每条新闻之间的间距
  timeout: 3,         // 网络请求超时时间（秒）
  padding: 20,        // 小组件四周的统一内边距
  topSpacer: 15,      // 顶部间距（用于视觉居中）
  bottomSpacer: 10    // 底部间距
}

// 创建一个 ListWidget 并设置四周统一内边距
const widget = new ListWidget()
widget.setPadding(params.padding, params.padding, params.padding, params.padding) // 上右下左内边距

// 设置知乎蓝色渐变背景
await setZhihuGradient()

try {
  // 获取知乎热榜数据并显示
  const data = await getZhihuHot()
  showNewsList(data)
} catch (e) {
  // 捕获错误并显示错误信息
  showError(e.message)
}

// 设置小组件内容并以中等尺寸展示
Script.setWidget(widget)
widget.presentMedium()
return

// 设置渐变背景函数
async function setZhihuGradient() {
  const gradient = new LinearGradient()
  gradient.colors = [
    new Color("#007FFF"), // 渐变起始色
    new Color("#00C4FF")  // 渐变结束色
  ]
  gradient.locations = [0.0, 1.0]
  widget.backgroundGradient = gradient
}

// 展示知乎热榜列表
function showNewsList(data) {
  const items = data.slice(0, params.maxItems) // 取前 maxItems 条数据
  const stack = widget.addStack()
  stack.layoutVertically()       // 垂直排列
  stack.centerAlignContent()     // 内容居中对齐
  stack.addSpacer(params.topSpacer) // 顶部间距

  // 遍历每一项新闻并显示
  items.forEach(item => {
    const text = stack.addText(item.title)
    text.font = Font.systemFont(params.fontSize) // 设置字体大小
    text.textColor = Color.white()               // 白色文字
    text.lineLimit = 2                           // 最多显示 2 行
    text.minimumScaleFactor = 0.85               // 最小缩放比（适应长度）
    stack.addSpacer(params.spacing)              // 每条新闻之间间距
  })

  stack.addSpacer(params.bottomSpacer) // 底部间距
}

// 显示错误信息
function showError(msg) {
  const text = widget.addText("加载失败\n" + msg)
  text.textColor = Color.red()                    // 红色错误提示
  text.font = Font.mediumSystemFont(12)
  text.textAlignment = TextAlignment.center       // 文本居中
}

// 获取知乎热榜数据
async function getZhihuHot() {
  const url = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50"
  const request = new Request(url)
  request.timeoutInterval = params.timeout        // 设置请求超时
  const data = await request.loadJSON()           // 获取 JSON 数据
  return data.data.map(item => ({
    title: item.target.title                      // 提取标题信息
  }))
}
