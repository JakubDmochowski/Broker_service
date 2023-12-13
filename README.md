This is a property broker service.

General idea on example with Booking:

- Receive a request
- Get information about the payload and venue it is assigned to
- Based on the information, pick to which system the booking should be passed
- Pass the booking to the system

Requirements:
Connection with database setup using DATABASE_URL in .env

Installation using command line (from project root directory):
- npm install
- npm run db:migrate
- npm run db:seed         # this inserts 4 venues with ids as int on autoincrement,
                          # two venues with SystemA, two with SystemB into the database

Deploy/use:
- npm run build
- npm run start

Provided with two mock systems in '/mock_systems/' directory.
They can be run using 
- npm run build:<sys>
- npm run start:<sys>
where <sys> can be replaced with either mockA or mockB

Additional run_mocks.bat script was added to run both mock systems for testing purposes.
TODO: Create unit tests
