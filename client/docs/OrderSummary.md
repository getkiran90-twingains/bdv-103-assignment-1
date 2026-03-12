
# OrderSummary


## Properties

Name | Type
------------ | -------------
`orderId` | string
`books` | { [key: string]: number; }

## Example

```typescript
import type { OrderSummary } from ''

// TODO: Update the object below with actual values
const example = {
  "orderId": null,
  "books": null,
} satisfies OrderSummary

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OrderSummary
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


