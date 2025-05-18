/**
 * Scriptable 小组件：知乎热榜
 * 作者：king233333
 * 描述：在 iOS 主屏幕显示知乎热榜前几条内容
 * 更新日期：2025-05-18
 */

// === 配置参数 ===
const configParams = {
  maxItems: 8,        // 最多显示的热榜条目数量
  fontSize: 14,       // 热榜文字字体大小
  spacing: 4,         // 每条热榜之间的间距
  timeout: 5,         // 网络请求超时时间（秒）
  padding: 20,        // 小组件四周的统一内边距
  topSpacer: 15,      // 顶部间距（用于视觉居中）
  bottomSpacer: 10    // 底部间距
}

// === 创建小组件并设置统一内边距 ===
const widget = new ListWidget()
widget.setPadding(configParams.padding, configParams.padding, configParams.padding, configParams.padding)

await setZhihuGradientBackground()

try {
  const hotTopics = await fetchZhihuHotList()
  renderHotList(hotTopics)
} catch (error) {
  renderError(error.message || "未知错误")
}

Script.setWidget(widget)
if (!config.runsInWidget) widget.presentMedium()
Script.complete()

/**
 * 设置知乎蓝色渐变背景
 */
async function setZhihuGradientBackground() {
  const gradient = new LinearGradient()
  gradient.colors = [new Color("#007FFF"), new Color("#00C4FF")]
  gradient.locations = [0.0, 1.0]
  widget.backgroundGradient = gradient
}

/**
 * 获取知乎热榜数据（使用官方接口）
 * @returns {Promise<Array<{ title: string }>>}
 */
async function fetchZhihuHotList() {
  const url = "https://api.zhihu.com/topstory/hot-list"
  const request = new Request(url)
  request.timeoutInterval = configParams.timeout
  const response = await request.loadJSON()

  if (!response.data) throw new Error("接口返回无效数据")

  // 只提取标题内容
  return response.data.map(item => ({
    title: item.target.title || item.target.question?.title || "（无标题）"
  }))
}

/**
 * 将热榜条目显示到小组件中
 * @param {Array<{ title: string }>} items 
 */
function renderHotList(items) {
  const displayItems = items.slice(0, configParams.maxItems)

  const contentStack = widget.addStack()
  contentStack.layoutVertically()
  contentStack.centerAlignContent()
  contentStack.addSpacer(configParams.topSpacer)

  for (const item of displayItems) {
    const line = contentStack.addText("• " + item.title)
    line.font = Font.systemFont(configParams.fontSize)
    line.textColor = Color.white()
    line.lineLimit = 2
    line.minimumScaleFactor = 0.85
    contentStack.addSpacer(configParams.spacing)
  }

  contentStack.addSpacer(configParams.bottomSpacer)
}

/**
 * 显示错误信息
 * @param {string} msg 
 */
function renderError(msg) {
  const errorText = widget.addText("❌ 加载失败\n" + msg)
  errorText.textColor = Color.red()
  errorText.font = Font.mediumSystemFont(12)
  errorText.textAlignment = TextAlignment.center
}
