'use client'
import { useRef, FormEvent, useState, useContext } from 'react'
import './styles.css'
import AuthContext from '../context/auth-context'
import { redirect } from 'next/navigation'

const AuthPage = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [islogin, setIsLogin] = useState(true)
  const { token, userId, login, logout } = useContext(AuthContext)
  if (token) redirect('/events')

  const handleSwitchMode = () => {
    setIsLogin(() => !islogin)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    if (email?.trim().length === 0 || password?.trim().length === 0) {
      return
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    }

    if (!islogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      }
    }

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed!')
      }

      const jsonResp = await response.json()
      if (jsonResp.data && login) {
        login(
          jsonResp.data.login.token,
          jsonResp.data.login.userId,
          jsonResp.data.login.tokenExpiration
        )
      }
      console.log({ response: jsonResp })
      return jsonResp
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-96 max-w-[80%] mx-auto mt-20">
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          id="email"
          ref={emailRef}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          id="password"
          ref={passwordRef}
        />
      </div>
      <div className="form-actions">
        <button
          className="shadow-lg bg-teal-400 hover:bg-teal-600 active:bg-teal-600 rounded-lg py-1 px-2 mr-2"
          type="submit"
        >
          Submit
        </button>
        <button
          className="shadow-lg bg-teal-400 hover:bg-teal-600 active:bg-teal-600 rounded-lg py-1 px-2 mr-2"
          type="button"
          onClick={handleSwitchMode}
        >
          {`Switch to ${islogin ? 'Signup' : 'Login'}`}
        </button>
      </div>
    </form>
  )
}

export default AuthPage
