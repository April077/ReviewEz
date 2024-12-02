"use client"
import React from 'react'
import Confetti from 'react-confetti'

export default () => {
  return (
    <Confetti
    className='h-full w-full'
      width={1000}
      height={1000}
    />
  )
}