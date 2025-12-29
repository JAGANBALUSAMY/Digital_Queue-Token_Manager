// Simple redirect based on URL path
const path = window.location.pathname;

// Redirect to the appropriate portal based on path
if (path === '/' || path === '/index.html') {
  // Keep the landing page as is, served by index.html
} else {
  // Redirect to the appropriate portal
  if (path.startsWith('/user')) {
    window.location.href = '/user' + path.substring(5);
  } else if (path.startsWith('/staff-manager-owner')) {
    window.location.href = '/staff-manager-owner' + path.substring(18);
  }
}
