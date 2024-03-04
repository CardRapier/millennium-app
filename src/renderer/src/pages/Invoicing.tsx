import { Button, Card, CardFooter } from '@nextui-org/react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import axios from 'axios'

export const Invoicing = () => {
  const [filterText, setFilterText] = useState('')
  const [cart, setCart] = useState({})
  const [total, setTotal] = useState(0)

  const fetchProducts = async () => {
    console.log(filterText)
    const response = await axios.get(`http://localhost:8080/products?search=${filterText}`)
    return response.data
  }

  const { isPending, isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['products', filterText],
    queryFn: fetchProducts,
    placeholderData: keepPreviousData
  })

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setFilterText(filterText)
    }, 500)

    return () => clearTimeout(timeout)
  }, [filterText])

  const invoicing = async (): Promise<void> => {
    const response = await window.electron.ipcRenderer.invoke('invoice', {
      invoice: {
        cart,
        total
      }
    })
    console.log(response)
  }
  return (
    <div className="flex flex-row py-4 h-full">
      <div className="h-full w-[70%] mx-4">
        <div className="h-[40%] w-full"></div>
        <div className="max-h-[60%] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 overflow-y-scroll">
          {isPending ? (
            <div>Loading...</div>
          ) : (
            data?.products?.map((item, index) => (
              <Card
                key={index}
                className="h-10"
                isPressable
                onClick={() => {
                  if (cart[item.name]) {
                    item.quantity = cart[item.name].quantity + 1
                  } else {
                    item.quantity = 1
                  }
                  setTotal(total + item.price)
                  setCart({ ...cart, [item.name]: item })
                }}
              >
                <CardFooter className="text-small justify-between">
                  <b>{item.name}</b>
                  <p className="text-default-500">${item.price}</p>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className="h-full w-[30%] mx-4 flex flex-col gap-4">
        <div className="h-[60%] w-full flex flex-col overflow-scroll">
          {Object.values(cart).map((item, index) => (
            // <pre>{JSON.stringify(item)}</pre>
            <Card key={index} className="h-10 w-full mb-4 min-h-10">
              <CardFooter className="text-small justify-between">
                <b>
                  {item.name} x{item.quantity}
                </b>
                <p className="text-default-500">{item.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Card className="h-[40%] w-full">Total: {total}</Card>
        <Button onClick={() => invoicing()}>Facturar</Button>
      </div>
    </div>
  )
}
