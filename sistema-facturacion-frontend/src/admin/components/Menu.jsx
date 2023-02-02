import React from 'react'


export const Menu = ({title}) => {

    const onClickMenuIcon = () => {

        console.log('Has dado click en el icono del menu');

    }

  return (
    <div className='flex items-center gap-x-5 mt-10 ml-10'>
        <div className='w-10 h-10 cursor-pointer' onClick={onClickMenuIcon}>
            <img src="https://cdn-icons-png.flaticon.com/64/2499/2499163.png" alt="Icono Menu" />
        </div>

        <h2 className='text-5xl text-blue-400 font-bold'>{ title }</h2>

    </div>
  )
}
