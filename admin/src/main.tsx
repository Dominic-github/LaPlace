/**
 * Webest FastShop - Admin Panel
 *
 * @author Webest Group
 * @website https://webest.asia
 * @copyright Copyright (c) 2024 Webest Group. All rights reserved.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './ErrorBoundary'

console.log('%c🛍️ Webest FastShop Admin Panel', 'color: #a855f7; font-size: 16px; font-weight: bold;');
console.log('%c© 2024 Webest Group - https://webest.asia', 'color: #868e96; font-size: 12px;');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
