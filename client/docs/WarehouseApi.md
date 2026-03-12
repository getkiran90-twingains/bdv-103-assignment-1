# WarehouseApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**findBookOnShelf**](WarehouseApi.md#findbookonshelf) | **GET** /warehouse/books/{bookId} |  |
| [**placeBooksOnShelf**](WarehouseApi.md#placebooksonshelf) | **POST** /warehouse/shelves/{shelf}/books/{bookId} |  |



## findBookOnShelf

> Array&lt;ShelfStock&gt; findBookOnShelf(bookId)



### Example

```ts
import {
  Configuration,
  WarehouseApi,
} from '';
import type { FindBookOnShelfRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarehouseApi();

  const body = {
    // string
    bookId: bookId_example,
  } satisfies FindBookOnShelfRequest;

  try {
    const data = await api.findBookOnShelf(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **bookId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;ShelfStock&gt;**](ShelfStock.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## placeBooksOnShelf

> PlaceBooksOnShelf200Response placeBooksOnShelf(shelf, bookId, placeBooksRequest)



### Example

```ts
import {
  Configuration,
  WarehouseApi,
} from '';
import type { PlaceBooksOnShelfRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WarehouseApi();

  const body = {
    // string
    shelf: shelf_example,
    // string
    bookId: bookId_example,
    // PlaceBooksRequest
    placeBooksRequest: ...,
  } satisfies PlaceBooksOnShelfRequest;

  try {
    const data = await api.placeBooksOnShelf(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **shelf** | `string` |  | [Defaults to `undefined`] |
| **bookId** | `string` |  | [Defaults to `undefined`] |
| **placeBooksRequest** | [PlaceBooksRequest](PlaceBooksRequest.md) |  | |

### Return type

[**PlaceBooksOnShelf200Response**](PlaceBooksOnShelf200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

