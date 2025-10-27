import UserTaskHeader from '@/components/UserTasksHeader/UserTaskHeader'
import UserTaskTable from '@/components/UserTaskTable/UserTaskTable'
import React from 'react'

const UserTasksPage = () => {
  return (
    <div className='flex flex-col items-start w-full p-8'>
      <UserTaskHeader/>
      <UserTaskTable/>
    </div>
  )
}

export default UserTasksPage