import express from 'express';
import * as authenticate from './controllers/authenticate';
import * as user from './controllers/user';
import * as lunch from './controllers/lunch';

const router = express.Router();

// User
router.get('/user/:id', authenticate.auth, user.get)
router.post('/user', authenticate.auth, user.create)

// Lunch
router.get('/lunches', lunch.get)
router.get('/lunch/today', lunch.getTodayLunch)
router.get('/lunch/tomorrow', lunch.getTomorrowLunch)
router.post('/lunch', authenticate.auth, lunch.create)
router.delete('/lunch', authenticate.auth, lunch.remove)

// Authenticate
router.get('/auth/exists/email/:email', authenticate.existsEmail)
router.post('/auth/login', authenticate.login)
router.get('/auth/logout', authenticate.logout)
router.post('/auth/register', authenticate.register)
router.post('/auth/token', authenticate.validateToken)

export default router
