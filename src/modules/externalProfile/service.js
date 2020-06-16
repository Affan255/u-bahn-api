/**
 * the external profile services
 */

const joi = require('@hapi/joi')
const models = require('../../models/index')
const helper = require('../../common/helper')
const methods = helper.getServiceMethods(
  models.ExternalProfile,
  { // create request body joi schema
    userId: joi.string().required(),
    organizationId: joi.string().required(),
    externalId: joi.string().required(),
    uri: joi.string().required()
  },
  { // patch request body joi schema
    userId: joi.string().required(),
    organizationId: joi.string().required(),
    externalId: joi.string(),
    uri: joi.string()
  },
  { // search request query joi schema
    userId: joi.string().required(),
    externalId: joi.string(),
    organizationName: joi.string()
  },
  async (query) => { // build search query by request
    const dbQueries = ['SELECT * FROM Organization, ExternalProfile',
      `ExternalProfile.userId = '${query.userId}'`,
      'ExternalProfile.organizationId = Organization.id']
    // filter by organization name
    if (query.organizationName) {
      dbQueries.push(`Organization.name like '%${query.organizationName}%'`)
    }
    if (query.externalId) {
      dbQueries.push(`ExternalProfile.externalId like '%${query.externalId}%'`)
    }

    return dbQueries
  },
  [['userId', 'organizationId']] // unique fields
)

module.exports = {
  ...methods
}
