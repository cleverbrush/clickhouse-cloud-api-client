import { describe, it, expect } from 'vitest';
import { ClickhouseCloudApiClient } from '../index';

describe('ClickhouseCloudApiClient', () => {
  it('should create an instance with default base URL', () => {
    const client = new ClickhouseCloudApiClient('keyId', 'keySecret');
    expect(client).toBeDefined();
  });

  it('should create an instance with custom base URL', () => {
    const client = new ClickhouseCloudApiClient('keyId', 'keySecret', 'https://custom.api.url');
    expect(client).toBeDefined();
  });
});