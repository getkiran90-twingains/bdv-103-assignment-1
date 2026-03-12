
# Book


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`author` | string
`description` | string
`price` | number
`image` | string
`stock` | number

## Example

```typescript
import type { Book } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "author": null,
  "description": null,
  "price": null,
  "image": null,
  "stock": null,
} satisfies Book

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Book
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


