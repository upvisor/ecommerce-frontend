import React from 'react'

interface Props {
  type: string
  placeholder: string
  name?: string
  change: any
  value: string
  config?: string
}

export const Input: React.FC<Props> = ({ type, placeholder, name, change, value, config }) => {
  return (
    <input type={type} placeholder={placeholder} name={name} onChange={change} value={value} className={`${config} p-2 rounded border text-sm transition-colors duration-150 focus:outline-none focus:border-main focus:ring-1 focus:ring-main dark:border-neutral-600`} />
  )
}
