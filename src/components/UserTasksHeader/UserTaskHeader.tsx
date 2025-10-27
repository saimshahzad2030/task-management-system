import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const UserTaskHeader = () => {
  return (
      <div className='flex flex-row items-center '>
            <h1 className='text-5xl'>LOGO</h1>
            <Button variant={'customNormal'} className='ml-2' size={'customNormalSize'}>
                <Plus/>
                New
            </Button>
        </div>
  )
}

export default UserTaskHeader