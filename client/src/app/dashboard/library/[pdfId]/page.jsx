'use client'

// Mock data for PDF content
const pdfContent = {
  '1': {
    title: 'Web Development Best Practices',
    description: 'A comprehensive guide to modern web development practices and patterns',
    content: `
      # Web Development Best Practices

      ## Introduction
      This guide covers essential best practices for modern web development, focusing on creating maintainable, scalable, and efficient web applications.

      ## HTML Best Practices
      - Use semantic HTML elements (header, nav, main, section, article, footer)
      - Maintain proper document structure with DOCTYPE and meta tags
      - Implement proper heading hierarchy (h1 through h6)
      - Use appropriate ARIA attributes for accessibility
      - Optimize images with proper alt text and loading attributes

      ## CSS Best Practices
      - Implement responsive design using media queries
      - Use CSS Grid and Flexbox for modern layouts
      - Follow BEM (Block Element Modifier) naming convention
      - Implement CSS custom properties for theming
      - Use CSS modules or styled-components for scoped styles
      - Optimize animations for performance

      ## JavaScript Best Practices
      - Write clean, maintainable code following SOLID principles
      - Use modern ES6+ features (arrow functions, destructuring, etc.)
      - Implement proper error handling with try-catch blocks
      - Use async/await for asynchronous operations
      - Follow design patterns (Factory, Singleton, Observer)
      - Implement proper testing strategies

      ## Performance Optimization
      - Implement code splitting and lazy loading
      - Optimize images and assets
      - Use browser caching effectively
      - Minimize HTTP requests
      - Implement proper database indexing
      - Use CDN for static assets

      ## Security Best Practices
      - Implement proper authentication and authorization
      - Use HTTPS for all communications
      - Sanitize user inputs
      - Implement CSRF protection
      - Use secure password hashing
      - Keep dependencies updated
    `
  },
  '2': {
    title: 'CSS Grid Layout',
    description: 'Master the grid system for modern responsive layouts',
    content: `
      # CSS Grid Layout

      ## Introduction
      CSS Grid is a powerful two-dimensional layout system that revolutionizes how we create web layouts.

      ## Basic Concepts
      - Grid Container: The parent element that holds the grid
      - Grid Items: The direct children of the grid container
      - Grid Lines: The dividing lines that make up the grid
      - Grid Tracks: The space between two adjacent grid lines
      - Grid Areas: A rectangular area made up of one or more grid cells

      ## Grid Properties
      ### Container Properties
      - display: grid
      - grid-template-columns
      - grid-template-rows
      - grid-template-areas
      - grid-gap
      - justify-items
      - align-items

      ### Item Properties
      - grid-column
      - grid-row
      - grid-area
      - justify-self
      - align-self

      ## Common Layout Patterns
      - Holy Grail Layout
      - Card Grid
      - Magazine Layout
      - Dashboard Layout
      - Form Layout

      ## Responsive Design with Grid
      - Using auto-fit and auto-fill
      - Media queries with grid
      - Responsive grid areas
      - Fluid grid layouts

      ## Best Practices
      - Use named grid lines
      - Implement fallbacks for older browsers
      - Combine with Flexbox when needed
      - Use CSS custom properties for grid values
      - Optimize for performance
    `
  },
  '3': {
    title: 'JavaScript Fundamentals',
    description: 'Essential concepts and patterns in JavaScript programming',
    content: `
      # JavaScript Fundamentals

      ## Core Concepts
      - Variables and Data Types
      - Operators and Expressions
      - Control Flow (if/else, switch, loops)
      - Functions and Scope
      - Objects and Prototypes
      - Arrays and Array Methods

      ## Advanced Features
      - Closures and Lexical Scope
      - Prototypal Inheritance
      - Asynchronous Programming
      - Promises and Async/Await
      - Modules and Import/Export
      - Error Handling

      ## ES6+ Features
      - Arrow Functions
      - Template Literals
      - Destructuring
      - Spread and Rest Operators
      - Classes and Inheritance
      - Modules
      - Promises
      - Async/Await

      ## Design Patterns
      - Module Pattern
      - Factory Pattern
      - Singleton Pattern
      - Observer Pattern
      - Prototype Pattern
      - Command Pattern

      ## Best Practices
      - Code Organization
      - Error Handling
      - Performance Optimization
      - Security Considerations
      - Testing Strategies
    `
  },
  '4': {
    title: 'React Hooks Guide',
    description: 'Deep dive into React Hooks and their practical applications',
    content: `
      # React Hooks Guide

      ## Introduction to Hooks
      - What are Hooks?
      - Why use Hooks?
      - Rules of Hooks
      - Custom Hooks

      ## Core Hooks
      ### useState
      - Basic usage
      - Functional updates
      - Lazy initialization
      - Best practices

      ### useEffect
      - Side effects
      - Cleanup function
      - Dependency array
      - Common patterns

      ### useContext
      - Context API
      - Performance considerations
      - Use cases
      - Best practices

      ## Additional Hooks
      ### useReducer
      - State management
      - Complex state logic
      - Performance optimization

      ### useCallback
      - Memoization
      - Performance optimization
      - Common use cases

      ### useMemo
      - Expensive calculations
      - Performance optimization
      - When to use

      ### useRef
      - DOM references
      - Mutable values
      - Common patterns

      ## Custom Hooks
      - Creating custom hooks
      - Sharing logic
      - Testing custom hooks
      - Best practices

      ## Advanced Patterns
      - Compound components
      - Render props
      - Higher-order components
      - Context patterns
    `
  }
}

export default function PDFPage({ params }) {
  const pdf = pdfContent[params.pdfId]

  if (!pdf) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">PDF not found</h1>
          <p className="text-gray-600 mt-2">The requested PDF could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{pdf.title}</h1>
        <p className="text-gray-600 mb-8">{pdf.description}</p>
        
        <div className="prose max-w-none">
          {pdf.content.split('\n').map((line, index) => {
            if (line.startsWith('#')) {
              const level = line.match(/^#+/)[0].length
              const text = line.replace(/^#+\s*/, '')
              return React.createElement(`h${level}`, { key: index, className: 'text-gray-900' }, text)
            }
            return <p key={index} className="text-gray-700">{line}</p>
          })}
        </div>
      </div>
    </div>
  )
} 