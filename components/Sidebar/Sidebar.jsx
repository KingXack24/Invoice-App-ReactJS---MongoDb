

import React from 'react'
import Image from 'next/image'

const Sidebar = () => {
  return (
    <div className="sidebar">
    <div className='sidebar_container'>
        <div className='sidebar_header'>
            <div className='sidebar_logo'>
                <h1> Zakir </h1>
            </div>
        </div>
        <div className='sidebar_bottom'>
        <Image src='/zak1.png' alt='zak' width='50' height='50' />

        </div>
    </div>

    </div>
  )
}

export default Sidebar