var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../pearspikebot2.zip');
var kuduApi = 'https://pearspikebot2.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$pearspikebot2';
var password = 'yuQ52v0AB1YpGslPnmZjDvEpS5L9ZAX5tHr34zX4CoGTEk9KLwd82la7w7ac';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('pearspikebot2 publish');
  } else {
    console.error('failed to publish pearspikebot2', err);
  }
});