import React from 'react'
import {redirect} from 'next/navigation'
type Props = {}

const  page = ({}: Props)  => {
  redirect('/')
}

export default page