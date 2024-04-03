'use client'
import NavLink from 'next/link'
import AuthContext from '@/app/context/auth-context'
import './styles.css'
import { useContext } from 'react'

const MainNavBar = () => {
  const { token } = useContext(AuthContext)
  return (
    <header className="main-navigation flex items-center fixed left-0 top-0 w-full h-14 bg-teal-400 px-4 py-0">
      <div className="main-navigation__logo">
        <h1 className="m-0 text-2xl">EasyEvent</h1>
      </div>
      <nav className="main-navigation__items ml-6">
        <ul className="flex list-none p-0 m-0">
          {!token && (
            <li>
              <NavLink href={'/auth'}>Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink href={'/events'}>Events</NavLink>
          </li>
          {token && (
            <li>
              <NavLink href={'/bookings'}>Bookings</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default MainNavBar
