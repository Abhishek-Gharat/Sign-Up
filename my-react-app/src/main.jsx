import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store.js'
import { initializeAuth } from './store/slices/authSlice.js'
import './index.css'
import App from './App.jsx'

// Component to initialize auth on app load
function AppInitializer() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])
  
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  </StrictMode>,
)
