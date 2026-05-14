export interface User {
  id: string;
  accountId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  accountBalance: number;
  ledgerBalance: number;
  transferMode: 'WIRE' | 'ACH' | 'SWIFT';
  since: string;
  cardType: 'verve' | 'visa' | 'mastercard';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  staticBalance?: boolean;
  dateOfBirth: string;
  address: string;
  maritalStatus: string;
  gender: string;
  occupation: string;
  phoneNumber: string;
}

export const users: User[] = [
  {
    id: 'u1-david-ochoa',
    accountId: 'AV100000001',
    fullName: 'David Ochoa',
    email: 'ochoadavid8008@gmail.com',
    passwordHash: '$2b$12$1XcpPNzeC1bDm958Op8l3efSChT6Ye2BdBRG.8srvIw1NqYkU2KSu',
    createdAt: '2023-09-05T10:00:00.000Z',
    accountBalance: 5000000.00,
    ledgerBalance: 5025000.00,
    transferMode: 'WIRE',
    since: 'Sep 05, 2023',
    cardType: 'visa',
    cardNumber: '4916 2304 8756 1243',
    cardExpiry: '12/30',
    cardCvc: '305',
    staticBalance: true,
    dateOfBirth: '04/16/1980',
    address: '7905 Wanebe Dr, Dallas, TX 75235',
    maritalStatus: 'Single',
    gender: 'Male',
    occupation: 'Disable/SSI',
    phoneNumber: '214-229-2675',
  },
  {
    id: 'u2-bob-smith',
    accountId: 'AV100000002',
    fullName: 'Bob Smith',
    email: 'bob@email.com',
    passwordHash: '$2b$12$BAxj8ciQ8GMw/BLKHI8/..yqVLDVqOrW4XZ0gkC97XJ4ev0753v2e',
    createdAt: '2023-09-05T10:00:00.000Z',
    accountBalance: 45000000.00,
    ledgerBalance: 45225000.00,
    transferMode: 'ACH',
    since: 'Sep 05, 2023',
    cardType: 'verve',
    cardNumber: '5061 0996 7843 2156',
    cardExpiry: '09/31',
    cardCvc: '617',
    dateOfBirth: '11/05/1978',
    address: '845 Maple Drive, Chicago, IL 60614',
    maritalStatus: 'Single',
    gender: 'Male',
    occupation: 'Financial Analyst',
    phoneNumber: '312-555-0198',
  },
  {
    id: 'u3-carol-davis',
    accountId: 'AV100000003',
    fullName: 'Carol Davis',
    email: 'carol@email.com',
    passwordHash: '$2b$12$VuchClKPQgaL0uNN9k/R0OFro6N9xdguW5IKSWFEWIXoSYuAsP7Ry',
    createdAt: '2023-09-05T10:00:00.000Z',
    accountBalance: 2500000.00,
    ledgerBalance: 2512500.00,
    transferMode: 'SWIFT',
    since: 'Sep 05, 2023',
    cardType: 'mastercard',
    cardNumber: '5399 8412 3456 7890',
    cardExpiry: '03/32',
    cardCvc: '492',
    dateOfBirth: '07/22/1990',
    address: '321 Pine Road, Austin, TX 78701',
    maritalStatus: 'Single',
    gender: 'Female',
    occupation: 'Marketing Manager',
    phoneNumber: '512-555-0367',
  },
  {
    id: 'u4-david-ochoa',
    accountId: 'AV100000004',
    fullName: 'David Ochoa',
    email: 'ochoadavid8008@gmail.com',
    passwordHash: '$2b$12$4wVkU6vukyK44Cio4xDlL.kuvinxIV5gvj6/0.Y05WXKGE3KVbjRm',
    createdAt: '2023-09-05T10:00:00.000Z',
    accountBalance: 85000000.00,
    ledgerBalance: 85425000.00,
    transferMode: 'WIRE',
    since: 'Sep 05, 2023',
    cardType: 'visa',
    cardNumber: '4916 2304 8756 1243',
    cardExpiry: '06/33',
    cardCvc: '305',
    dateOfBirth: '04/16/1980',
    address: '7905 Wanebe Dr, Dallas, TX 75235',
    maritalStatus: 'Single',
    gender: 'Male',
    occupation: 'Disable/SSI',
    phoneNumber: '214-229-2675',
  },
  {
    id: 'u5-eva-martinez',
    accountId: 'AV100000005',
    fullName: 'Eva Martinez',
    email: 'eva@email.com',
    passwordHash: '$2b$12$rVIMfkRHlUm7zrBU3TtQxON2Lq5TpwPJYR379la5w0HnRjdqz6VRO',
    createdAt: '2023-09-05T10:00:00.000Z',
    accountBalance: 125000000.00,
    ledgerBalance: 125625000.00,
    transferMode: 'ACH',
    since: 'Sep 05, 2023',
    cardType: 'verve',
    cardNumber: '5061 7824 9031 4687',
    cardExpiry: '11/34',
    cardCvc: '521',
    dateOfBirth: '09/30/1995',
    address: '567 Elm Boulevard, Miami, FL 33101',
    maritalStatus: 'Married',
    gender: 'Female',
    occupation: 'Registered Nurse',
    phoneNumber: '305-555-0724',
  },
];
