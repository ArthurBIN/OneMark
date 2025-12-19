import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@/assets/styles/_variables.scss'
import 'remixicon/fonts/remixicon.css'
import { Provider } from 'react-redux'
import { store } from '@/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
