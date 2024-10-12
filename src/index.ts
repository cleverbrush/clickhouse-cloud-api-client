/**
 * Client for interacting with the Clickhouse Cloud API.
 */
export class ClickhouseCloudApiClient {
  #keyId: string;
  #keySecret: string;
  #apiBaseUrl: string;

  /**
   * Creates a new instance of the ClickhouseCloudApiClient.
   * @param keyId - The API key ID for authentication (used as username).
   * @param keySecret - The API key secret for authentication (used as password).
   * @param apiBaseUrl - The base URL for the API. Defaults to 'https://api.clickhouse.cloud'.
   */
  constructor(
    keyId: string,
    keySecret: string,
    apiBaseUrl: string = "https://api.clickhouse.cloud"
  ) {
    this.#keyId = keyId;
    this.#keySecret = keySecret;
    this.#apiBaseUrl = apiBaseUrl;
  }

  /**
   * Creates the Basic Auth header value.
   * @returns The Base64 encoded Basic Auth string.
   */
  #createBasicAuthHeader(): string {
    const authString = `${this.#keyId}:${this.#keySecret}`;
    return `Basic ${Buffer.from(authString).toString("base64")}`;
  }

  /**
   * Makes an HTTP request to the Clickhouse Cloud API.
   * @param endpoint - The API endpoint to call.
   * @param method - The HTTP method to use.
   * @param body - The request body (optional).
   * @returns A promise that resolves with the JSON response from the API.
   * @throws An error if the HTTP request fails.
   */
  async #makeRequest<T>(
    endpoint: string,
    method: string,
    body?: object
  ): Promise<ClickhouseCloudApiResponse<T>> {
    const url = `${this.#apiBaseUrl}${endpoint}`;
    const headers = new Headers({
      Authorization: this.#createBasicAuthHeader(),
      "Content-Type": "application/json",
    });

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Retrieves details of a specific service.
   * @param organizationId - The ID of the organization.
   * @param serviceId - The ID of the service.
   * @returns A promise that resolves with the service details.
   */
  async getServiceDetails(
    organizationId: string,
    serviceId: string
  ): Promise<ClickhouseCloudApiResponse<ServiceDetails>> {
    return this.#makeRequest<ServiceDetails>(
      `/v1/organizations/${organizationId}/services/${serviceId}`,
      "GET"
    );
  }

  /**
   * Updates the scaling configuration of a specific service.
   * @param organizationId - The ID of the organization.
   * @param serviceId - The ID of the service.
   * @param scaling - The scaling configuration to apply.
   * @returns A promise that resolves with the updated service scaling configuration.
   */
  async updateServiceScaling(
    organizationId: string,
    serviceId: string,
    scaling: {
      /** The minimum total memory in GB. */
      minTotalMemoryGb: number;
      /** The maximum total memory in GB. */
      maxTotalMemoryGb: number;
      /** The number of replicas. */
      numReplicas?: number;
      /** Whether idle scaling is enabled. */
      idleScaling?: boolean;
      /** The idle timeout in minutes. */
      idleTimeoutMinutes?: number;
    }
  ): Promise<ClickhouseCloudApiResponse<ServiceDetails>> {
    return this.#makeRequest<ServiceDetails>(
      `/v1/organizations/${organizationId}/services/${serviceId}/scaling`,
      "PATCH",
      scaling
    );
  }

  async setServiceState(
    organizationId: string,
    serviceId: string,
    state: "start" | "stop"
  ): Promise<ClickhouseCloudApiResponse<ServiceDetails>> {
    return this.#makeRequest<ServiceDetails>(
      `/v1/organizations/${organizationId}/services/${serviceId}/state`,
      "PATCH",
      {
        command: state,
      }
    );
  }
}

/**
 * Generic type for Clickhouse Cloud API responses
 */
export type ClickhouseCloudApiResponse<T> = {
  result: T;
  requestId: string;
  /** HTTP status code. */
  status: number;
};

/**
 * Type for the service details.
 */
export type ServiceDetails = {
  id: string;
  name: string;
  provider: string;
  region: string;
  state: string;
  endpoints: {
    protocol: string;
    host: string;
    port: number;
  }[];
  tier: string;
  idleScaling: boolean;
  idleTimeoutMinutes: number;
  minTotalMemoryGb: number;
  maxTotalMemoryGb: number;
  minReplicaMemoryGb: number;
  maxReplicaMemoryGb: number;
  ipAccessList: {
    source: string;
    description: string;
  }[];
  createdAt: string;
  iamRole: string;
  privateEndpointIds: string[];
  dataWarehouseId: string;
  isPrimary: boolean;
};
