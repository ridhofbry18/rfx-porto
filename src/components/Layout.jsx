import React from 'react'

const Layout = ({ children, className = "" }) => {
  return (
    <div className={`w-full h-full inline-block z-0 p-6 sm:p-12 md:p-16 lg:p-24 xl:p-32 ${className}`}>
      {children}
    </div>
  )
}

export default Layout;
