var path = require('path')
  , config = require(path.join(process.env.HOME, '.targetprocess.json'))
  , tp = require('tp-api')({
      domain: config.domain,
      token: config.token
    })

tp(process.argv.pop())
  .take(5)
  .where("EntityState.Name eq 'Open'")
  .pluck('Name', 'NumericPriority')
  .sortBy('NumericPriority')
  .then(function(err, body) {
    console.log(body)
    if (err) console.error('err', err)
  }
)
