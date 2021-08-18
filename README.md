# Expanded Translation Tools for I18N-js

This set of tools uses the `i18n-js` library and expands it to support react components and other features.

It's main offerings are the `translate` function and the `Translate` react component. Both offer access to
translation strings with multiple lookups, pluralization and interpolation.

```
translate(scope, { lookup, fallback, pluralFor, values  } )
```

```
<Translate scope lookup fallback pluralFor values  />
```

## SIMPLE TRANSLATIONS

A `scope` string references a specific value in the translation files managed by `i18n-js` for the current locale.

This string is a dot-separated list of names such as `example.messages.label` or `errors.access.not_allowed` that
is used to search in the `locale` data managed by a rails application as YAML files inside `config/locale`.

## PLURALIZATION

If `scope` matches a set of translations instead of a single string, keyed with `one`, `other` and `zero`, then the
value of `pluralFor` is used to select the appropriate variation to pluralize that particular number.

The default value for `pluralFor` is `1` to make it easier to expand our translation trees.
This comes handy when we start with a simple scope such as `example.units.boards`, matched
with a translation value of `example.units.boards = 'Board'`.
If/when we decide we need another subscope, such as `example.units.boards.withQuantity`,
we can update the translation values so that `example.units.boards` becomes `example.units.boards.one`
without having to change existing code that uses `example.units.boards` as a scope.
Otherwise, adding subkeys to translation values at `example.units.boards` would cause errors.

##  INTERPOLATION

The translation string matched by `scope` can include interpolation placeholders using `${name}` or `{{name}}`,
which get replaced with the value for the given `name` included in `values`.

## LOOKUP

The given `scope` can include placeholders using `[name]` --the scope, not the resulting translation string--
which get replaced with values for the given `name` included in `lookup`. Values are also retrieved from the
"global translation lookups" described below.

These values are "normalized" to use only underscores and lowercase alphanumeric characters.

If `name` corresponds to an array instead of a single value, then the `scope` will be used to search
under those possible values.

This means for example: a `scope` of `"example.[type].[level].label"`
with `lookup = {type: 'Name', level: ['Specific', 'Generic']}`
will search for translation strings under `example.name.specific.label` first,
and if not found, under `example.name.generic.label`.

If a scope has multiple parts that map into arrays, all combinations will be searched.

If no matching string is found, then the optional `fallback` will be used instead.

## LOCALE AND LOOKUP GLOBAL CONTEXT

The library provides a `setLocale` method to set the current locale (an identifier for language and
regional variations such as `"en-US"` for American English or "es" for Spanish). There is also
a `getLocale` if you need to retrieve the current locale.

You can also define "global translation lookup values" with `addGlobalTranslationLookup(key, value)`
and can be reset with `resetGlobalTranslationLookups()`.

These values are used along with explicit `lookup` values for all calls to `translate`.

## CREDITS

This library was originally developed at [Artemis](https://artemisag.com/) by [Sebastián Delmont](https://github.com/sd).
