const Gun = require('gun');
// require('gun/sea')

const gun = Gun({ peers: ['http://localhost:8080/gun', 'http://localhost:8090/gun'] });
gun.get('~@adam').then(console.log)


gun.user().auth('adam', '8888', (ack) => {
    console.log(ack);
})
