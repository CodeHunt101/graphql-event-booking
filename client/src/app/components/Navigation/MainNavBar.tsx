'use client'
import NavLink from 'next/link'
import AuthContext from '@/app/context/auth-context'
import { useContext } from 'react'
import ThemeController from './ThemeController'
import Dropdown from './Dropdown'

const MainNavBar = () => {
  const { token, logout } = useContext(AuthContext)
  const renderList = () => {
    return (
      <>
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
      </>
    )
  }
  return (
    <header className="navbar bg-base-100">
      <div className="navbar-start">
        <Dropdown list={renderList} />
        <NavLink href={'/'} className="btn btn-ghost text-xl">
          EasyEvent
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{renderList()}</ul>
      </div>
      <div className="navbar-end">
        {token && (
          <button onClick={logout} className="btn btn-ghost mr-2">
            Log out
          </button>
        )}
        <ThemeController />
      </div>
    </header>
  )
}

export default MainNavBar
