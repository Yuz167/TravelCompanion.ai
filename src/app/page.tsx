import { UserButton } from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <h1>Welcome Home</h1>
      <UserButton />
    </div>
  )
}

export default HomePage
