var request = require("request")
  , fs = require('fs')
  , path = require('path')
  , Api = require('tp-api')

var config = require(path.join(process.env.HOME, '.targetprocess.json'))
  , tp = new Api({
      domain: config.domain,
      token: config.token
    })

function isntState(state) {
  return function(item) {
    return item.EntityState.Name !== state
  }
}

function sortBy(prop) {
  return function(a, b) {
    if (a.NumericPriority > b.NumericPriority) {
      return 1
    } else if (a.NumericPriority < b.NumericPriority) {
      return -1
    } else {
      return 0
    }
  }
}

var dingus = process.argv.pop()

tp[dingus](function(err, body) {
  console.log(dingus, body)
  if (err) console.error('err', err)
})

tp.tasks(function(err, tasks) {
})
