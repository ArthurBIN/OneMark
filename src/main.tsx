import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@/assets/styles/_variables.scss'
import 'remixicon/fonts/remixicon.css'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorText: '#000000',
            controlOutline: 'transparent',
          },
          components: {
            Slider: {
              handleSize: 8,
              handleSizeHover: 10,
            },
            Switch: {
              colorPrimaryHover: '#333333',
              colorTextQuaternary: '#d9d9d9',
            },
            Input: {
              hoverBorderColor: '#000000',
              activeBorderColor: '#000000',
            },
            Select: {
              colorBorder: '#000000',
              activeBorderColor: '#000000',
              hoverBorderColor: '#000000',
              optionSelectedBg: '#000000',     // 选中项背景
              optionSelectedColor: '#ffffff',  // 选中项文字
            },
          },
        }}
      >
        <App />
      </ConfigProvider>

    </Provider>
  </StrictMode>,
)
