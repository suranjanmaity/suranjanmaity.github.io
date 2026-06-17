import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the initial Maity AI hero message', () => {
    render(<App />)
    expect(screen.getAllByText('Maity AI').length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText('Ask a question about System Design or .NET...')).toBeInTheDocument()
  })
})
