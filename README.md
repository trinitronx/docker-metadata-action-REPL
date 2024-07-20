# Moment.js docker/metadata-action OCI Date Format REPL

A tool for fiddling with Docker OCI metadata formats
([handlebars][0] -> [moment.js time format string][1]).

A simple REPL is implemented which accepts a bare handlebars string in the
format:

```handlebars
{{ date 'format-string' }}
```

Where '`format-string`' is a [moment.js date format specifier][1]
(e.g. '`YYYY-MM-DD HH:mm:ss.SSSS A Z`' )

Currently only supports handlebars commands, matching the pattern:

```regexp
/^{{.*}}$/
```

## Usage

- View the [live demo here][2]
  - Two dynamically updating example timestamp patterns are provided
    - `{{date 'YYYYMMDD-hhmmss'}}`: A default sample
      [`schedule` date string from docker/metadata-action][3]
    - `YYYY-MM-DDTHH:mm:ss.SSSSZ`: A recommended date format that conforms to
      [both RFC 3339 + ISO 8601][5] (`ISO 8601-1:2019`).  Suitable for use as an
      [Open Container Image (`OCI`) annotation][6]: `org.opencontainers.image.created`
  - Type an arbitrary handlebars date string supported by
    [docker/metadata-action][3] and press <kbd>Enter</kbd> to see how it renders
    to an actual date.

## Known Issues / TODO

- No support for standard readline controls
- Likewise, no support for command history
- No support for paste
- No support for prompt backstop on lines other than 1
  - Currently backspace deletes prompt text if on lines after first one
- No support for other commands (it's a fake command prompt)

[0]: https://handlebarsjs.com/guide/#what-is-handlebars
[1]: https://momentjs.com/docs/#/displaying/format/
[2]: https://jsfiddle.net/TrinitronX/xLpfav96/1481/
[3]: https://github.com/docker/metadata-action/?tab=readme-ov-file#typeschedule
[4]: https://github.com/docker/metadata-action/
[5]: https://ijmacd.github.io/rfc3339-iso8601/
[6]: https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys
