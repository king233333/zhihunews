// ==================== 常用设置 ====================
const params = {
  maxItems: 8,            // 显示多少条新闻
  fontSize: 13,           // 新闻文字大小
  spacing: 6,             // 新闻之间的间距
  timeout: 5,             // 网络请求超时时间（秒）
  padding: 20,            // 小组件四周的内边距
  topSpacer: 15,          // 顶部留白
  bottomSpacer: 10,       // 底部留白
  useTransparentBG: true, // true：使用背景图片；false：使用渐变色
  bgImageName: "zhihu_bg.jpg" // 背景图片名称，需放入 Scriptable Documents
}

// ==================== 颜色设置 ====================
// 只需要修改下面的颜色值即可，格式为十六进制，例如："#FF0000"
const colors = {
  fallbackBackground: "#007FFF", // 找不到背景图片时使用的纯色
  gradientStart: "#007FFF",       // 渐变开始颜色
  gradientEnd: "#00C4FF",         // 渐变结束颜色
  text: "#FFFFFF",                // 新闻文字颜色
  error: "#FF4D4F"                // 错误提示文字颜色
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

// 设置背景图（透明图片 or 渐变）
async function setBackground() {
  if (params.useTransparentBG) {
    const fm = FileManager.local()
    const imgPath = fm.joinPath(fm.documentsDirectory(), params.bgImageName)
    if (fm.fileExists(imgPath)) {
      widget.backgroundImage = fm.readImage(imgPath)
    } else {
      widget.backgroundColor = new Color(colors.fallbackBackground)
    }
  } else {
    const gradient = new LinearGradient()
    gradient.colors = [
      new Color(colors.gradientStart),
      new Color(colors.gradientEnd)
    ]
    gradient.locations = [0.0, 1.0]
    widget.backgroundGradient = gradient
  }
}

// 展示知乎热榜列表（点击每一行可以打开对应知乎页面）
function showNewsList(data) {
  const items = data.slice(0, params.maxItems)
  const stack = widget.addStack()
  stack.layoutVertically()
  stack.centerAlignContent()
  stack.addSpacer(params.topSpacer)

  for (const item of items) {
    const row = stack.addStack()
    row.url = item.url

    const text = row.addText(item.title)
    text.font = Font.semiboldSystemFont(params.fontSize)
    text.textColor = new Color(colors.text)
    text.lineLimit = 2
    text.minimumScaleFactor = 0.85

    stack.addSpacer(params.spacing)
  }

  stack.addSpacer(params.bottomSpacer)
}

// 显示错误信息
function showError(msg) {
  const text = widget.addText("加载失败\n" + msg)
  text.textColor = new Color(colors.error)
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
    url: toZhihuWebURL(item.target.url || item.target.question?.url || "")
  }))
}

// 知乎接口返回 api.zhihu.com/questions/... 时，
// 转成普通知乎问题页面，点击后可由 iOS 打开知乎 App 或 Safari。
function toZhihuWebURL(rawURL) {
  if (!rawURL) return "https://www.zhihu.com/hot"

  if (rawURL.startsWith("https://api.zhihu.com/questions/")) {
    return rawURL.replace(
      "https://api.zhihu.com/questions/",
      "https://www.zhihu.com/question/"
    )
  }

  return rawURL
}