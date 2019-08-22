# web-beacon-api

How to implement them for analytics?

- how frequent
- handling errors
- sending json data
- data payload format
- what data to send
- sending data for different environment (staging, testing, production)
- can we wrap it in a library?

## Usage

The request will be a HTTP POST request to the designated endpoint:

```js
navigator.sendBeacon('<your_url>')
```
## Sending Data

Query string parameters:
```js
navigator.sendBeacon('analytics?id=123')
```

String:
```js
const data = JSON.stringify({
	location: window.location,
	time: Date.now()
})
navigator.sendBeacon('analytics', data)
```

FormData:
```js
const formData = new FormData()
formData.append('session', '123')
formData.append('id', 11) // This will be converted to string on the server side.
navigator.sendBeacon('analytics', formData)
```

Blob:
```js
// This seems to be failing at the moment of writing.
const ua = JSON.stringify({ua: navigator.userAgent, now: performance.now()})
const headers = { type: 'application/json' }
const blob = new Blob([ua], headers)
navigator.sendBeacon('analytics', blob)
```

## Usage

### Page Lifecycle

```js
const analytics = {start: performance.now(), visibility: []}
window.addEventListener('unload', evt => {
	analytics.stop = performance.now()
	navigator.sendBeacon('/lifecycle', JSON.stringify(analytics))
})

document.addEventListener('visibilitychange', evt => {
	analytics.visibility.push({ 
		state: document.visibilityState,
		ts: event.timestamp
	})
}) 
```

### Performance

```js
window.addEventListener('unload', evt => {
	navigator.sendBeacon('/performance', JSON.stringify(performance.timing))
})
```


### Global error handling

```js
// or window.addEventListener('error', evt => {
//  evt.message, evt.filename, evt.lineno, evt.colno, evt.error
// })
window.onerror = function(msg, url, line, col, error) {
	const formData = new FormData()
	formData.append('url', url)
	formData.append('line', line)
	formData.append('col', col)
	formData.append('error', error)
	navigator.sendBeacon('/clientError', formData)
}
```

### Position

```js
navigator.geolocation.watchPosition(pos => {
	const position = {
		latitude: pos.coords.latitude,
		longitude: pos.coords.longitude,
		ts: pos.timestamp
	}
	navigator.sendBeacon('/position', JSON.stringify(position))
})
```

### Reporting Observer

```js
const observer = new ReportingObserver((reports, observer) => {
	for (const report of reports) {
		navigator.sendBeacon('/reportObserver', JSON.stringify(report))
	}
}, { types: ['intervention', 'deprecation'], buffered: true })

observer.observe()
```


### Generic Sensor API
```js
const sensor = new Accelerometer()
sensor.start()
sensor.onreading = () => {
	const formData = new FormData()
	formData.append('x', sensor.x)
	formData.append('y', sensor.y)
	formData.append('z', sensor.z)
	navigator.sendBeacon('/sensor', formData)
}
```


## References

- https://golb.hplar.ch/2018/09/beacon-api.html
- https://developers.google.com/web/updates/2018/07/page-lifecycle-api
- https://developer.mozilla.org/en-US/docs/Web/API/Performance
