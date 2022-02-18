NodeJS need to be installed to run this signer.

To use this signer first create a file called .env and add like this:

PRIVATE_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
DATABASE_URI = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

The PRIVATE_KEY is the address of the PRIVATE KEY of the account you want to use for signature.
The DATABASE_URI is the uri of the mongodb database that have the signature data.

now open the file called List.js and paste all the wallet address string separated by comma.

after that open a terminal in the folder and run ' npm i '
after that run ' npm start ' this will create all the signatures and will add them to database.