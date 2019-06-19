/* global Goods */
'use strict';

/**
 * Goods.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');


module.exports = {

  /**
   * Promise to fetch all goods.
   *
   * @return {Promise}
   */

  fetchAll: (params, populate) => {
    // Select field to populate.
    const withRelated = populate || Goods.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const filters = convertRestQueryParams(params);

    return Goods.query(buildQuery({ model: Goods, filters }))
      .fetchAll({ withRelated })
      .then(data => data.toJSON());
  },

  /**
   * Promise to fetch a/an goods.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Goods.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Goods.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an goods.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = convertRestQueryParams(params);

    return Goods.query(buildQuery({ model: Goods, filters: _.pick(filters, 'where') })).count();
  },

  /**
   * Promise to add a/an goods.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Goods.associations.map(ast => ast.alias));
    const data = _.omit(values, Goods.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Goods.forge(data).save();

    // Create relational data and return the entry.
    return Goods.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an goods.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Goods.associations.map(ast => ast.alias));
    const data = _.omit(values, Goods.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Goods.forge(params).save(data);

    // Create relational data and return the entry.
    return Goods.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an goods.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Goods.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Goods.updateRelations(params);

    return Goods.forge(params).destroy();
  },

  /**
   * Promise to search a/an goods.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('goods', params);
    // Select field to populate.
    const populate = Goods.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Goods.associations.map(x => x.alias);
    const searchText = Object.keys(Goods._attributes)
      .filter(attribute => attribute !== Goods.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Goods._attributes[attribute].type));

    const searchInt = Object.keys(Goods._attributes)
      .filter(attribute => attribute !== Goods.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Goods._attributes[attribute].type));

    const searchBool = Object.keys(Goods._attributes)
      .filter(attribute => attribute !== Goods.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Goods._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Goods.query(qb => {
      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Goods.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      withRelated: populate
    });
  }
};
