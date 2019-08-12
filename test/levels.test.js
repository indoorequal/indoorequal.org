import { findAllLevels } from '../js/levels';

describe('findAllLevels', () => {
  it('find one level', () => {
    expect(findAllLevels([
      {
        properties: {
          level: 0
        }
      },
      {
        properties: {
          level: 0
        }
      }
    ])).toEqual([0]);
  });

  it('find multiple levels', () => {
    expect(findAllLevels([
      {
        properties: {
          level: 0
        }
      },
      {
        properties: {
          level: 1
        }
      }
    ])).toEqual([1, 0]);
  });

  it('sort levels', () => {
    expect(findAllLevels([
      {
        properties: {
          level: 1
        }
      },
      {
        properties: {
          level: 0
        }
      }
    ])).toEqual([1, 0]);
  });

   it('sort levels with minus', () => {
    expect(findAllLevels([
      {
        properties: {
          level: 1
        }
      },
      {
        properties: {
          level: -1
        }
      },
      {
        properties: {
          level: -2
        }
      },
      {
        properties: {
          level: 0
        }
      }
    ])).toEqual([1, 0, -1, -2]);
  });

  it('find zero levels', () => {
    expect(findAllLevels([])).toEqual([]);
  });
});
