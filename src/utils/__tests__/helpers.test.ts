// utils/__tests__/helpers.test.ts
import {
  chunk,
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  pick,
  omit,
  isEmpty,
  isEqual,
  generateId,
  generateUUID,
  debounce,
  throttle,
  sleep,
  retry,
  timeout,
  storage,
  getQueryParam,
  setQueryParam,
  removeQueryParam,
  getErrorMessage,
  isNetworkError,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction
} from '../helpers';

describe('Helper Utilities', () => {
  describe('chunk', () => {
    it('should chunk arrays correctly', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(chunk(array, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      expect(chunk(array, 2)).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9]]);
    });
  });

  describe('unique', () => {
    it('should remove duplicates from arrays', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' }
      ];
      expect(uniqueBy(array, 'id')).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]);
    });
  });

  describe('groupBy', () => {
    it('should group arrays by key', () => {
      const array = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];
      expect(groupBy(array, 'category')).toEqual({
        A: [{ category: 'A', value: 1 }, { category: 'A', value: 3 }],
        B: [{ category: 'B', value: 2 }]
      });
    });
  });

  describe('sortBy', () => {
    it('should sort arrays by key', () => {
      const array = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 }
      ];
      expect(sortBy(array, 'name')).toEqual([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
        { name: 'Charlie', age: 30 }
      ]);
      expect(sortBy(array, 'age', 'desc')).toEqual([
        { name: 'Bob', age: 35 },
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 }
      ]);
    });
  });

  describe('pick', () => {
    it('should pick specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      expect(omit(obj, ['a', 'c'])).toEqual({ b: 2, d: 4 });
    });
  });

  describe('isEmpty', () => {
    it('should check if values are empty', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('isEqual', () => {
    it('should compare values for equality', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('hello', 'hello')).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate IDs of specified length', () => {
      const id = generateId(10);
      expect(id).toHaveLength(10);
      expect(typeof id).toBe('string');
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUIDs', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', (done) => {
      let callCount = 0;
      const throttledFn = throttle(() => {
        callCount++;
      }, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 50);
    });
  });

  describe('sleep', () => {
    it('should sleep for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Failed');
        }
        return 'success';
      };

      const result = await retry(fn, 3, 10);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw error after max retries', async () => {
      const fn = async () => {
        throw new Error('Always fails');
      };

      await expect(retry(fn, 2, 10)).rejects.toThrow('Always fails');
    });
  });

  describe('timeout', () => {
    it('should resolve before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = await timeout(promise, 1000);
      expect(result).toBe('success');
    });

    it('should reject after timeout', async () => {
      const promise = new Promise(resolve => setTimeout(resolve, 1000));
      await expect(timeout(promise, 100)).rejects.toThrow('Operation timed out');
    });
  });

  describe('storage', () => {
    let mockLocalStorage: any;

    beforeEach(() => {
      // Mock localStorage
      mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });
    });

    it('should store and retrieve data', () => {
      const data = { test: 'value' };
      const jsonData = JSON.stringify(data);
      
      mockLocalStorage.getItem.mockReturnValue(jsonData);
      
      storage.set('test', data);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test', jsonData);
      
      const result = storage.get('test');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test');
      expect(result).toEqual(data);
    });

    it('should return default value for missing key', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(storage.get('missing', 'default')).toBe('default');
    });

    it('should remove data', () => {
      storage.remove('test');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test');
    });

    it('should clear all data', () => {
      storage.clear();
      expect(mockLocalStorage.clear).toHaveBeenCalled();
    });
  });

  describe('getErrorMessage', () => {
    it('should extract error messages', () => {
      expect(getErrorMessage(new Error('Test error'))).toBe('Test error');
      expect(getErrorMessage('String error')).toBe('String error');
      expect(getErrorMessage({})).toBe('An unknown error occurred');
    });
  });

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      expect(isNetworkError(new Error('Network Error'))).toBe(true);
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new Error('ERR_NETWORK'))).toBe(true);
      expect(isNetworkError(new Error('Other error'))).toBe(false);
    });
  });

  describe('type guards', () => {
    it('should check types correctly', () => {
      expect(isString('hello')).toBe(true);
      expect(isString(123)).toBe(false);

      expect(isNumber(123)).toBe(true);
      expect(isNumber('123')).toBe(false);

      expect(isBoolean(true)).toBe(true);
      expect(isBoolean('true')).toBe(false);

      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray('hello')).toBe(false);

      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);

      expect(isFunction(() => {})).toBe(true);
      expect(isFunction('function')).toBe(false);
    });
  });
});
