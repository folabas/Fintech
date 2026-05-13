const bcrypt = require('bcryptjs');
const hashes = [
  { user: 'u1 David Ochoa (AV100000001)', hash: '$2b$12$1XcpPNzeC1bDm958Op8l3efSChT6Ye2BdBRG.8srvIw1NqYkU2KSu', pass: 'pass1234' },
  { user: 'u2 Bob Smith (AV100000002)', hash: '$2b$12$BAxj8ciQ8GMw/BLKHI8/..yqVLDVqOrW4XZ0gkC97XJ4ev0753v2e', pass: 'pass1234' },
  { user: 'u3 Carol Davis (AV100000003)', hash: '$2b$12$VuchClKPQgaL0uNN9k/R0OFro6N9xdguW5IKSWFEWIXoSYuAsP7Ry', pass: 'pass1234' },
  { user: 'u4 David Ochoa (AV100000004)', hash: '$2b$12$4wVkU6vukyK44Cio4xDlL.kuvinxIV5gvj6/0.Y05WXKGE3KVbjRm', pass: 'pass1122' },
  { user: 'u5 Eva Martinez (AV100000005)', hash: '$2b$12$rVIMfkRHlUm7zrBU3TtQxON2Lq5TpwPJYR379la5w0HnRjdqz6VRO', pass: 'pass1234' },
];
for (const { user, hash, pass } of hashes) {
  console.log(user + ' => ' + pass + ': ' + (bcrypt.compareSync(pass, hash) ? 'OK' : 'FAIL'));
}
