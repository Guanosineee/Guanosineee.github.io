/* ============================================================
 * 首页签名条
 * 没有 banner 时，Butterfly 不会渲染 #site-info / #subtitle，
 * 所以这里自己在文章列表上方放一条会打字的签名。
 * 想改文案，直接改下面的 LINES 数组。
 * ============================================================ */
(() => {
  if (window.__whaleTaglineReady) return
  window.__whaleTaglineReady = true

  const LINES = [
    '不得不 stay hungry，因为根本没得吃。',
    '在写一个没人会用的 Rust 游戏引擎。',
    '今天也没有成为技术人员。',
    'Cosplay 技术人员中，勿扰。'
  ]

  const TYPE_SPEED = 90
  const ERASE_SPEED = 45
  const HOLD_TIME = 2200

  let timer = null
  let lineIndex = 0
  let charIndex = 0
  let erasing = false

  function clearTimer () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function tick (el) {
    const line = LINES[lineIndex]

    if (!erasing) {
      charIndex += 1
      el.textContent = line.slice(0, charIndex)

      if (charIndex >= line.length) {
        erasing = true
        timer = setTimeout(() => tick(el), HOLD_TIME)
        return
      }
      timer = setTimeout(() => tick(el), TYPE_SPEED)
      return
    }

    charIndex -= 1
    el.textContent = line.slice(0, charIndex)

    if (charIndex <= 0) {
      erasing = false
      lineIndex = (lineIndex + 1) % LINES.length
    }
    timer = setTimeout(() => tick(el), ERASE_SPEED)
  }

  function removeBand () {
    clearTimer()
    const band = document.getElementById('whale-tagline')
    if (band) band.remove()
  }

  function mount () {
    clearTimer()

    const container = document.getElementById('recent-posts')
    if (!container) return
    if (document.getElementById('whale-tagline')) return

    lineIndex = 0
    charIndex = 0
    erasing = false

    const band = document.createElement('div')
    band.id = 'whale-tagline'

    const icon = document.createElement('span')
    icon.className = 'whale-icon'
    icon.textContent = '🐳'
    icon.setAttribute('aria-hidden', 'true')

    const text = document.createElement('span')
    text.className = 'whale-text'

    const cursor = document.createElement('span')
    cursor.className = 'whale-cursor'
    cursor.textContent = '▌'
    cursor.setAttribute('aria-hidden', 'true')

    band.append(icon, text, cursor)
    container.insertBefore(band, container.firstChild)

    // 系统开启“减少动效”时直接显示第一句
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      text.textContent = LINES[0]
      return
    }

    timer = setTimeout(() => tick(text), 500)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
  } else {
    mount()
  }

  // Pjax 只替换 #body-wrap，所以每次切换后要重新挂载
  document.addEventListener('pjax:complete', mount)
  document.addEventListener('pjax:send', removeBand)
})()
