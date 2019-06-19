'use strict';

/**
 * Goods.js controller
 *
 * @description: A set of functions called "actions" for managing `Goods`.
 */

module.exports = {

  /**
   * Retrieve goods records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.goods.search(ctx.query);
    } else {
      return strapi.services.goods.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a goods record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.goods.fetch(ctx.params);
  },

  /**
   * Count goods records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.goods.count(ctx.query, populate);
  },

  /**
   * Create a/an goods record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.goods.add(ctx.request.body);
  },

  /**
   * Update a/an goods record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.goods.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an goods record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.goods.remove(ctx.params);
  }
};
