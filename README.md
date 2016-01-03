# Unobtrusive AJAX framework for Booya PHP framework

Download `booya-ajax.min.js`.

## API

### Links

If a link should trigger an AJAX request into the `#content` element:

```
<a href="page2" class="js-ajax">Link</a>
```

Or load it into `#my_div`:

```
<a href="page2" class="js-ajax" data-target="#my_div">Link</a>
```

Open response in a new popup dialog:

```
<a href="page2" class="js-ajax" data-target="dialog">Link</a>
```

To change the size of dialog, set `data-dimensions` attribute:

```
<a href="page2" class="js-ajax" data-target="dialog" data-dimensions="700x400">Link</a>
```

### Forms

Forms can be sent through ajax:

```
<form action="page" method="POST" class="js-ajax"></form>
```

`data-target` and `data-dimensions` is supported on forms too.

## Bugs and improvements

Report bugs in GitHub issues or feel free to make a pull request :-)

## License

MIT