# OrdersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**fulfilOrder**](OrdersApi.md#fulfilorderoperation) | **POST** /orders/{orderId}/fulfil |  |
| [**listOrders**](OrdersApi.md#listorders) | **GET** /orders |  |
| [**orderBooks**](OrdersApi.md#orderbooks) | **POST** /orders |  |



## fulfilOrder

> PlaceBooksOnShelf200Response fulfilOrder(orderId, fulfilOrderRequest)



Fulfil an order

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { FulfilOrderOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OrdersApi();

  const body = {
    // string
    orderId: orderId_example,
    // FulfilOrderRequest
    fulfilOrderRequest: ...,
  } satisfies FulfilOrderOperationRequest;

  try {
    const data = await api.fulfilOrder(body);
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
| **orderId** | `string` |  | [Defaults to `undefined`] |
| **fulfilOrderRequest** | [FulfilOrderRequest](FulfilOrderRequest.md) |  | |

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


## listOrders

> Array&lt;OrderSummary&gt; listOrders()



List orders

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { ListOrdersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OrdersApi();

  try {
    const data = await api.listOrders();
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

[**Array&lt;OrderSummary&gt;**](OrderSummary.md)

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


## orderBooks

> OrderBooks200Response orderBooks(createOrderRequest)



Create an order

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '';
import type { OrderBooksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OrdersApi();

  const body = {
    // CreateOrderRequest
    createOrderRequest: ...,
  } satisfies OrderBooksRequest;

  try {
    const data = await api.orderBooks(body);
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
| **createOrderRequest** | [CreateOrderRequest](CreateOrderRequest.md) |  | |

### Return type

[**OrderBooks200Response**](OrderBooks200Response.md)

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

