const utils = require("../dist/cjs/index.js");

console.log(
  ".cjs -->",
  utils.jwt.encode({ id: 1, name: "John" }),
  utils.jwt.encode(undefined),
  utils.jwt.decode(utils.jwt.encode({ id: 1 })),
  utils.jwt.decode(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature",
  ),
  utils.jwt.decode(
    ".eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.",
  ),
  utils.jwt.decode("not-a-jwt"),
  utils.jwt.decode(123),
);
