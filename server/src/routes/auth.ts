import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../models/user';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'apexvault_secret';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { accountId, passcode } = req.body;

    if (!accountId || !passcode) {
      return res.status(400).json({ message: 'Account ID and passcode are required' });
    }

    const user = users.find((u) => u.accountId === accountId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid Account ID or passcode' });
    }

    const valid = await bcrypt.compare(passcode, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid Account ID or passcode' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user.id,
        accountId: user.accountId,
        fullName: user.fullName,
        email: user.email,
        accountBalance: user.accountBalance,
        ledgerBalance: user.ledgerBalance,
        transferMode: user.transferMode,
        since: user.since,
        cardType: user.cardType,
        cardNumber: user.cardNumber,
        cardExpiry: user.cardExpiry,
        cardCvc: user.cardCvc,
        staticBalance: user.staticBalance ?? false,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        maritalStatus: user.maritalStatus,
        gender: user.gender,
        occupation: user.occupation,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auth/me  (protected — simple token check)
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      id: user.id,
      accountId: user.accountId,
      fullName: user.fullName,
      email: user.email,
      accountBalance: user.accountBalance,
      ledgerBalance: user.ledgerBalance,
      transferMode: user.transferMode,
      since: user.since,
      cardType: user.cardType,
      cardNumber: user.cardNumber,
      cardExpiry: user.cardExpiry,
      cardCvc: user.cardCvc,
      staticBalance: user.staticBalance ?? false,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      maritalStatus: user.maritalStatus,
      gender: user.gender,
      occupation: user.occupation,
      phoneNumber: user.phoneNumber,
    });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// PATCH /api/auth/profile  (protected — update personal info)
router.patch('/profile', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allowedFields = ['dateOfBirth', 'address', 'maritalStatus', 'gender', 'occupation', 'phoneNumber'];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        (user as any)[key] = req.body[key];
      }
    }

    return res.json({
      id: user.id,
      accountId: user.accountId,
      fullName: user.fullName,
      email: user.email,
      accountBalance: user.accountBalance,
      ledgerBalance: user.ledgerBalance,
      transferMode: user.transferMode,
      since: user.since,
      cardType: user.cardType,
      cardNumber: user.cardNumber,
      cardExpiry: user.cardExpiry,
      cardCvc: user.cardCvc,
      staticBalance: user.staticBalance ?? false,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      maritalStatus: user.maritalStatus,
      gender: user.gender,
      occupation: user.occupation,
      phoneNumber: user.phoneNumber,
    });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
