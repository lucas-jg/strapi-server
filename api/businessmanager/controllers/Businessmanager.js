'use strict';

/**
 * Businessmanager.js controller
 *
 * @description: A set of functions called "actions" for managing `Businessmanager`.
 */

module.exports = {

  /**
   * Retrieve businessmanager records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.businessmanager.search(ctx.query);
    } else {
      return strapi.services.businessmanager.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a businessmanager record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.businessmanager.fetch(ctx.params);
  },

  /**
   * Count businessmanager records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.businessmanager.count(ctx.query, populate);
  },

  /**
   * Create a/an businessmanager record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.businessmanager.add(ctx.request.body);
  },

  /**
   * Update a/an businessmanager record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.businessmanager.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an businessmanager record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.businessmanager.remove(ctx.params);
  }
};
