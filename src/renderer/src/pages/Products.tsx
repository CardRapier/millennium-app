import {
  Button,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure
} from '@nextui-org/react'
import { AsyncListData, useAsyncList } from '@react-stately/data'

import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll'
import { PlusIcon } from '@renderer/components/icons/PlusIcon'
import { SearchIcon } from '@renderer/components/icons/SearchIcon'
import CreateProduct from '@renderer/components/products/CreateProduct'
import React from 'react'

interface Product {
  id: number
  name: string
  // description: string
  price: number
  iva: number
  gross_margin: number
}

export const Products = () => {
  const [rawFilterText, setRawFilterText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const list: AsyncListData<Product> = useAsyncList({
    async load({ filterText }) {
      setLoading(true)
      const res = await fetch(`http://localhost:8080/products?search=${filterText}`)
      const json = await res.json()
      setLoading(false)
      return {
        items: json.products
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as keyof Product]
          const second = b[sortDescriptor.column as keyof Product]
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1
          }

          return cmp
        })
      }
    }
  })
  const [loaderRef, scrollerRef] = useInfiniteScroll({ onLoadMore: list.loadMore })

  const renderCell = React.useCallback((product: Product, columnKey: React.Key) => {
    const cellValue = product[columnKey as keyof Product]

    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex flex-row items-center">
            <Button color="primary" size="sm">
              Editar
            </Button>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  //USE EFFECT FOR BOUNCING THE INPUT, SO REQUEST ARE NOT DONE EVERY HALF SECOND
  React.useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => {
      list.setFilterText(rawFilterText)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [rawFilterText])

  return (
    <>
      <div className="flex flex-row justify-between items-center p-2 pb-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar producto..."
          startContent={<SearchIcon />}
          value={rawFilterText}
          onValueChange={(event) => setRawFilterText(event)}
        />

        <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
          Agregar
        </Button>
      </div>
      <Table
        aria-label="Example table with dynamic content"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        baseRef={scrollerRef}
        bottomContent={
          loading ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="white" />
            </div>
          ) : null
        }
        classNames={{
          base: 'max-h-[520px] overflow-scroll',
          table: 'min-h-[200px]'
        }}
      >
        <TableHeader>
          <TableColumn key="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn key="name" allowsSorting>
            Nombre
          </TableColumn>
          <TableColumn key="iva" allowsSorting>
            IVA
          </TableColumn>
          <TableColumn key="price" allowsSorting>
            Precio
          </TableColumn>
          <TableColumn key="gross_margin" allowsSorting>
            Margen
          </TableColumn>
          <TableColumn key="actions" align="center">
            Acciones
          </TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          loadingState={list.loadingState}
          isLoading={loading}
          loadingContent={<Spinner />}
        >
          {(item: Product) => (
            <TableRow key={item.name}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateProduct isOpen={isOpen} onOpenChange={onOpenChange} update={list.reload} />
    </>
  )
}
