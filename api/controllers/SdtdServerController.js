var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  /**
   * @memberof SdtdServer
   * @description Starts detecting events for a server
   * @param {number} serverID ID of the server
   */

  startLogging: async function (req, res) {
    const serverID = req.param('serverID');
    sails.log.info(`Starting logging for ${serverID}`);
    try {
      sails.hooks.sdtdlogs.start(serverID);
    } catch (error) {
      res.serverError(error);
    }
  },

  /**
   * @memberof SdtdServer
   * @description Stops detecting events for a server
   * @param {number} serverID ID of the server
   */

  stopLogging: async function (req, res) {
    const serverID = req.param('serverID');
    sails.log.info(`Stopping logging for ${serverID}`);
    try {
      sails.hooks.sdtdlogs.stop(serverID);
    } catch (error) {
      res.serverError(error);
    }
  },

  /**
   * @memberof SdtdServer
   * @description Load/update server info and save to DB
   * @param {number} serverID ID of the server
   */

  loadServerInfo: function (req, res) {
    const serverId = req.param('serverID');
    sails.log.debug(`Updating server info for ${serverId}`);
    if (_.isUndefined(serverId)) {
      return res.badRequest('No server ID given.');
    }
    sails.helpers.loadServerInfo({
      serverId: serverId
    }).exec({
      success: function () {
        return res.ok();
      },
      connectionError: function (error) {
        return res.badRequest(new Error('Could not connect to server'));
      },
      databaseError: function (error) {
        return res.serverError(new Error('Database error'));
      }
    });
  },

  // _____  ______  _____ _______            _____ _____
  // |  __ \|  ____|/ ____|__   __|     /\   |  __ \_   _|
  // | |__) | |__  | (___    | |       /  \  | |__) || |
  // |  _  /|  __|  \___ \   | |      / /\ \ |  ___/ | |
  // | | \ \| |____ ____) |  | |     / ____ \| |    _| |_
  // |_|  \_\______|_____/   |_|    /_/    \_\_|   |_____|

  /**
   * @memberof SdtdServer
   * @description GET online players
   * @param {number} serverID ID of the server
   */

  onlinePlayers: function (req, res) {
    const serverID = req.query.serverId;

    sails.log.debug(`Showing online players for ${serverID}`);

    if (_.isUndefined(servuest('No server ID given');
    } else {erID)) {
      return res.badReq
      sails.models.sdtdserver.findOne({
        id: serverID
      }).exec(function (error, server) {
        if (error) {
          sails.log.error(error);
          res.serverError(error);
        }
        sevenDays.getOnlinePlayers({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken,
        }).exec({
          error: function (error) {
            return res.serverError(error);
          },
          connectionRefused: function (error) {
            return res.badRequest(error);
          },
          unauthorized: function (error) {
            return res.badRequest(error);
          },
          success: function (data) {
            return res.status(200).json(data);
          }
        });
      });
    }
  },

  /**
   * @memberof SdtdServer
   * @description Get information about all players that have logged into the server
   * @param {number} serverID ID of the server
   */

  getPlayers: function (req, res) {
    const serverId = req.query.serverId;
    if (_.isUndefined(serverId)) {
      return res.badRequest('No server ID given.');
    }
    sails.log.debug(`Showing all players for ${serverId}`);

    SdtdServer.findOne({
      id: serverId
    }).exec(function (err, server) {
      if (err) {
        return res.serverError(new Error(`Database error`));
      }
      sevenDays.getPlayerList({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
      }).exec({
        error: function (error) {
          return res.serverError(error);
        },
        connectionRefused: function (error) {
          return res.badRequest(error);
        },
        unauthorized: function (error) {
          return res.badRequest(error);
        },
        success: function (data) {
          return res.status(200).json(data.players);
        }
      });
    });

  },

  /**
   * @memberof SdtdServer
   * @description Get basic information and game settings of a 7dtd server
   * @param {number} serverID ID of the server
   */

  getServerInfo: function (req, res) {
    const serverId = req.query.serverId;
    if (_.isUndefined(serverId)) {
      return res.badRequest('No server ID given.');
    }
    sails.log.debug(`Showing server info for ${serverId}`);
    SdtdServer.findOne({
      id: serverId
    }).exec(function (err, foundServer) {
      if (err) {
        return res.serverError(new Error(`Database error`));
      }
      return res.json(foundServer);
    });

  },


};
