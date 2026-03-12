# BooksApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBook**](BooksApi.md#createbook) | **POST** /books |  |
| [**deleteBook**](BooksApi.md#deletebook) | **DELETE** /books/{id} |  |
| [**getBook**](BooksApi.md#getbook) | **GET** /books/{id} |  |
| [**listBooks**](BooksApi.md#listbooks) | **GET** /books |  |
| [**updateBook**](BooksApi.md#updatebook) | **PUT** /books/{id} |  |



## createBook

> Book createBook(requestBody)



### Example

```ts
import {
  Configuration,
  BooksApi,
} from '';
import type { CreateBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BooksApi();

  const body = {
    // { [key: string]: any; }
    requestBody: Object,
  } satisfies CreateBookRequest;

  try {
    const data = await api.createBook(body);
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
| **requestBody** | `{ [key: string]: any; }` |  | |

### Return type

[**Book**](Book.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteBook

> DeleteBook200Response deleteBook(id)



### Example

```ts
import {
  Configuration,
  BooksApi,
} from '';
import type { DeleteBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BooksApi();

  const body = {
    // string
    id: id_example,
  } satisfies DeleteBookRequest;

  try {
    const data = await api.deleteBook(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DeleteBook200Response**](DeleteBook200Response.md)

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


## getBook

> Book getBook(id)



### Example

```ts
import {
  Configuration,
  BooksApi,
} from '';
import type { GetBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BooksApi();

  const body = {
    // string
    id: id_example,
  } satisfies GetBookRequest;

  try {
    const data = await api.getBook(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Book**](Book.md)

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


## listBooks

> Array&lt;Book&gt; listBooks()



### Example

```ts
import {
  Configuration,
  BooksApi,
} from '';
import type { ListBooksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BooksApi();

  try {
    const data = await api.listBooks();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Book&gt;**](Book.md)

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


## updateBook

> Book updateBook(id, requestBody)



### Example

```ts
import {
  Configuration,
  BooksApi,
} from '';
import type { UpdateBookRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BooksApi();

  const body = {
    // string
    id: id_example,
    // { [key: string]: any; }
    requestBody: Object,
  } satisfies UpdateBookRequest;

  try {
    const data = await api.updateBook(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **requestBody** | `{ [key: string]: any; }` |  | |

### Return type

[**Book**](Book.md)

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

