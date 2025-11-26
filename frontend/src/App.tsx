import { AuthProvider } from './context/AuthContext/AuthContext'
import AppRouter from './router/AppRouter/AppRouter'

function App() {
  return (
    <>
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
    </>
  )
}

export default App
