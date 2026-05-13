const bcrypt = require('bcryptjs');
const passwords = [
  { id: 'u1', pass: 'pass1234' },
  { id: 'u2', pass: 'pass1234' },
  { id: 'u3', pass: 'pass1234' },
  { id: 'u4', pass: 'pass1122' },
  { id: 'u5', pass: 'pass1234' },
];
for (const { id, pass } of passwords) {
  const hash = bcrypt.hashSync(pass, 12);
  console.log(`// ${id} pass="${pass}"`);
  console.log(`'${hash}',`);
}
