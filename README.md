# DIDPay

This is an example of a payment application that uses web5 and tbdex. 

## Important notice


This project is not currenty actively maintained, but is a placeholder for an approach that can be taken. Please check back!

This project is not intended to be used in production. For this to work in practice there needs to be a "PFI" (participating financial institution) listening for tbdex messages to provide quotes and settle payments. Hopefully we will add a "mock pfi" to implement this soon.

Look at `tbdex-thread.ts` for the most interesting code. 

## Running

To run this project:
```
npm install
npm run dev
```

![Screenshot 2023-08-08 at 4 58 27 pm](https://github.com/TBD54566975/tbdex-DIDPay-sample/assets/14976/823599f2-ea9c-40e7-ab31-f348bfa9a9da)


## Project Resources

| Resource                                   | Description                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| [CODEOWNERS](./CODEOWNERS)                 | Outlines the project lead(s)                                                   |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Expected behavior for project contributors, promoting a welcoming environment |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | Developer guide to build, test, run, access CI, chat, discuss, file issues     |
| [GOVERNANCE.md](./GOVERNANCE.md)           | Project governance                                                             |
| [LICENSE](./LICENSE)                       | Apache License, Version 2.0                                                    |
