'use client'
import { useRef, FormEvent, useState, useContext } from 'react'
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
      <label className="input input-bordered flex items-center gap-2 my-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Email"
          ref={emailRef}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2 my-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          className="grow"
          placeholder="Password"
          ref={passwordRef}
        />
      </label>
      <div className="form-actions">
        <button className="btn btn-primary py-1 px-2 mr-2" type="submit">
          Submit
        </button>
        <button
          className="btn btn-secondary py-1 px-2 mr-2"
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
