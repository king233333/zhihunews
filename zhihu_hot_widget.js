// 参数配置
const params = {
  maxItems: 8,            // 显示的最大热榜条目数量
  fontSize: 13,           // 文本字体大小
  spacing: 6,             // 每条新闻之间的间距
  timeout: 5,             // 网络请求超时时间（秒）
  padding: 20,            // 小组件四周的统一内边距
  topSpacer: 15,          // 顶部间距（用于视觉居中）
  bottomSpacer: 10,       // 底部间距
  useTransparentBG: true, // 是否使用透明背景图
  bgImageName: "zhihu_bg.jpg" // 背景图片文件名（需放入 Scriptable Documents）
}

// 创建小组件
const widget = new ListWidget()
widget.setPadding(params.padding, params.padding, params.padding, params.padding)

// 设置背景
await setBackground()

try {
  const data = await getZhihuHot()
  showNewsList(data)
} catch (e) {
  showError(e.message)
}

// 展示组件
Script.setWidget(widget)
if (!config.runsInWidget) widget.presentMedium()
Script.complete()

// 设置背景图（透明 or 渐变）
async function setBackground() {
  if (params.useTransparentBG) {
    const fm = FileManager.local()
    const imgPath = fm.joinPath(fm.documentsDirectory(), params.bgImageName)
    if (fm.fileExists(imgPath)) {
      widget.backgroundImage = fm.readImage(imgPath)
    } else {
      widget.backgroundColor = new Color("#007FFF")
    }
  } else {
    const gradient = new LinearGradient()
    gradient.colors = [new Color("#007FFF"), new Color("#00C4FF")]
    gradient.locations = [0.0, 1.0]
    widget.backgroundGradient = gradient
  }
}

// 展示知乎热榜列表（不含热度）
function showNewsList(data) {
  const items = data.slice(0, params.maxItems)
  const stack = widget.addStack()
  stack.layoutVertically()
  stack.centerAlignContent()
  stack.addSpacer(params.topSpacer)

  for (const item of items) {
    const row = stack.addStack()
    row.url = item.url // 支持点击跳转
    const text = row.addText(item.title)
    text.font = Font.semiboldSystemFont(params.fontSize)
    text.textColor = Color.white()
    text.lineLimit = 2
    text.minimumScaleFactor = 0.85
    stack.addSpacer(params.spacing)
  }

  stack.addSpacer(params.bottomSpacer)
}

// 显示错误信息
function showError(msg) {
  const text = widget.addText("加载失败\n" + msg)
  text.textColor = Color.red()
  text.font = Font.mediumSystemFont(12)
  text.textAlignment = TextAlignment.center
}

// 获取知乎热榜数据
async function getZhihuHot() {
  const url = "https://api.zhihu.com/topstory/hot-list"
  const request = new Request(url)
  request.timeoutInterval = params.timeout
  const res = await request.loadJSON()
  if (!res.data) throw new Error("接口无效")
  return res.data.map(item => ({
    title: item.target.title || item.target.question?.title || "（无标题）",
    url: "zhihu://open?url=" + encodeURIComponent(item.target.url || item.target.question?.url || "")
  }))
}
