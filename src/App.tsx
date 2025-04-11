import ToysRoutes from './routes/Index'
import './App.css'
import { LanguageProvider } from './Context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <ToysRoutes />
    </LanguageProvider>
  )
}

export default App
