# Fix Plan

## Issue 1: Wave Animation Appears on All Pages
- WaveAnimation.jsx uses `window.innerWidth/Height` causing canvas overflow
- Need to scope it strictly to the hero section using ResizeObserver
- Ensure proper cleanup on unmount

## Issue 2: Login Fails with Correct Credentials
- Need proper axios interceptors for JWT handling
- Need token refresh mechanism
- Need better RBAC implementation
- Need better error handling on both frontend and backend

## Files to Edit
1. `frontend/src/components/WaveAnimation.jsx` - Fix scoping
2. `frontend/src/context/AuthContext.jsx` - Add axios interceptors, JWT refresh, RBAC
3. `frontend/src/pages/Login.jsx` - Better error handling
4. `backend/routes/auth.js` - Better error messages, ensure JWT works
5. `backend/middleware/auth.js` - Improve RBAC

