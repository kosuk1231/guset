import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const style = document.createElement('style')
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  button, select, input {
    touch-action: manipulation;
    font-family: inherit;
  }
  button, [role="button"] {
    -webkit-user-select: none;
    user-select: none;
  }
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
