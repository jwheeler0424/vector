import {describe, expect, test} from '@jest/globals';
import { parsePath } from "../Functions/ParsePath";

// Testing accepted parsed results
describe('ParsePath - Accepted Parsed Result', () => {
  // Testing static path
  test('       STATIC -> /example/users/add', () => {
      const path = '/example/users/add';
      const result = parsePath(path);
      expect(result).toEqual([
        {
          label: "",
          type: 1,
          params: null
        },
        {
          label: "example",
          type: 1,
          params: null
        },
        {
          label: "users",
          type: 1,
          params: null
        },
        {
          label: "add",
          type: 1,
          params: null
        }
      ])
  });

  // Testing path with parameters
  test('        PARAM -> /example/users/:id', () => {
    const path = '/example/users/:id';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "users",
        type: 1,
        params: null
      },
      {
        label: ":id",
        type: 4,
        params: [
          {
            name: "id",
            value: null,
            optional: false,
            regexp: null
          }
        ]
      }
    ])
  });

  // Testing path with optional parameters
  test('    OPT_PARAM -> /example/users/:id?', () => {
    const path = '/example/users/:id?';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "users",
        type: 1,
        params: null
      },
      {
        label: ":id?",
        type: 12,
        params: [
          {
            name: "id",
            value: null,
            optional: true,
            regexp: null
          }
        ]
      }
    ])
  });

  // Testing path with multiple parameters
  test('  MULTI_PARAM -> /example/near/:lat-:lng/radius/:r', () => {
    const path = '/example/near/:lat-:lng/radius/:r';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "near",
        type: 1,
        params: null
      },
      {
        label: ":lat-:lng",
        type: 20,
        params: [
          {
            name: "lat",
            value: null,
            optional: false,
            regexp: null
          },
          {
            name: "lng",
            value: null,
            optional: false,
            regexp: null
          }
        ]
      },
      {
        label: "radius",
        type: 1,
        params: null
      },
      {
        label: ":r",
        type: 4,
        params: [
          {
            name: "r",
            value: null,
            optional: false,
            regexp: null
          }
        ]
      }
    ])
  });

  // Testing path with non-parameterized '::' path
  test('    NON_PARAM -> /example/users/profile::add', () => {
    const path = '/example/users/profile::add';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "users",
        type: 1,
        params: null
      },
      {
        label: "profile:add",
        type: 3,
        params: null
      }
    ])
  });

  // Testing path with regular expression
  test('       REGEXP -> /example/users/(^\\d+)', () => {
    const path = '/example/users/(^\\d+)';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "users",
        type: 1,
        params: null
      },
      {
        label: "(^\\d+)",
        type: 32,
        params: [
          {
            name: "",
            value: "(^\\d+)",
            optional: false,
            regexp: new RegExp("(^\\d+)")
          }
        ]
      }
    ])
  });

  // Testing path with multiple regular expressions, NO PARAMS
  test(' MULTI_REGEXP -> /example/at/(^\\d{2})h(^\\d{2})m', () => {
    const path = '/example/at/(^\\d{2})h(^\\d{2})m';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "at",
        type: 1,
        params: null
      },
      {
        label: "(^\\d{2})h(^\\d{2})m",
        type: 96,
        params: [
          {
            "name": "",
            "value": "(^\\d{2})h",
            "optional": false,
            "regexp": new RegExp("(^\\d{2})h")
          },
          {
            "name": "",
            "value": "(^\\d{2})m",
            "optional": false,
            "regexp": new RegExp("(^\\d{2})m")
          }
        ]
      }
    ])
  });

  // Testing path with multiple regular expressions, WITH PARAMS
  test(' MULTI_REGPAR -> /example/image/:file(^\\d+).:ext(png | jpg | jpeg | gif)', () => {
    const path = '/example/image/:file(^\\d+).:ext(png | jpg | jpeg | gif)';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "image",
        type: 1,
        params: null
      },
      {
        label: ":file(^\\d+).:ext(png | jpg | jpeg | gif)",
        type: 116,
        params: [
          {
            "name": "file",
            "value": "(^\\d+).",
            "optional": false,
            "regexp": new RegExp("(^\\d+).")
          },
          {
            "name": "ext",
            "value": "(png | jpg | jpeg | gif)",
            "optional": false,
            "regexp": new RegExp("(png | jpg | jpeg | gif)")
          }
        ]
      }
    ])
  });

  // Testing path with multiple regular expressions, WITH PARAMS
  test(' MULTI_REGPAR -> /example/at/:hour(^\\d{2})h:minute(^\\d{2})m', () => {
    const path = '/example/at/:hour(^\\d{2})h:minute(^\\d{2})m';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "at",
        type: 1,
        params: null
      },
      {
        label: ":hour(^\\d{2})h:minute(^\\d{2})m",
        type: 116,
        params: [
          {
            "name": "hour",
            "value": "(^\\d{2})h",
            "optional": false,
            "regexp": new RegExp("(^\\d{2})h")
          },
          {
            "name": "minute",
            "value": "(^\\d{2})m",
            "optional": false,
            "regexp": new RegExp("(^\\d{2})m")
          }
        ]
      }
    ])
  });

  // Testing path with wildcard
  test('     WILDCARD -> /example/*', () => {
    const path = '/example/*';
    const result = parsePath(path);
    expect(result).toEqual([
      {
        label: "",
        type: 1,
        params: null
      },
      {
        label: "example",
        type: 1,
        params: null
      },
      {
        label: "*",
        type: 128,
        params: null
      }
    ])
  });
});

// Testing rejected parsed results
describe('ParsePath - Rejected Parsed Result', () => {
  // Testing path with invalid starting character
  test('INVALID_START -> example/users/:id', () => {
    const path = 'example/users/:id';
    expect(() => parsePath(path)).toThrow('Path must start with "/" or be a wildcard "*"');
  });

  // Testing path with invalid parameter and non-parameterized path
  test('INVALID_NONPARAM -> /example/users/:::id', () => {
    const path = '/example/users/:::id';
    expect(() => parsePath(path)).toThrow('A parameter cannot be defined with a ":" in the name');
  });

  // Testing path with invalid parameter
  test('INVALID_PARAM -> /example/users/:id:user', () => {
    const path = '/example/users/:id:user';
    expect(() => parsePath(path)).toThrow('There must be a separating delimiter between parameters');
  });

  // Testing path with invalid regular expression
  test('INVALID_REGEXP -> /example/users/(^\\d+))', () => {
    const path = '/example/users/(^\\d+))';
    expect(() => parsePath(path)).toThrow('RegExp closing delimiter ")" is missing opening delimiter "("');
  });

  // Testing path with invalid regular expression
  test('INVALID_REGEXP -> /example/users/((^\\d+)', () => {
    const path = '/example/users/((^\\d+)';
    expect(() => parsePath(path)).toThrow('RegExp has no closing delimiter ")"');
  });

  // Testing path with invalid wildcard
  test('INVALID_WILDCARD -> /example/*users', () => {
    const path = '/example/*users';
    expect(() => parsePath(path)).toThrow('A wildcard "*" cannot be followed by any characters');
  });

  // Testing path with invalid wildcard
  test('INVALID_WILDCARD -> /example/**', () => {
    const path = '/example/**';
    expect(() => parsePath(path)).toThrow('A wildcard "*" cannot be followed by any characters');
  });

  // Testing path with invalid wildcard
  test('INVALID_WILDCARD -> /example/users*', () => {
    const path = '/example/users*';
    expect(() => parsePath(path)).toThrow('A wildcard "*" cannot follow other characters');
  });
});