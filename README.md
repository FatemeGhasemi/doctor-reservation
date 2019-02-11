[Sequilize migration](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)

## Db
If tpu want see sequilize queries in log add this line in `.env`

`LOG_QUERIES=true`

### init
For create db tables just enter this command 

`npm run db:init`

### Seed 
If you want seed db with mock data :

`npm run db:seed`

### Drop & Seed (Recommended)

if you want to drop tables first and then seed with mock data:

`npm run db:drop:seed`