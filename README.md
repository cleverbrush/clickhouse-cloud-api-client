# Clickhouse Cloud API Client

A TypeScript library for accessing the [Clickhouse Cloud REST API](https://clickhouse.com/docs/en/cloud/manage/api/api-overview). This library can be used in both Node.js and web browser environments.

## Installation

```bash
npm install @cleverbrush/clickhouse-cloud-api-client
```

## Usage

```typescript
import { ClickhouseCloudApiClient } from "@cleverbrush/clickhouse-cloud-api-client";

const client = new ClickhouseCloudApiClient("your-key-id", "your-key-secret");
```

## Available Methods

**Note:** Currently, this library supports only a few methods that were personally needed. If you require additional functionality, feel free to contribute by adding more methods from the Clickhouse Cloud API.

### getServiceDetails(organizationId: string, serviceId: string)

Retrieves details of a specific service.

```typescript
const serviceDetails = await client.getServiceDetails(
  "organization-id",
  "service-id",
);
```

### updateServiceScaling(organizationId: string, serviceId: string, scaling: object)

Updates the scaling configuration of a specific service.

```typescript
const updatedService = await client.updateServiceScaling(
  "org-id",
  "service-id",
  {
    minTotalMemoryGb: 8,
    maxTotalMemoryGb: 16,
  },
);
```

### wakeUpService(organizationId: string, serviceId: string)

Wakes up a service that is in an idle state.

```typescript
const awakenedService = await client.wakeUpService("org-123", "service-456");
```

## Response Types

All methods return a promise that resolves with a `ClickhouseCloudApiResponse<T>` object, where `T` is the specific type of data returned (e.g., `ServiceDetails`).

For detailed type information, please refer to the source code.

## Error Handling

The client will throw an error if the HTTP request fails or returns a non-OK status code. Make sure to wrap your calls in try-catch blocks for proper error handling.

```typescript
try {
  const serviceDetails = await client.getServiceDetails(
    "org-123",
    "service-456",
  );
} catch (error) {
  console.error("Failed to get service details:", error);
}
```

## Contributing

Contributions are welcome! If you need additional functionality from the Clickhouse Cloud API, please feel free to submit a Pull Request adding new methods to the client.

## License

This project is licensed under the BSD-3-Clause License.
