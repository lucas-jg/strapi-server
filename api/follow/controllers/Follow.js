'use strict';

/**
 * Follow.js controller
 *
 * @description: A set of functions called "actions" for managing `Follow`.
 */

module.exports = {

  /**
   * Retrieve follow records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.follow.search(ctx.query);
    } else {
      return strapi.services.follow.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a follow record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.follow.fetch(ctx.params);
  },

  /**
   * Count follow records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.follow.count(ctx.query, populate);
  },

  /**
   * Create a/an follow record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.follow.add(ctx.request.body);
  },

  /**
   * Update a/an follow record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.follow.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an follow record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.follow.remove(ctx.params);
  }
};
