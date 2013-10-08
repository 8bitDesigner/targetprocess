var path = require('path')
  , exec = require('child_process').exec
  , config = require(path.join(process.env.HOME, '.targetprocess.json'))
  , tp = require('tp-api')({
      domain: config.domain,
      token: config.token
    })

var entity = process.argv[2]
  , amount = process.argv[3] || 100

if (process.argv[2] === 'open') {
  exec('open https://'+config.domain+'/entity/'+process.argv[3])
} else if (process.argv[2]) {
  tp(entity).take(amount).then(function(err, body) {
    console.log(JSON.stringify(body, null, 2))
    if (err) console.error('err', err)
  })
} else {
  tp('Context').then(function(err, ctx) {
    tp('Tasks').
      where("(AssignedUser.Id eq "+ctx.LoggedUser.Id+") and (EntityState.Name ne 'Done')").
      take(100).
      pluck('Name', 'Description', 'UserStory[Name]', 'Team[Name]', 'Project[Name]').
      sortBy('NumericPriority').
      then(function(err, tasks) {
        tasks.forEach(function(task) {
          console.log('['+task.Id+'] '+task.Name);
        })
      })
  })
}

