/**
 * Loads all the files in given context and returns them in object with key matching filename.
 * @param  {Require Context} context The require context you want to use.
 * @return {Object}                  Object with keys matching filename and values matching module.
 */
import { subAppApiConfigs } from 'sub_apps'
import * as acl from './acl'

const { sc, tw, fb, pt } = subAppApiConfigs

export default { acl, sc, tw, pt, fb }
