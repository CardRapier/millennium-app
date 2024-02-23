import { Kbd } from '@nextui-org/react'
function App(): JSX.Element {
  return (
    <>
      <div className="flex gap-4 ">
        <Kbd keys={['command']}>K</Kbd>
        <Kbd keys={['command', 'shift']}>N</Kbd>
        <Kbd keys={['option', 'command']}>P</Kbd>
      </div>
    </>
  )
}

export default App
