export interface TransferDetails {
  beneficiaryName: string;
  accountType?: string;
  swiftCode?: string;
  routingNumber?: string;
  bankAddress?: string;
  transferType: 'local' | 'international';
}

export interface Transaction {
  refNo: string;
  amount: number;
  receivingAccount: string;
  bank: string;
  type: 'debit' | 'credit';
  description: string;
  beneficiaryName?: string;
  accountType?: string;
  swiftCode?: string;
  routingNumber?: string;
  bankAddress?: string;
  transferType?: 'local' | 'international';
}

export interface StubData {
  accountBalance: number;
  ledgerBalance: number;
  transactions: Transaction[];
}

const banks = ['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Goldman Sachs', 'Morgan Stanley', 'HSBC', 'Barclays', 'Deutsche Bank', 'Credit Suisse'];
const descriptions = ['Wire Transfer', 'ACH Payment', 'Online Purchase', 'Bill Payment', 'Salary Deposit', 'Refund', 'Invoice Payment', 'Subscription', 'ATM Withdrawal', 'Transfer'];
const refPrefixes = ['WRT', 'ACH', 'RFD', 'INV', 'SAL', 'BIL', 'ONP', 'SUB'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRef(): string {
  const prefix = pick(refPrefixes);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return prefix + suffix;
}

function randomAccountId(): string {
  return '****' + String(Math.floor(10000000 + Math.random() * 90000000));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function plausibleCent(): number {
  const cents = [0, 0, 0, 25, 50, 50, 75, 99];
  return cents[Math.floor(Math.random() * cents.length)] / 100;
}

function distributeAmount(total: number, parts: number): number[] {
  const amounts: number[] = [];
  let remaining = total;
  for (let i = 0; i < parts - 1; i++) {
    const max = remaining * 0.55;
    const min = Math.min(remaining * 0.05, 50);
    const amt = Math.round((Math.random() * (max - min) + min) * 100) / 100;
    amounts.push(amt);
    remaining = Math.round((remaining - amt) * 100) / 100;
  }
  amounts.push(Math.round(remaining * 100) / 100);
  return amounts;
}

function seedTransactionsForBalance(target: number): Transaction[] {
  const txnCount = 8 + Math.floor(Math.random() * 5);
  const creditCount = Math.max(3, Math.floor(txnCount * 0.55));
  const debitCount = txnCount - creditCount;
  const totalDebit = Math.round((Math.random() * target * 0.4 + target * 0.05) * 100) / 100;
  const totalCredit = Math.round((target + totalDebit) * 100) / 100;

  const creditAmounts = distributeAmount(totalCredit, creditCount);
  const debitAmounts = distributeAmount(totalDebit, debitCount);

  const txns: Transaction[] = [];
  for (let i = 0; i < creditCount; i++) {
    txns.push({
      refNo: randomRef(),
      amount: creditAmounts[i],
      receivingAccount: randomAccountId(),
      bank: pick(banks),
      type: 'credit',
      description: pick(descriptions.filter(d => d !== 'ATM Withdrawal')),
    });
  }
  for (let i = 0; i < debitCount; i++) {
    txns.push({
      refNo: randomRef(),
      amount: debitAmounts[i],
      receivingAccount: randomAccountId(),
      bank: pick(banks),
      type: 'debit',
      description: pick(descriptions),
    });
  }
  return shuffle(txns);
}

function generateNewTransactions(count: number): Transaction[] {
  const txns: Transaction[] = [];
  // Generate 1 debit + N credits so net is always positive
  for (let i = 0; i < count; i++) {
    const amount = Math.round((Math.random() * 15000 + 500) * 100) / 100;
    txns.push({
      refNo: randomRef(),
      amount,
      receivingAccount: randomAccountId(),
      bank: pick(banks),
      type: 'credit',
      description: pick(descriptions.filter(d => d !== 'ATM Withdrawal')),
    });
  }
  // Add one small debit to keep it realistic
  for (let i = 0; i < Math.min(count, 2); i++) {
    const amount = Math.round((Math.random() * 2000 + 50) * 100) / 100;
    txns.push({
      refNo: randomRef(),
      amount,
      receivingAccount: randomAccountId(),
      bank: pick(banks),
      type: 'debit',
      description: pick(descriptions),
    });
  }
  return shuffle(txns);
}

function storageKey(userId: string): string {
  return `av_data_${userId}`;
}

export function loadOrInitData(
  userId: string,
  serverBalance: number,
  isStatic: boolean
): StubData {
  const key = storageKey(userId);
  const saved = localStorage.getItem(key);
  const savedBalance = saved ? (JSON.parse(saved) as StubData).accountBalance : null;
  const balanceChanged = savedBalance !== null && Math.abs(savedBalance - serverBalance) > 1;

  // If balance changed significantly (e.g. range update), reset data
  if (saved && !balanceChanged && !isStatic) {
    try {
      return JSON.parse(saved) as StubData;
    } catch {
      // corrupted, fall through
    }
  }

  const ledger = serverBalance + Math.round((serverBalance * 0.005) * 100) / 100;
  const oldTxns = saved ? (JSON.parse(saved) as StubData).transactions : [];
  const keepTxns = (!isStatic && balanceChanged) ? [] : (isStatic && saved
    ? (Math.abs((JSON.parse(saved) as StubData).accountBalance - serverBalance) > 1
      ? [] : oldTxns)
    : oldTxns);
  const data: StubData = {
    accountBalance: serverBalance,
    ledgerBalance: ledger,
    transactions: keepTxns,
  };
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export function addAndSaveTransactions(
  userId: string,
  current: StubData,
  serverBalance: number,
  isStatic: boolean
): StubData {
  // Seed full transaction history if empty (e.g. after balance reset)
  if (current.transactions.length === 0) {
    const seed = seedTransactionsForBalance(serverBalance);
    const updated: StubData = {
      accountBalance: serverBalance,
      ledgerBalance: serverBalance + Math.round((serverBalance * 0.005) * 100) / 100,
      transactions: seed,
    };
    localStorage.setItem(storageKey(userId), JSON.stringify(updated));
    return updated;
  }

  const count = 1 + Math.floor(Math.random() * 3);
  const newTxns = generateNewTransactions(count);

  const net = newTxns.reduce((sum, txn) =>
    sum + (txn.type === 'credit' ? txn.amount : -txn.amount), 0
  );

  let newBalance: number;
  let newLedger: number;

  if (isStatic) {
    const offsetTxn: Transaction = {
      refNo: randomRef(),
      amount: Math.abs(net),
      receivingAccount: '****INTERNAL****',
      bank: 'System Adjustment',
      type: net > 0 ? 'debit' : 'credit',
      description: 'Balance Adjustment',
    };
    newTxns.push(offsetTxn);
    newBalance = serverBalance;
    newLedger = serverBalance + Math.round((serverBalance * 0.005) * 100) / 100;
  } else {
    newBalance = Math.round((current.accountBalance + net) * 100) / 100;
    if (newBalance < 0) newBalance = 0;
    const ledgerDiff = Math.round((net * 0.05) * 100) / 100;
    newLedger = Math.round((current.ledgerBalance + net + ledgerDiff) * 100) / 100;
    if (newLedger < 0) newLedger = 0;
  }

  const updated: StubData = {
    accountBalance: newBalance,
    ledgerBalance: newLedger,
    transactions: [...newTxns, ...current.transactions],
  };

  localStorage.setItem(storageKey(userId), JSON.stringify(updated));
  return updated;
}

export function processTransfer(
  userId: string,
  amount: number,
  receivingAccount: string,
  bank: string,
  description: string,
  transferDetails: TransferDetails
): StubData {
  const key = storageKey(userId);
  const saved = localStorage.getItem(key);
  if (!saved) throw new Error('No account data found');

  const data = JSON.parse(saved) as StubData;

  if (amount > data.accountBalance) {
    throw new Error('Insufficient balance');
  }

  const refPrefix = transferDetails.transferType === 'local' ? 'LTR' : 'ITR';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];

  const txn: Transaction = {
    refNo: refPrefix + suffix,
    amount,
    receivingAccount,
    bank,
    type: 'debit',
    description,
    beneficiaryName: transferDetails.beneficiaryName,
    accountType: transferDetails.accountType,
    swiftCode: transferDetails.swiftCode,
    routingNumber: transferDetails.routingNumber,
    bankAddress: transferDetails.bankAddress,
    transferType: transferDetails.transferType,
  };

  const newBalance = Math.round((data.accountBalance - amount) * 100) / 100;
  const newLedger = Math.round((data.ledgerBalance - amount) * 100) / 100;

  const updated: StubData = {
    accountBalance: newBalance,
    ledgerBalance: newLedger,
    transactions: [txn, ...data.transactions],
  };

  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}
