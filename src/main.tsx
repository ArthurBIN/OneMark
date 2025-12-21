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
            colorPrimary: '#000000',
            colorText: '#000000',
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
          },
        }}
      >
        <App />
      </ConfigProvider>

    </Provider>
  </StrictMode>,
)
