var request = require("request")
  , fs = require('fs')
  , path = require('path')
  , config = require(path.join(process.env.HOME, '.targetprocess.json'))

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

request({
  url: config.root + 'Tasks',
  json: true,
  qs: {
    take: 1000,
    where: "(AssignedUser.FirstName eq 'Paul') and (AssignedUser.LastName eq 'Sweeney')",
    include: '[Name, Description, Project, EntityState, NumericPriority]'
  },
  headers: { Authorization: 'Basic '+ config.token }
}, function(err, res, json) {
  json.Items.filter(isntState('Done')).sort(sortBy('NumericPriority')).forEach(function(item) {
    console.log('[ '+item.Id+' ] '+ item.Name)
  })
})
