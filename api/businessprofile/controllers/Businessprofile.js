'use strict';

/**
 * Businessprofile.js controller
 *
 * @description: A set of functions called "actions" for managing `Businessprofile`.
 */

module.exports = {

  /**
   * Retrieve businessprofile records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.businessprofile.search(ctx.query);
    } else {
      return strapi.services.businessprofile.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a businessprofile record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.businessprofile.fetch(ctx.params);
  },

  /**
   * Count businessprofile records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.businessprofile.count(ctx.query, populate);
  },

  /**
   * Create a/an businessprofile record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.businessprofile.add(ctx.request.body);
  },

  /**
   * Update a/an businessprofile record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.businessprofile.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an businessprofile record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.businessprofile.remove(ctx.params);
  }
};
