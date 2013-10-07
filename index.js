var request = require("request")
  , fs = require('fs')
  , path = require('path')
  , ltx = require("ltx")

var urlRoot = 'https://fullscreen.tpondemand.com/api/v1/'
  , tokenPath = path.join(process.env.HOME, '.tptoken')
  , token = fs.readFileSync(tokenPath, {encoding: 'utf8'}).replace('\n', '')

request({
  url: urlRoot + 'Tasks',
  json: true,
  qs: {
    take: 1000,
    where: "(AssignedUser.FirstName eq 'Paul') and (AssignedUser.LastName eq 'Sweeney')",
    include: '[Name, Description, Project, EntityState, NumericPriority]'
  },
  headers: { Authorization: 'Basic '+token }
}, function(err, res, json) {
  try {
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

    json.Items.filter(isntState('Done')).sort(sortBy('NumericPriority')).forEach(function(item) {
      console.log('[ '+item.EntityState.Name+' ] '+ item.Name)
    })

    /*
    xml = ltx.parse(body)
    console.log(body)
    function isPlanned(node) { return node.getChild('EntityState').attrs.Name == 'Planned' }

    xml.getChildren('UserStory').filter(isPlanned).forEach(function(child) {
      var name = child.attrs.Name
        , project = child.getChild('Project').attrs['Name']
        , status = child.getChild('EntityState').attrs['Name']

      console.log('[',project,'@', status,']', name)
    })
    */
  } catch (e) {
    console.error('Could not parse XML: ',e)
  }
})
