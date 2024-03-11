import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Settings } from 'luxon'
import { Invoicing } from './pages/Invoicing'

const queryClient = new QueryClient()
Settings.defaultZone = 'UTC'
function App(): JSX.Element {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <Products /> */}
        <Invoicing />
      </QueryClientProvider>
    </>
  )
}

export default App
