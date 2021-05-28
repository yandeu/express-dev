# Express Dev

Contains some nice express wrapper function for simplifying express development.

## Modules

_For now, there is only one._

### Express Listen

- Tries the next port if the current is not available.
- Provides a nice kill switch.
- Automatically opens your browser.

```js
const listen = new ExpressListen(app)
const openBrowser = true

listen.listen(port, openBrowser).then(port => {
  console.log(`Running on port ${port}`)
})

setTimeout(async () => {
  await listen.kill()
}, 5000)
```
