import { normalizeScopeKey } from './expandScopeTemplate'

let GlobalTranslationLookup = { facility: ['default'] }

export function addGlobalTranslationLookup (key, value) {
  GlobalTranslationLookup[key] = value
}

export function getGlobalTranslationLookups () {
  return GlobalTranslationLookup
}

export function resetGlobalTranslationLookups () {
  GlobalTranslationLookup = {}
}

export function setTranslationLookupForFacility (facility) {
  const values = []

  if (facility && facility.organization) {
    const facSlug = normalizeScopeKey(facility.slug)
    const orgSlug = normalizeScopeKey(facility.organization.slug)

    values.push(`${orgSlug}__${facSlug}`)
    values.push(orgSlug)
  }

  values.push('default')

  addGlobalTranslationLookup('facility', values)
}
