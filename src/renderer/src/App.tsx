import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Products } from './pages/Products'

const queryClient = new QueryClient()

function App(): JSX.Element {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Products />
        {/* <Invoicing /> */}
      </QueryClientProvider>
    </>
  )
}

export default App
