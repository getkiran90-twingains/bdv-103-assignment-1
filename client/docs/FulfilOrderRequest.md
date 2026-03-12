
# FulfilOrderRequest


## Properties

Name | Type
------------ | -------------
`booksFulfilled` | [Array&lt;FulfilOrderRequestBooksFulfilledInner&gt;](FulfilOrderRequestBooksFulfilledInner.md)

## Example

```typescript
import type { FulfilOrderRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "booksFulfilled": null,
} satisfies FulfilOrderRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FulfilOrderRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


