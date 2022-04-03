const redis = require('redis');
const Promise = require('bluebird');

/**
 * This module implements a promise interface for Redis.
 */
class mRedis {
  /**
   * Creates an instance of a redis connection.
   *
   * @param {object} configs
   */
  constructor() {
    this.oRedis = redis.createClient();
  }

  /**
   * Set key to hold the string value and set key to timeout after a given number of seconds.
   *
   * @param {string} sKey
   * @param {integer} stime
   * @param {string} sValue
   * @returns {promise}
   */
  setex(sKey, stime, sValue) {
    return new Promise((resolve, reject) => {
      if (typeof sValue !== 'string') {
        sValue = JSON.stringify(sValue);
      }

      this.oRedis.SETEX(sKey, stime, sValue, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  pBrpop(sList, blockTime) {
    return new Promise((resolve, reject) => {
      this.oRedis.BRPOP(sList, blockTime, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Set an expiring time on key.
   *
   * @param {string} key
   * @param {string} time
   * @returns {promise}
   */
  expire(key, time) {
    return new Promise((resolve, reject) => {
      this.oRedis.EXPIRE(key, time, function (eError) {
        if (eError) {
          return reject(eError);
        }

        return resolve();
      });
    });
  }
  /**
   * Delete all the keys of the selected DB
   *
   * @returns {promise}
   */
  flushDb() {
    return new Promise((resolve, reject) => {
      this.oRedis.FLUSHDB((eError, result) => {
        if (eError) {
          return reject(eError);
        }

        return resolve(result);
      });
    });
  }
  /**
   * Sets field in the hash stored at key to value
   *
   * @param {String} key
   * @param {String} field
   * @param {String} value
   * @returns {promise}
   */
  hset(key, field, value) {
    return new Promise((resolve, reject) => {
      this.oRedis.HSET(key, field, value, function (eError, result) {
        if (eError) {
          return reject(eError);
        }

        return resolve(result);
      });
    });
  }
  /**
   * Set sKey to hold the sValue value.
   *
   * @param {string} sKey
   * @param {string} sValue
   * @returns {promise}
   */
  set(sKey, sValue) {
    return new Promise((resolve, reject) => {
      if (typeof sValue !== 'string') {
        sValue = JSON.stringify(sValue);
      }

      this.oRedis.SET(sKey, sValue, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  get(sKey) {
    return new Promise((resolve, reject) => {
      this.oRedis.GET(sKey, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        try {
          oResult = JSON.parse(oResult);
        } catch (pError) {
          if (!(pError instanceof SyntaxError)) {
            return reject(pError);
          }
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes the specified keys.
   *
   * @param {string} sKey
   * @returns {promise}
   */
  del(sKey) {
    return new Promise((resolve, reject) => {
      this.oRedis.DEL(sKey, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Sets the specified fields to their respective values in the hash stored at sHash.
   *
   * @param {string} sHash
   * @param {array} aFields
   * @returns {promise}
   */
  hmset(sHash, aFields) {
    return new Promise((resolve, reject) => {
      this.oRedis.HMSET(sHash, aFields, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns the value associated with sField in the hash stored at sHash.
   *
   * @param {string} sHash
   * @param {array} sField
   * @returns {promise}
   */
  hget(sHash, sField) {
    return new Promise((resolve, reject) => {
      this.oRedis.HGET(sHash, sField, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes the specified fields from the hash stored at sHash.
   *
   * @param {string} sHash
   * @param {array} aFields
   * @returns {promise}
   */
  hdel(sHash, aFields) {
    return new Promise((resolve, reject) => {
      this.oRedis.HDEL(sHash, aFields, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns the values associated with the specified fields in the hash stored at sHash.
   *
   * @param {string} sHash
   * @param {array} aFields
   * @returns {promise}
   */
  HMGET(sHash, aFields) {
    return new Promise((resolve, reject) => {
      this.oRedis.HMGET(sHash, aFields, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns all fields and values of the hash stored at key.
   *
   * @param {string} key
   * @returns {promise}
   */
  hgetall(key) {
    return new Promise((resolve, reject) => {
      this.oRedis.HGETALL(key, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Dulicates the hash.
   *
   * @param {string} sOriginalKey
   * @param {string} sDuplicateKey
   * @returns {promise}
   */
  duplicateHash(sOriginalKey, sDuplicateKey) {
    return new Promise((resolve, reject) => {
      this.oRedis.HGETALL(sOriginalKey, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        this.oRedis.HMSET(sDuplicateKey, oResult, function (eError, oResult) {
          if (eError) {
            return reject(eError);
          }

          return resolve(oResult);
        });
      });
    });
  }
  /**
   * Increments the number stored at sField in the hash stored at sHash by 1.
   *
   * @param {string} sHash
   * @param {string} sField
   * @returns {promise}
   */
  incOneHash(sHash, sField) {
    return new Promise((resolve, reject) => {
      this.oRedis.HINCRBY(sHash, sField, 1, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Increments the number stored at sField in the hash stored at sHash by iValue.
   *
   * @param {string} sHash
   * @param {string} sField
   * @param {integer} iValue
   * @returns {promise}
   */
  incSomeHash(sHash, sField, iValue) {
    return new Promise((resolve, reject) => {
      this.oRedis.HINCRBY(sHash, sField, iValue, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Insert all the specified values at the tail of the list stored at sList.
   *
   * @param {string} sList
   * @param {string} sValue
   * @returns {promise}
   */
  addToList(sList, sValue) {
    return new Promise((resolve, reject) => {
      this.oRedis.RPUSH(sList, sValue, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Insert all the specified values at the head of the list stored at sList.
   *
   * @param {string} sList
   * @param {string} sValue
   * @returns {promise}
   */
  addToLList(sList, sValue) {
    return new Promise((resolve, reject) => {
      this.oRedis.LPUSH(sList, sValue, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes elements equal to sValue from the list stored at sList.
   *
   * @param {string} sList
   * @param {string} sValue
   * @returns {promise}
   */
  delFromList(sList, sValue) {
    return new Promise((resolve, reject) => {
      this.oRedis.LREM(sList, '0', sValue, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns the first element in the list stored at sList.
   *
   * @param {string} sList
   * @returns {promise}
   */
  getFirstFromList(sList) {
    return new Promise((resolve, reject) => {
      this.oRedis.LINDEX(sList, 0, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns all the values from the list stored at sList.
   *
   * @param {string} sList
   * @returns {promise}
   */
  getList(sList) {
    return new Promise((resolve, reject) => {
      const that = this;
      that.oRedis.LLEN(sList, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }
        that.oRedis.LRANGE(sList, 0, oResult - 1, function (eError, oResult) {
          if (eError) {
            return reject(eError);
          }

          return resolve(oResult);
        });
      });
    });
  }
  /**
   * Check if the sValue exists in the list stored at sList.
   *
   * @param {string} sList
   * @param {string} sValue
   * @returns {promise}
   */
  checkInList(sList, sValue) {
    return new Promise((resolve, reject) => {
      const that = this;

      that.oRedis.LLEN(sList, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        that.oRedis.LRANGE(sList, 0, oResult - 1, function (eError, oResult) {
          if (eError) {
            return reject(eError);
          }

          oResult.forEach(function (val, key) {
            if (val === sValue) {
              return resolve(true);
            }
          });

          return resolve(false);
        });
      });
    });
  }
  /**
   * Returns the length of the list stored at sList.
   *
   * @param {string} sList
   * @returns {promise}
   */
  countList(sList) {
    return new Promise((resolve, reject) => {
      this.oRedis.LLEN(sList, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes and returns the first element of the list stored at sList.
   *
   * @param {string} sList
   * @returns {promise}
   */
  lPopList(sList) {
    return new Promise((resolve, reject) => {
      this.oRedis.LPOP(sList, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes and returns the last element of the list stored at sList.
   *
   * @param {string} sList
   * @returns {promise}
   */
  rPopList(sList) {
    return new Promise((resolve, reject) => {
      this.oRedis.RPOP(sList, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes and returns the last element of the list stored at key.
   * It blocks the connection when there are no elements to pop from any of the given lists.
   *
   * @param blockTime
   * @param sList
   * @returns {Promise} an array with list and the element
   */
  pBrpop(sList, blockTime) {
    return new Promise((resolve, reject) => {
      this.oRedis.BRPOP(sList, blockTime, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns all keys matching sFilter.
   *
   * @param {string} sFilter
   * @returns {promise}
   */
  keys(sFilter) {
    return new Promise((resolve, reject) => {
      this.oRedis.KEYS(sFilter, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns if sKey exists.
   *
   * @param {string} sKey
   * @returns {promise}
   */
  exists(sKey) {
    return new Promise((resolve, reject) => {
      this.oRedis.EXISTS(sKey, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Renames sOldKey to sNewKey.
   *
   * @param {string} sOldKey
   * @param {string} sNewKey
   * @returns {promise}
   */
  rename(sOldKey, sNewKey) {
    return new Promise((resolve, reject) => {
      this.oRedis.RENAME(sOldKey, sNewKey, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Removes and returns one or more random elements from the set value store at sSortedSet.
   *
   * @param {string} sSortedSet
   * @returns {promise}
   */
  sPop(sSortedSet) {
    return new Promise((resolve, reject) => {
      this.oRedis.SPOP(sSortedSet, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Add the specified members to the set stored at set.
   *
   * @param {string} set
   * @param {string} member
   * @returns {promise}
   */
  sAdd(set, member) {
    return new Promise((resolve, reject) => {
      this.oRedis.SADD(set, member, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Remove the specified members from the set stored at set.
   *
   * @param {string} set
   * @param {string} member
   * @returns {promise}
   */
  sRem(set, member) {
    return new Promise((resolve, reject) => {
      this.oRedis.SREM(set, member, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Returns all the members of the set value stored at set.
   *
   * @param {string} set
   * @returns {promise}
   */
  sMembers(set) {
    return new Promise((resolve, reject) => {
      this.oRedis.SMEMBERS(set, function (eError, oResult) {
        if (eError) {
          return reject(eError);
        }

        return resolve(oResult);
      });
    });
  }
  /**
   * Posts a message to the given channel.
   *
   * @param {string} channel
   * @param {object} message
   * @returns {promise}
   */
  PUBLISH(channel, message) {
    return new Promise((resolve, reject) => {
      this.oRedis.publish(channel, JSON.stringify(message), function (oError) {
        if (oError) {
          return reject(oError);
        }

        return resolve();
      });
    });
  }
  /**
   * Set a timeout on key.
   *
   * @param {string} key
   * @param {string} time
   * @returns {promise}
   */
  expire(key, time) {
    return new Promise((resolve, reject) => {
      this.oRedis.EXPIRE(key, time, function (eError) {
        if (eError) {
          return reject(eError);
        }

        return resolve();
      });
    });
  }
}

module.exports = mRedis;
