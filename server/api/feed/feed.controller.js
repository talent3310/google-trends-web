/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/feeds              ->  index
 * POST    /api/feeds              ->  create
 * GET     /api/feeds/:id          ->  show
 * PUT     /api/feeds/:id          ->  upsert
 * PATCH   /api/feeds/:id          ->  patch
 * DELETE  /api/feeds/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
var request = require('request');
import { Feed } from '../../sqldb';
import { Hides } from '../../sqldb';
import { Monitor } from '../../sqldb';
import { FilteredFeeds } from '../../sqldb';
import { diff_past1day_view } from '../../sqldb';
import { diff_past7days_view } from '../../sqldb';
import { diff_past30days_view } from '../../sqldb';

var async = require("async");

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log('handleError: ', err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Feeds
export function index(req, res) {
  return Feed.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Feed from the DB
export function show(req, res) {
  return Feed.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Feed in the DB
export function create(req, res) {
  return Feed.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Feed in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Feed.upsert(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Feed in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Feed.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Feed from the DB
export function destroy(req, res) {
  return Feed.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function getYMD(date) {
  var dateObj = date;
  var month = dateObj.getMonth() + 1; //months from 1-12
  var day = dateObj.getDate();
  var year = dateObj.getFullYear();
  var newdate = year + "-" + month + "-" + day;
  return newdate;
}
function getYMD_UTC(date) {
  var dateObj = date;
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	if(month < 10) month = '0' + month;
	var day = dateObj.getUTCDate();
	if(day < 10) day = '0' + day;
	var year = dateObj.getUTCFullYear();
	var newdate = year + "-" + month + "-" + day;
  return newdate;
}
//getFilteredData
export function getFilteredData(req, res) {
  var data = req.body;
  console.log("data==============>", data);
  // var startTime, endTime, tempTime;
  // if (!data.date) {
  //   tempTime = getYMD(new Date());
  //   startTime = tempTime + ' 00:00:00.000Z';
  // } else {
  //   tempTime = getYMD(new Date(data.date));
  //   startTime = tempTime + ' 00:00:00.000Z';
  // }
  // endTime = tempTime + ' 23:59:59.000Z';
  //category, keyword, date, period, searchType, start, number
  var query = {
    where: {}
  };
  var queryForPageNum = {
    where: {}
  };
  // getYMD_UTC(new Date(data.date))
  query.where.createdAt = {$lte: new Date(data.date)} ;
  queryForPageNum.where.createdAt = {$lte: new Date(data.date)};
  if (data.category || data.category === 0) {
    query.where.path = '' + data.category;
    queryForPageNum.where.path = '' + data.category;
  }
  if (data.period != 'all') {
    query.where.periodMonth = data.period;
    queryForPageNum.where.periodMonth = data.period;
  }
  // if (data.searchType != 'all') {
  //   query.where.searchType = data.searchType;
  //   queryForPageNum.where.searchType = data.searchType;
  // }

  if (data.keyword) {
    query.where.keyword = { $like: '%' + data.keyword + '%' };
  }

  if (data.sort.predicate) {
    if (data.sort.reverse == true) {
      query.order = [
        [data.sort.predicate, 'DESC'],
      ];
    } else {
      query.order = [
        [data.sort.predicate, 'ASC'],
      ];
    }
  }
  if (data.keyword) {
    queryForPageNum.where.keyword = { $like: '%' + data.keyword + '%' }
  }

  queryForPageNum.attributes = ['_id'];

  query.offset = data.start;
  query.limit = data.number;

  console.log("!query:", query);

  switch (data.type) {
    case 'feeds':
      async.parallel({
        pageNum: function(callback) {
          FilteredFeeds.count(queryForPageNum)
            .then(count => {
              callback(null, { numOfpages: Math.ceil(count / data.number), numOfItems: count });
            }).catch(handleError(res));
        },
        data: function(callback) {
          FilteredFeeds.findAll(query)
            .then(items => {
              callback(null, items);
            }).catch(handleError(res));
        }
      }, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        return res.status(201).json({ data: results.data, numberOfPages: results.pageNum.numOfpages, numberOfItems: results.pageNum.numOfItems });
      });
      break;

    case 'monitor':
      delete query.where.createdAt;
      delete queryForPageNum.where.createdAt;
      async.parallel({
        pageNum: function(callback) {
          Monitor.count(queryForPageNum)
            .then(count => {
              callback(null, { numOfpages: Math.ceil(count / data.number), numOfItems: count });
            }).catch(handleError(res));
        },
        data: function(callback) {
          Monitor.findAll(query)
            .then(items => {
              callback(null, items);
            }).catch(handleError(res));
        }
      }, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        return res.status(201).json({ data: results.data, numberOfPages: results.pageNum.numOfpages, numberOfItems: results.pageNum.numOfItems });
      });
      break;
    case 'hides':
      delete query.where.createdAt;
      delete queryForPageNum.where.createdAt;
      async.parallel({
        pageNum: function(callback) {
          Hides.count(queryForPageNum)
            .then(count => {
              callback(null, { numOfpages: Math.ceil(count / data.number), numOfItems: count });
            }).catch(handleError(res));
        },
        data: function(callback) {
          Hides.findAll(query)
            .then(items => {
              callback(null, items);
            }).catch(handleError(res));
        }
      }, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        return res.status(201).json({ data: results.data, numberOfPages: results.pageNum.numOfpages, numberOfItems: results.pageNum.numOfItems });
      });
      break;
  }

}

 
export function moveFromFeeds(req, res) {
  var modelTemp;
  console.log('=======1===========>', req.body.category);

  if (req.body.category === 'hidden') {
    modelTemp = Hides;
    console.log('-----2------hidden yes!-----------');
  }
  else {
    modelTemp = Monitor;
    console.log('------3-----monitor yes!-----------');
  }
  return Feed.findAll({
      where: {
        _id: req.body.ids
      },
      raw: true,
    })
    .then(items => {
      // console.log("items=>", items);
      for(var i = 0; i < items.length; i++) {
        delete items[i]._id
      }
      modelTemp.bulkCreate(items, { updateOnDuplicate: true }).then(result => {
        return res.status(201).end();
      }).catch(handleError(res));
    })

}

export function unhideFromHides(req, res) {
  return Hides.destroy({ where: { _id: req.body.ids } }).then(() => {
    return res.status(201).end();
  }).catch(handleError(res));
}

export function removeFromMonitor(req, res) {
  return Monitor.destroy({ where: { _id: req.body.ids } }).then(() => {
    return res.status(201).end();
  }).catch(handleError(res));
}

function nDaysAgoFromAny(date, nDays) {
  var temp = new Date(date);
  var dd = temp.setDate(temp.getDate() - nDays);
  return getYMD(new Date(dd));
  // return new Date(dd);
}

function getTotal(arry) {
  var total = 0;
  for (var i = 0; i < arry.length; i++) {
    total += arry[i].nums;
  }
  return total;
}

export function getHistory(req, res) {
  // var clientNow = req.body.now + ' 00:00:00.000Z';
  var clientNow = req.body.now;

  var api_key = 'key-d036f75540c964f03636ce9026778aac';
  var domain = 'sandboxa44465646c6640f494ce29dc70f69514.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('-------------called!-------------', ip);
  var ipList = [
    '127.0.0.1', '122.201.22.254', '69.88.134.87', '66.181.185.170', '223.25.242.91', '150.129.142.50'
  ]
  if(ipList.indexOf(ip) == -1) {//not in the array, then ping
    var data = {
      from: 'GTrends feeeup.bzaya@gmail.com',
      to: 'tsogtbayar0821@hotmail.com',
      subject: 'Notice',
      html: ip
    };
    var url = 'https://www.freegeoip.net/json/' + ip;
    request(url, function (error, response, body) {     
      if(error) {
        mailgun.messages().send(data, function (error, body) {
          console.log(body);
        });
      } else {
        body = JSON.parse(body);
        if(body.country_name != 'Mongolia') {
          data.html = '<b>country</b>: ' + body.country_name + '<br><b>city</b>: ' + body.city + '<br><b>ip</b>: ' + body.ip + '<br><b>time</b>: ' + new Date().toLocaleString('en-US', { timeZone: 'Asia/Ulan_Bator' }) + '<br><br>It is notice.';
          // mailgun.messages().send(data, function (error, body) {
          //   console.log(body);
          // });
        }
        
      }
    });
  }
  async.parallel({
    one: function(callback) {
      diff_past1day_view.count()
        .then(count => {
          callback(null, count);
        });
    },
    seven: function(callback) {
      diff_past7days_view.count()
        .then(count => {
          callback(null, count);
        });
    },
    thirty: function(callback) {
      diff_past30days_view.count()
        .then(count => {
          callback(null, count);
        });
    }
  }, function(err, result) {
      console.log("result=======>", result);
    return res.status(201).json({ one: result.one, seven: result.seven, thirty: result.thirty });
  });
}

export function setPriority(req, res) {
    console.log("setPriority===>", req.body);
  return Monitor.update(
    { priority: req.body.priority },
    { where: { _id: req.body._id }}
  ).then(() => {
    return res.status(201).end();
  }).catch(handleError(res));

}
/*

CREATE VIEW filtered_feeds_view AS
SELECT  *
FROM    feeds
WHERE   _id NOT IN (SELECT _id FROM hides)
*/
//http://crystalcube.co.kr/163

/*
CREATE VIEW filtered_feeds_view AS
SELECT c.*
FROM feeds AS c
WHERE NOT EXISTS 
      ( SELECT 1
        FROM hides AS p
        WHERE p.keyword = c.keyword
      ) ;

CREATE VIEW filtered_feeds_view AS
SELECT c.*
FROM feeds AS c
WHERE NOT EXISTS 
      ( SELECT 1
        FROM hides AS p
        WHERE p.keyword = c.keyword
      ) 
AND NOT EXISTS   ( SELECT 1
        FROM monitor AS p
        WHERE p.keyword = c.keyword
      ) 
ORDER BY SUBSTR(createdAt, 1, 10), keyword;

CREATE VIEW filtered_feeds_view AS
SELECT c.*
FROM feeds AS c
WHERE NOT EXISTS 
      ( SELECT 1
        FROM hides AS p
        WHERE p.keyword = c.keyword
      ) 
AND NOT EXISTS  
    ( SELECT 1
        FROM monitor AS m
        WHERE m.keyword = c.keyword
      ) 
ORDER BY SUBSTR(createdAt, 1, 10), keyword;

DELETE FROM feeds AS f
 WHERE NOT EXISTS(SELECT 1
                    FROM hides AS h
                   WHERE h.keyword = f.keyword);

===================== delete rows ===========================
DELETE FROM feeds
WHERE EXISTS (
    SELECT *
    FROM hides
    WHERE keyword = feeds.keyword
)


===================== today_view ===========================
CREATE VIEW today_view AS
SELECT *
FROM filtered_feeds_view
WHERE (createdAt = CURDATE())

===================== past1day_view ===========================
CREATE VIEW past1day_view AS
SELECT *
FROM filtered_feeds_view
WHERE (createdAt = DATE_ADD(CURDATE(), INTERVAL -1 day))

===================== past7days_view ===========================
CREATE VIEW past7days_view AS
SELECT *
FROM filtered_feeds_view
WHERE (createdAt BETWEEN DATE_ADD(CURDATE(), INTERVAL -8 day) AND DATE_ADD(CURDATE(), INTERVAL -1 day))

===================== past30days_view ===========================
CREATE VIEW past30days_view AS
SELECT *
FROM filtered_feeds_view
WHERE (createdAt BETWEEN DATE_ADD(CURDATE(), INTERVAL -31 day) AND DATE_ADD(CURDATE(), INTERVAL -1 day))

===================== diff_past1day_view ===========================
CREATE VIEW diff_past1day_view AS
SELECT *
FROM today_view AS t
WHERE NOT EXISTS 
      ( SELECT 1
        FROM past1day_view AS p
        WHERE p.keyword = t.keyword
      ) 
ORDER BY keyword;
===================== diff_past7days_view ===========================
CREATE VIEW diff_past7days_view AS
SELECT *
FROM today_view AS t
WHERE NOT EXISTS 
      ( SELECT 1
        FROM past7days_view AS p
        WHERE p.keyword = t.keyword
      ) 
ORDER BY keyword;
===================== diff_past30days_view ===========================
CREATE VIEW diff_past30days_view AS
SELECT *
FROM today_view AS t
WHERE NOT EXISTS 
      ( SELECT 1
        FROM past30days_view AS p
        WHERE p.keyword = t.keyword
      ) 
ORDER BY keyword;

=================== delete someting===============
DELETE FROM test WHERE id NOT IN (SELECT min(b.id) FROM (SELECT * FROM test) AS b GROUP BY b.keyword ORDER BY b.createdat)

===============================================
CREATE TABLE new_feeds AS SELECT * FROM test WHERE id IN (SELECT min(id) FROM test GROUP BY keyword ORDER BY createdAt);
===============================================
SELECT * FROM `feeds` t1, `feeds` t2 WHERE t1._id > t2._id AND t1.keyword = t2.keyword
*/

