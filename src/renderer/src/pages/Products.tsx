import {
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue
} from '@nextui-org/react'

import { useAsyncList } from '@react-stately/data'
import { SearchIcon } from '@renderer/components/icons/SearchIcon'
import React from 'react'

export const Products = () => {
  const [rawFilterText, setRawFilterText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  let pages
  const rowsPerPage = 1

  const list = useAsyncList({
    async load({ filterText }) {
      const res = await fetch(`http://localhost:8080/products?search=${filterText}`)
      const json = await res.json()
      pages = Math.ceil(json.length / rowsPerPage)
      console.log(pages)

      return {
        items: json
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column]
          const second = b[sortDescriptor.column]
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1
          }

          return cmp
        })
      }
    }
  })

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
      <div>
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={rawFilterText}
          onValueChange={(event) => setRawFilterText(event)}
        />
      </div>
      <Table
        aria-label="Example table with dynamic content"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn key="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="iva" allowsSorting>
            IVA
          </TableColumn>
          <TableColumn key="price" allowsSorting>
            Price
          </TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          loadingState={list.loadingState}
          isLoading={loading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
