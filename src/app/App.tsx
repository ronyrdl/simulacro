import AppRouter from "./router"
import ErrorBoundary from "../shared/components/ErrorBoundary"

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  )
}

export default App
