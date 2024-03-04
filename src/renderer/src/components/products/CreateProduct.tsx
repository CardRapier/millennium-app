import * as yup from 'yup'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { LockIcon } from '../icons/LockIcon.jsx'
import { MailIcon } from '../icons/MailIcon.jsx'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required'),
  iva: yup.number().required('IVA is required'),
  gross_margin: yup.number().required('Gross Margin is required')
})

// eslint-disable-next-line react/prop-types
export default function CreateProduct({ isOpen, onOpenChange, update }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const response = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        console.log('Product added successfully!')
        update()
        // Handle success, reset form, etc.
      } else {
        console.error('Failed to add product.')
        // Handle error
      }
    } catch (error) {
      console.error('Error adding product:', error)
      // Handle error
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        className="dark text-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">Producto</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Codigo"
                    variant="bordered"
                  />
                  <Input
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    {...register('name')}
                    label="Nombre"
                    variant="bordered"
                    isInvalid={errors.name ? true : false}
                    errorMessage={errors.name && errors.name.message}
                  />
                  <Input
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    {...register('iva')}
                    label="Iva"
                    variant="bordered"
                    isInvalid={errors.iva ? true : false}
                    errorMessage={errors.iva && errors.iva.message}
                  />
                  <Input
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    {...register('price')}
                    label="Precio"
                    variant="bordered"
                    isInvalid={errors.price ? true : false}
                    errorMessage={errors.price && errors.price.message}
                  />
                  <Input
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    {...register('gross_margin')}
                    label="Margen ganancia"
                    variant="bordered"
                    isInvalid={errors.gross_margin ? true : false}
                    errorMessage={errors.gross_margin && errors.gross_margin.message}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" type="submit">
                    Agregar
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
