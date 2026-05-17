import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import Counter from "../src/components/Counter/Counter"
import store from "../src/store/store"

test("counter component renders", () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Counter />
      </Provider>
    </BrowserRouter>
  )

  expect(screen.getByText(/counter/i)).toBeInTheDocument()
})