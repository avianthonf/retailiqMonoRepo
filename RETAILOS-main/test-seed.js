fetch('http://localhost:3002/api/seed', {method:'POST'}).then(r=>r.json()).then(console.log).catch(console.error)
